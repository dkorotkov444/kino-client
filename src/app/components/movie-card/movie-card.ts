/**
 * @module
 * @category Components
 * @fileoverview Movie card component for Kino app
 * @author Dmitri Korotkov
 * @copyright Dmitri Korotkov 2025
 */
// src/app/movie-card/movie-card.ts

// Angular core & common
import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
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
import { MatSnackBar } from '@angular/material/snack-bar';

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
import { map } from 'rxjs/operators';

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
    private userService = inject(UserService);
    private authService = inject(AuthService);
    private dialog = inject(MatDialog);
    private snackBar = inject(MatSnackBar);
    private cdr = inject(ChangeDetectorRef);

    // Reactive state
    private searchTermSubject = new BehaviorSubject<string>('');
    
    movies$!: Observable<Movie[]>;
    filteredMovies$!: Observable<Movie[]>;
    
    searchTerm = '';
    currentIndex = 0;

    /**
     * Angular lifecycle hook. Initializes movie streams and filtering logic.
     */
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

    /**
     * Handles changes to the search input and resets the carousel index.
     */
    onSearchChange(): void {
        this.searchTermSubject.next(this.searchTerm);
        this.currentIndex = 0;          // Reset carousel to first movie when searching
    }

    /**
     * Navigate to the previous movie in the carousel.
     * @param moviesLength Total number of movies
     */
    previousMovie(moviesLength: number): void {
        this.currentIndex--;
        if (this.currentIndex < 0) {
            this.currentIndex = moviesLength - 1;
        }
    }

    /**
     * Navigate to the next movie in the carousel.
     * @param moviesLength Total number of movies
     */
    nextMovie(moviesLength: number): void {
        this.currentIndex++;
        if (this.currentIndex >= moviesLength) {
            this.currentIndex = 0;
        }
    }

    // Action dialogs
    /**
     * Open the director dialog for the given movie.
     * @param movie Movie object
     */
    openDirector(movie: Movie): void {
        if (movie?.director) {
            this.dialog.open(DirectorDialogComponent, { data: movie.director, width: '420px' });
        }
    }

    /**
     * Open the genre dialog for the given movie.
     * @param movie Movie object
     */
    openGenre(movie: Movie): void {
        if (movie?.genre) {
            this.dialog.open(GenreDialogComponent, { data: movie.genre, width: '420px' });
        }
    }

    /**
     * Open the description dialog for the given movie.
     * @param movie Movie object
     */
    openDescription(movie: Movie): void {
        this.dialog.open(DescriptionDialogComponent, { data: { title: movie.title, description: movie.description }, width: '520px' });
    }

    /**
     * Open the starring dialog for the given movie.
     * @param movie Movie object
     */
    openStarring(movie: Movie): void {
        this.dialog.open(StarringDialogComponent, { data: { starring: movie.starring || [] }, width: '420px' });
    }

    /**
     * Function to determine the heart icon state (always solid red if favorited)
     */
    /**
     * Determine if the movie is a favorite for the current user.
     * @param movie Movie object
     * @returns True if favorite, false otherwise
     */
     isFavorite(movie: Movie): boolean {
        const user = this.authService.getUser();
        // Check if the user is logged in, has favorites, and the current movie is in the list
        if (!user || !user.favorites || !movie?._id) {
            return false;
        }
        // Check against the MongoDB ID for accurate comparison
        return user.favorites.includes(movie._id);
    }

    /**
     * Handles favorite toggling internally for the standalone movie card.
     */
    /**
     * Toggle the favorite status of a movie for the current user.
     * @param movie Movie object
     */
    toggleFavorite(movie: Movie): void {

        const user = this.authService.getUser();
        if (!user || !movie?._id) {
            this.snackBar.open('Please log in to manage favorites.', 'Close', { duration: 3000 });
            return;
        }

        const username = user.username;
        const favorites: string[] = user.favorites || [];

        // Check against movie._id if movie is already a favorite
        const isFavorite = favorites.includes(movie._id);
        
        // API endpoint requires movie.title for adding/removing favorites
        const req$ = isFavorite
            ? this.userService.removeFavoriteMovie(username, movie._id)
            : this.userService.addFavoriteMovie(username, movie._id);

        req$.subscribe({
            next: (updatedUser) => { 
                this.authService.setUser(updatedUser); 
                this.cdr.detectChanges();
                // Provide feedback based on the action performed
                this.snackBar.open(
                    `${movie.title} ${isFavorite ? 'removed from' : 'added to'} favorites.`, 
                    'Close', 
                    { duration: 2000 }
                )
            },
        });
    }

    // Minimal helper to render multiple cards in viewport without changing navigation logic
    /**
     * Get up to 3 consecutive movies for display in the carousel.
     * @param all Array of all movies
     * @returns Array of visible movies
     */
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
