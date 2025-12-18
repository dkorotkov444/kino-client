/**
 * @module
 * @category Services
 * @fileoverview Base service for API operations and error handling in Kino app
 * @author Dmitri Korotkov
 * @copyright Dmitri Korotkov 2025
 */


// Angular
import { Injectable, inject } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';

// RxJS
import { Observable, throwError } from 'rxjs';

// App environment
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root',
})
/**
 * Base service for API operations.
 * Provides common functionality such as error handling and API URL management.
 */
export class ApiBaseService {
    /**
     * Base URL for API endpoints.
     */
    protected apiUrl = environment.apiUrl;
    /**
     * Angular Material Snackbar for notifications.
     */
    private snackBar = inject(MatSnackBar);

    /**
     * Centralized error handling for HTTP requests with user-friendly notifications.
     * @param error HTTP error response
     * @returns Observable that throws an error
     */
    protected handleError = (error: HttpErrorResponse): Observable<never> => {
        let userMessage = 'An unexpected error occurred. Please try again.';
        
        if (error.error instanceof ErrorEvent) {
            // Client-side or network error
            console.error('Network error:', error.error.message);
            userMessage = 'Network error. Please check your connection.';
        } else {
            // Backend returned an error response
            console.error(
                `Error Status: ${error.status}, ` +
                `Message: ${error.message}, ` +
                `Body: ${JSON.stringify(error.error)}`
            );
            
            // Specific messages based on status code
            switch (error.status) {
                case 400:
                    userMessage = 'Invalid request. Please check your input.';
                    break;
                case 401:
                    userMessage = 'Unauthorized. Please log in again.';
                    break;
                case 403:
                    userMessage = 'Access denied. You don\'t have permission.';
                    break;
                case 404:
                    userMessage = 'Resource not found.';
                    break;
                case 409:
                    userMessage = 'Conflict. This item already exists.';
                    break;
                case 422:
                    userMessage = 'Validation failed. Please check your input.';
                    break;
                case 500:
                    userMessage = 'Server error. Please try again later.';
                    break;
                case 503:
                    userMessage = 'Service unavailable. Please try again later.';
                    break;
            }
            
            // Use backend error message if available
            if (error.error && typeof error.error === 'string') {
                userMessage = error.error;
            } else if (error.error && error.error.message) {
                userMessage = error.error.message;
            }
        }
        
        // Show snackbar notification to user
        this.snackBar.open(userMessage, 'Close', {
            duration: 5000,
            horizontalPosition: 'center',
            verticalPosition: 'bottom',
            panelClass: ['error-snackbar']
        });
        
        return throwError(() => new Error(userMessage));
    }
}
