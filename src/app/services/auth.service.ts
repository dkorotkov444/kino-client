// Angular core
import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';

// HTTP & RxJS
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

// App services
import { ApiBaseService } from './api-base.service';

@Injectable({
    providedIn: 'root',
})
export class AuthService extends ApiBaseService {
    private router: Router = inject(Router);

    constructor(private http: HttpClient) {
        super();
    }

    /**
     * Login user and return JWT token + user profile
     * POST to /login
     * @param credentials - { username: string, password: string }
     * @returns Observable with { user: object, token: string }
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
     * Store JWT token in localStorage
     */
    setToken(token: string): void {
        localStorage.setItem('token', token);
    }

    /**
     * Store user data in localStorage
     */
    setUser(user: any): void {
        localStorage.setItem('user', JSON.stringify(user));
    }

    /**
     * Get JWT token from localStorage
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
     * Logout user by clearing token and user data
     */
    logout(): void {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        this.router.navigate(['welcome']);      // Redirect to welcome/login page
    }
}
