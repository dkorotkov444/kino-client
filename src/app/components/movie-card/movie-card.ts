// src/app/movie-card/movie-card.ts

// Angular core & common
import { Component, inject, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// Angular Material
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
// App services & models
import { MovieService } from '../../services/movie.service';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';
import { Movie } from '../../models/movie';

// Local components
import { DirectorDialogComponent } from '../director-dialog/director-dialog';
import { GenreDialogComponent } from '../genre-dialog/genre-dialog';
import { DescriptionDialogComponent } from '../description-dialog/description-dialog';
import { StarringDialogComponent } from '../starring-dialog/starring-dialog';

// RxJS
import { BehaviorSubject, Observable, combineLatest } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';

@Component({
    standalone: true,
    selector: 'kino-movie-card',
    imports: [
        CommonModule,
        FormsModule,
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        MatChipsModule,
        MatButtonModule,
        MatIconModule,
    ],
    templateUrl: './movie-card.html',
    styleUrl: './movie-card.scss',
})
export class MovieCardComponent implements OnInit {
    private movieService = inject(MovieService);
    readonly dialog = inject(MatDialog);
    private userService = inject(UserService);
    private authService = inject(AuthService);

    // Inputs
    @Input() movie!: Movie;
    @Input() isFavorite: boolean = false; // New input to control heart icon state
    @Input() showChips: boolean = true; 

    // Emits the full Movie object when the favorite button is clicked in the profile
    @Output() favoriteToggled = new EventEmitter<Movie>();
    
    // Reactive state
    private searchTermSubject = new BehaviorSubject<string>('');
    
    movies$!: Observable<Movie[]>;
    filteredMovies$!: Observable<Movie[]>;
    
    searchTerm = '';
    currentIndex = 0;

    ngOnInit(): void {
        // Cache and share the movie list to avoid multiple HTTP calls from multiple subscriptions
        this.movies$ = this.movieService.getAllMovies().pipe();
        
        // Filter movies based on search term
        this.filteredMovies$ = combineLatest([
            this.movies$,
            this.searchTermSubject
        ]).pipe(
            map(([movies, searchTerm]) => {
                const query = searchTerm.trim();
                if (query.length < 5) {
                    return movies;
                }
                
                const q = query.toLowerCase();
                return movies.filter(movie => {
                    const title = (movie.title || '').toLowerCase();
                    const director = (movie.director?.name || '').toLowerCase();
                    const genre = (movie.genre?.name || '').toLowerCase();
                    const starring = Array.isArray(movie.starring) ? movie.starring.join(' ').toLowerCase() : '';
                    return title.includes(q) || director.includes(q) || genre.includes(q) || starring.includes(q);
                });
            })
        );
    }

    onSearchChange(): void {
        this.searchTermSubject.next(this.searchTerm);
        // Reset carousel to first movie when searching
        this.currentIndex = 0;
    }

    previousMovie(moviesLength: number): void {
        this.currentIndex--;
        if (this.currentIndex < 0) {
            this.currentIndex = moviesLength - 1;
        }
    }

    nextMovie(moviesLength: number): void {
        this.currentIndex++;
        if (this.currentIndex >= moviesLength) {
            this.currentIndex = 0;
        }
    }

    // Action dialogs
    openDirector(movie: Movie): void {
        if (movie?.director) {
            this.dialog.open(DirectorDialogComponent, { data: movie.director, width: '420px' });
        }
    }

    openGenre(movie: Movie): void {
        if (movie?.genre) {
            this.dialog.open(GenreDialogComponent, { data: movie.genre, width: '420px' });
        }
    }

    openDescription(movie: Movie): void {
        this.dialog.open(DescriptionDialogComponent, { data: { title: movie.title, description: movie.description }, width: '520px' });
    }

    openStarring(movie: Movie): void {
        this.dialog.open(StarringDialogComponent, { data: { starring: movie.starring || [] }, width: '420px' });
    }

    toggleFavorite(movie: Movie): void {

        // 1. Logic for reuse in User Profile: If a parent is listening via the output, emit the event.
        if (this.favoriteToggled.observed) {
            this.favoriteToggled.emit(movie);
            return;
        }
        // 2. Logic for standalone (Movie Card): Handle favorite toggling internally.
        const user = this.authService.getUser();
        if (!user || !movie?.title) return;
        const username = user.username;
        const favorites: string[] = user.favorites || [];

        // Check if movie is already a favorite
        const isFavorite = favorites.includes(movie._id);
        
        const req$ = isFavorite
            ? this.userService.removeFavoriteMovie(username, movie.title)
            : this.userService.addFavoriteMovie(username, movie.title);

        req$.subscribe({
            next: (updatedUser) => { this.authService.setUser(updatedUser); },
        });
    }

    // Minimal helper to render multiple cards in viewport without changing navigation logic
    getVisibleMovies(all: Movie[]): Movie[] {
        if (!all || all.length === 0) return [];
        const len = all.length;
        const i0 = this.currentIndex;
        const i1 = i0 + 1 >= len ? 0 : i0 + 1;
        const i2 = i1 + 1 >= len ? 0 : i1 + 1;
        // Return up to 3 consecutive movies; CSS decides how many fit
        if (len === 1) return [all[i0]];
        if (len === 2) return [all[i0], all[i1]];
        return [all[i0], all[i1], all[i2]];
    }
}
