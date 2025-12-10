import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiBaseService } from './api-base.service';

@Injectable({
    providedIn: 'root',
})
export class AuthService extends ApiBaseService {
    constructor(private http: HttpClient) {
        super();
    }


    /**
     * Login user and store JWT token
     * POST to /auth/login
     */
    // TODO: Implement login method

    /**
     * Store JWT token in localStorage
     */
    setToken(token: string): void {
        localStorage.setItem('token', token);
    }

    /**
     * Get JWT token from localStorage
     */
    getToken(): string | null {
        return localStorage.getItem('token');
    }

    /**
     * Check if user is authenticated
     */
    isAuthenticated(): boolean {
        return !!this.getToken();
    }

    /**
     * Logout user by clearing token
     */
    logout(): void {
        localStorage.removeItem('token');
        localStorage.removeItem('user'); // If you store user data
    }
}
