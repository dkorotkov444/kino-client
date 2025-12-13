// src/app/movie-card/movie-card.ts

import { Component, Injectable, inject, OnInit } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { MovieService } from '../../services/movie.service';

@Component({
    standalone: true,
    selector: 'kino-movie-card',
    imports: [
        AsyncPipe,
        MatCardModule,
        MatDialogModule,
    ],
    templateUrl: './movie-card.html',
    styleUrl: './movie-card.scss',
})
export class MovieCardComponent implements OnInit {
    private movieService = inject(MovieService);
    // The movies array is an Observable that emits the array. Observable<any> matches the service's current return type.
    public movies$!: Observable<any>; // Note: Use a specific type instead of 'any' later!

    constructor() {}

    ngOnInit(): void {
        // Directly assign the Observable returned by the service.
        this.movies$ = this.movieService.getAllMovies();
    }

}
