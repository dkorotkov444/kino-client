// src/app/movie-card/movie-card.ts

import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MovieService } from '../../services/movie.service';
import { Movie } from '../../models/movie';
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
    ],
    templateUrl: './movie-card.html',
    styleUrl: './movie-card.scss',
})
export class MovieCardComponent implements OnInit {
    private movieService = inject(MovieService);
    
    // Reactive state
    private searchTermSubject = new BehaviorSubject<string>('');
    
    movies$!: Observable<Movie[]>;
    filteredMovies$!: Observable<Movie[]>;
    
    searchTerm = '';

    ngOnInit(): void {
        // Cache and share the movie list to avoid multiple HTTP calls from multiple subscriptions
        this.movies$ = this.movieService.getAllMovies().pipe(
            shareReplay(1)
        );
        
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
    }
}
