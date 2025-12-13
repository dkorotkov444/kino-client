import { Injectable } from '@angular/core';
import { HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root',
})
export class ApiBaseService {
    protected apiUrl = environment.apiUrl;

    /**
     * Get authorization headers with JWT token from localStorage
     */
    protected getAuthHeaders(): HttpHeaders {
        let headers: { [key: string]: string } = {};
        if (typeof localStorage !== 'undefined') {
            const token = localStorage.getItem('token');
            if (token) {
                headers = { Authorization: 'Bearer ' + token };
            }
        }
        return new HttpHeaders(headers);
    }

    /**
     * Centralized error handling for HTTP requests
     */
    protected handleError(error: HttpErrorResponse): Observable<never> {
        if (error.error instanceof ErrorEvent) {
            console.error('Some error occurred:', error.error.message);
        } else {
            console.error(
                `Error Status code ${error.status}, ` +
                `Error body is: ${error.error}`
            );
        }
        return throwError(() => new Error('Something bad happened; please try again later.'));
    }
}
