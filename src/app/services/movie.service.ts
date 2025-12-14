import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, tap } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ApiBaseService } from './api-base.service';
import { Movie } from '../models/movie';

@Injectable({
    providedIn: 'root',
})
export class MovieService extends ApiBaseService {
    constructor(private http: HttpClient) {
        super();
    }


    /**
     * Get all movie titles only
     * GET to /movies/list
     * @returns Observable with array of movie title strings
     */
    public getMovieList(): Observable<any> {
        return this.http.get(this.apiUrl + 'movies/list').pipe(
            catchError(this.handleError)
        );
    }

    /**
     * Get all movies with full details
     * GET to /movies
     * @returns Observable with array of complete movie objects
     */
    public getAllMovies(): Observable<Movie[]> {
        return this.http.get<Movie[]>(this.apiUrl + 'movies').pipe(
            tap((response) => console.log('Movies response', response)),
            catchError((error) => {
                console.error('Movies request failed', error);
                return of([] as Movie[]);
            })
        );
    }

    /**
     * Get single movie by title
     * GET to /movies/:title
     * @param title - Movie title
     * @returns Observable with single movie object
     */
    public getMovieByTitle(title: string): Observable<Movie> {
        return this.http.get<Movie>(this.apiUrl + 'movies/' + title).pipe(
            catchError(this.handleError)
        );
    }

    /**
     * Get genre information by name
     * GET to /movies/genres/:genreName
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
     * GET to /movies/directors/:directorName
     * @param directorName - Director name (e.g., 'Quentin Tarantino')
     * @returns Observable with director object { name, bio, birth_date }
     */
    public getDirector(directorName: string): Observable<any> {
        return this.http.get(this.apiUrl + 'movies/directors/' + directorName).pipe(
            catchError(this.handleError)
        );
    }

    /**
     * Get actors starring in a movie
     * GET to /movies/:title/starring
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
     * GET to /movies/actors/:actorName
     * @param actorName - Actor name
     * @returns Observable with actor information
     */
    public getActor(actorName: string): Observable<any> {
        return this.http.get(this.apiUrl + 'movies/actors/' + actorName).pipe(
            catchError(this.handleError)
        );
    }
}
