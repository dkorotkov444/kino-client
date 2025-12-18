
/**
 * @file src/app/services/user.service.ts
 * @fileoverview User API service for Kino app
 * @author Dmitri Korotkov
 * @copyright Dmitri Korotkov 2025
 */

// Angular
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

// RxJS
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

// App services
import { ApiBaseService } from './api-base.service';

@Injectable({
    providedIn: 'root',
})
/**
 * Service for user-related API operations.
 * Handles user registration, retrieval, and updates.
 * @extends ApiBaseService
 */
export class UserService extends ApiBaseService {
    /**
     * Creates an instance of UserService.
     * @param http Angular HttpClient for HTTP requests
     */
    constructor(private http: HttpClient) {
        super();
    }

    /**
     * Returns a list of all users (for admin use only).
     * @route /users
     * @method GET
     * @returns Observable with array of user objects
     */
    public getAllUsers(): Observable<any> {
        return this.http.get(this.apiUrl + 'users').pipe(
            catchError(this.handleError)
        );
    }

    /**
     * Registers a new user.
     * @route /users
     * @method POST
     * @param userDetails Object containing username, password, email, and optional birth_date
     * @returns Observable with newly created user object
     */
    public userRegistration(userDetails: any): Observable<any> {
        console.log(userDetails);
        return this.http.post(this.apiUrl + 'users', userDetails).pipe(
            catchError(this.handleError)
        );
    }

    // getUserProfile not implemented - not in API documentation

    /**
     * Updates user information.
     * @route /users/:username
     * @method PATCH
     * @param username Current username
     * @param updates Object with newUsername, newPassword, newEmail, or newBirthDate
     * @returns Observable with updated user object
     */
    public updateUser(username: string, updates: any): Observable<any> {
        return this.http.patch(this.apiUrl + 'users/' + username, updates).pipe(
            catchError(this.handleError)
        );
    }

    /**
     * Delete user account
     * @route /users/:username
     * @method DELETE
     * @param username Username to delete
     * @returns Observable with confirmation message
     */
    public deleteUser(username: string): Observable<any> {
        return this.http.delete(this.apiUrl + 'users/' + username, { responseType: 'text' as 'json' }).pipe(
            catchError(this.handleError)
        );
    }

    /**
     * Add movie to user's favorites
     * @route /users/:username/:movieId
     * @method PATCH
     * @param username Username
     * @param movieId Movie ID to add
     * @returns Observable with updated user object
     */
    public addFavoriteMovie(username: string, movieId: string): Observable<any> {
        return this.http.patch(this.apiUrl + 'users/' + username + '/' + movieId, {}).pipe(
            catchError(this.handleError)
        );
    }

    /**
     * Remove movie from user's favorites
     * @route /users/:username/:movieId
     * @method DELETE
     * @param username Username
     * @param movieId Movie ID to remove
     * @returns Observable with updated user object
     */
    public removeFavoriteMovie(username: string, movieId: string): Observable<any> {
        return this.http.delete(this.apiUrl + 'users/' + username + '/' + movieId).pipe(
            catchError(this.handleError)
        );
    }
}
