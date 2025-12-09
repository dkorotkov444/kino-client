import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

const apiUrl = 'YOUR_HOSTED_API_URL_HERE/';

@Injectable({
    providedIn: 'root',
})

export class FetchApiDataService {
    constructor(private http: HttpClient) {}
    
    // Making the API call for the user registration endpoint
    public userRegistration(userDetails: any): Observable<any> {
        console.log(userDetails);
        return this.http.post(apiUrl + 'users', userDetails).pipe(
            catchError(this.handleError)
        );
    }

    // Making the API call to get all movies (Protected Route)
    public getAllMovies(): Observable<any> { // Note: Use a specific type instead of 'any' later!
    
        const token = localStorage.getItem('token');    // Retrieve the token from local storage

        return this.http.get(apiUrl + 'movies', {
            headers: new HttpHeaders({
                Authorization: 'Bearer ' + token,
            }),
        }).pipe(
            catchError(this.handleError)
        );
    }

    private handleError(error: HttpErrorResponse): Observable<never> { 
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
