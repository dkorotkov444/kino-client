// Angular core
import { Injectable } from '@angular/core';

// HTTP & RxJS
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

// App services
import { ApiBaseService } from './api-base.service';

@Injectable({
    providedIn: 'root',
})
export class UserService extends ApiBaseService {
    constructor(private http: HttpClient) {
        super();
    }

    /**
     * Return a list of all users (for admin use only)
     * GET to /users
     * @returns Observable with array of user objects
     */
    public getAllUsers(): Observable<any> {
        return this.http.get(this.apiUrl + 'users').pipe(
            catchError(this.handleError)
        );
    }

    /**
     * Register a new user
     * POST to /users
     * @param userDetails - { username, password, email, birth_date? }
     * @returns Observable with newly created user object
     */
    public userRegistration(userDetails: any): Observable<any> {
        console.log(userDetails);
        return this.http.post(this.apiUrl + 'users', userDetails).pipe(
            catchError(this.handleError)
        );
    }

    /**
     * Get user profile by username
     * Note: API doesn't have GET /users/:username endpoint documented
     * Users get their profile from login response
     */
    // getUserProfile not implemented - not in API documentation

    /**
     * Update user information
     * PATCH to /users/:username
     * @param username - Current username
     * @param updates - { newUsername?, newPassword?, newEmail?, newBirthDate? }
     * @returns Observable with updated user object
     */
    public updateUser(username: string, updates: any): Observable<any> {
        return this.http.patch(this.apiUrl + 'users/' + username, updates).pipe(
            catchError(this.handleError)
        );
    }

    /**
     * Delete user account
     * DELETE to /users/:username
     * @param username - Username to delete
     * @returns Observable with confirmation message
     */
    public deleteUser(username: string): Observable<any> {
        return this.http.delete(this.apiUrl + 'users/' + username).pipe(
            catchError(this.handleError)
        );
    }

    /**
     * Add movie to user's favorites
     * PATCH to /users/:username/:movieTitle
     * @param username - Username
     * @param movieTitle - Movie title to add
     * @returns Observable with updated user object
     */
    public addFavoriteMovie(username: string, movieTitle: string): Observable<any> {
        return this.http.patch(this.apiUrl + 'users/' + username + '/' + movieTitle, {}).pipe(
            catchError(this.handleError)
        );
    }

    /**
     * Remove movie from user's favorites
     * DELETE to /users/:username/:movieTitle
     * @param username - Username
     * @param movieTitle - Movie title to remove
     * @returns Observable with updated user object
     */
    public removeFavoriteMovie(username: string, movieTitle: string): Observable<any> {
        return this.http.delete(this.apiUrl + 'users/' + username + '/' + movieTitle).pipe(
            catchError(this.handleError)
        );
    }
}
