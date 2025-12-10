import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ApiBaseService } from './api-base.service';

@Injectable({
    providedIn: 'root',
})
export class MovieService extends ApiBaseService {
    constructor(private http: HttpClient) {
        super();
    }


    /**
     * Get all movies (Protected Route)
     * GET to /movies
     */
    public getAllMovies(): Observable<any> { // Note: Use a specific type instead of 'any' later!
        return this.http.get(this.apiUrl + 'movies', {
            headers: this.getAuthHeaders(),
        }).pipe(
            catchError(this.handleError)
        );
    }

    /**
     * Get all movies with complete details
     * GET to /movies/complete
     */
    // TODO: Implement getCompleteMovies method

    /**
     * Get single movie by title
     * GET to /movies/{title}
     */
    // TODO: Implement getMovieByTitle method

    /**
     * Get genre information
     * GET to /movies/genres/{genreName}
     */
    // TODO: Implement getGenre method

    /**
     * Get director information
     * GET to /movies/directors/{directorName}
     */
    // TODO: Implement getDirector method

    /**
     * Get actors starring in a movie
     * GET to /movies/{title}/starring
     */
    // TODO: Implement getMovieActors method

    /**
     * Get actor information
     * GET to /movies/actors/{actorName}
     */
    // TODO: Implement getActor method
}
