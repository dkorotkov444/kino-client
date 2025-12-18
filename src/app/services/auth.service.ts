/**
 * @module
 * @category Services
 * @fileoverview Auth API service for Kino app
 * @author Dmitri Korotkov
 * @copyright Dmitri Korotkov 2025
 */

// Angular
import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

// RxJS
import { Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

// App services
import { ApiBaseService } from './api-base.service';

@Injectable({
    providedIn: 'root',
})
/**
 * Service for authentication-related API operations.
 * Handles login, token, and user data management.
 * @extends ApiBaseService
 */
export class AuthService extends ApiBaseService {
    /**
     * Angular Router instance for navigation.
     */
    private router: Router = inject(Router);

    /**
     * Creates an instance of AuthService.
     * @param http Angular HttpClient for HTTP requests
     */
    constructor(private http: HttpClient) {
        super();
    }

    /**
     * Logs in a user and returns JWT token and user profile.
     * @route /login
     * @method POST
     * @param credentials Object with username and password
     * @returns Observable with user object and token string
     */
    public login(credentials: { username: string; password: string }): Observable<any> {
        return this.http.post(this.apiUrl + 'login', credentials).pipe(
            tap((response: any) => {
                // Automatically store token and user data after successful login
                if (response.token) {
                    this.setToken(response.token);
                }
                if (response.user) {
                    this.setUser(response.user);
                }
            }),
            catchError(this.handleError)
        );
    }

    /**
     * Stores JWT token in localStorage.
     * @param token JWT token string
     */
    setToken(token: string): void {
        localStorage.setItem('token', token);
    }

    /**
     * Stores user data in localStorage.
     * @param user User object
     */
    setUser(user: any): void {
        localStorage.setItem('user', JSON.stringify(user));
    }

    /**
     * Gets JWT token from localStorage.
     * @returns JWT token string or null
     */
    getToken(): string | null {
        return localStorage.getItem('token');
    }

    /**
     * Get user data from localStorage
     */
    getUser(): any {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    }

    /**
     * Check if user is authenticated
     */
    isAuthenticated(): boolean {
        return !!this.getToken();
    }

    /**
     * Logout user by clearing token and user data. After logout, navigates to welcome page.
     */
    logout(): void {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        this.router.navigate(['welcome']);
    }
}
