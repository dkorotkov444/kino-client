import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ApiBaseService } from './api-base.service';

@Injectable({
    providedIn: 'root',
})
export class UserService extends ApiBaseService {
    constructor(private http: HttpClient) {
        super();
    }


    /**
     * Register a new user
     * POST to /users
     */
    public userRegistration(userDetails: any): Observable<any> {
        console.log(userDetails);
        return this.http.post(this.apiUrl + 'users', userDetails).pipe(
            catchError(this.handleError)
        );
    }

    /**
     * Get user profile
     * GET to /users/{username}
     */
    // TODO: Implement getUserProfile method

    /**
     * Update user information
     * PATCH to /users/{username}
     */
    // TODO: Implement updateUser method

    /**
     * Delete user account
     * DELETE to /users/{username}
     */
    // TODO: Implement deleteUser method

    /**
     * Add movie to user's favorites
     * PATCH to /users/{username}/{movieTitle}
     */
    // TODO: Implement addFavoriteMovie method

    /**
     * Remove movie from user's favorites
     * DELETE to /users/{username}/{movieTitle}
     */
    // TODO: Implement removeFavoriteMovie method
}
