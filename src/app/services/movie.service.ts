
/**
 * @file src/app/services/movie.service.ts
 * @fileoverview Movie API service for Kino app
 * @author Dmitri Korotkov
 * @copyright Dmitri Korotkov 2025
 */

// Angular
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

// RxJS
import { Observable, of, tap } from 'rxjs';
import { catchError, shareReplay } from 'rxjs/operators';

// App services & models
import { ApiBaseService } from './api-base.service';
import { Movie } from '../models/movie';

@Injectable({
    providedIn: 'root',
})
/**
 * Service for movie-related API operations.
 * Handles fetching movie lists, details, and caching.
 * @extends ApiBaseService
 */
export class MovieService extends ApiBaseService {
    /**
     * Cached observable for all movies.
     */
    private allMovies$: Observable<Movie[]> | null = null;

    /**
     * Creates an instance of MovieService.
     * @param http Angular HttpClient for HTTP requests
     */
    constructor(private http: HttpClient) {
        super();
    }

    /**
     * Gets all movie titles only.
     * @route GET /movies/list
     * @returns Observable with array of movie title strings
     */
    public getMovieList(): Observable<any> {
        return this.http.get(this.apiUrl + 'movies/list').pipe(
            catchError(this.handleError)
        );
    }

    /**
     * Gets all movies with full details (cached).
     * @route GET /movies
     * @returns Observable with array of complete movie objects
     */
    public getAllMovies(): Observable<Movie[]> {
        if (!this.allMovies$) {
            this.allMovies$ = this.http.get<Movie[]>(this.apiUrl + 'movies').pipe(
                tap((response) => console.log('[MovieService] Fetching all movies from API. Total:', response.length)),
                catchError((error) => {
                    console.error('Movies request failed', error);
                    return of([] as Movie[]);
                }),
                shareReplay(1)
            );
        }
        return this.allMovies$;
    }

    /**
     * Gets a single movie by title.
     * @route GET /movies/:title
     * @param title Movie title
     * @returns Observable with single movie object
     */
    public getMovieByTitle(title: string): Observable<Movie> {
        return this.http.get<Movie>(this.apiUrl + 'movies/' + title).pipe(
            catchError(this.handleError)
        );
    }

    /**
     * Get genre information by name
     * @route GET /movies/genres/:genreName
     * @param genreName - Genre name (e.g., 'Sci-Fi', 'Crime')
     * @returns Observable with genre object { name, description }
     */
    public getGenre(genreName: string): Observable<any> {
        return this.http.get(this.apiUrl + 'movies/genres/' + genreName).pipe(
            catchError(this.handleError)
        );
    }

    /**
     * Get director information by name
     * @route GET /movies/directors/:directorName
     * @param directorName - Director name (e.g., 'Quentin Tarantino')
     * @returns Observable with director object { name, bio, birth_date, death_date }
     */
    public getDirector(directorName: string): Observable<any> {
        return this.http.get(this.apiUrl + 'movies/directors/' + directorName).pipe(
            catchError(this.handleError)
        );
    }

    /**
     * Get actors starring in a movie
     * @route GET /movies/:title/starring
     * @param title - Movie title
     * @returns Observable with array of actor name strings
     */
    public getMovieActors(title: string): Observable<string[]> {
        return this.http.get<string[]>(this.apiUrl + 'movies/' + title + '/starring').pipe(
            catchError(this.handleError)
        );
    }

    /**
     * Get actor information by name
     * @route GET /movies/actors/:actorName
     * @param actorName - Actor name
     * @returns Observable with actor information
     */
    public getActor(actorName: string): Observable<any> {
        return this.http.get(this.apiUrl + 'movies/actors/' + actorName).pipe(
            catchError(this.handleError)
        );
    }
}
