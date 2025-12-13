// src/app/app.ts

import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MovieCardComponent } from './components/movie-card/movie-card';    

@Component({
    selector: 'app-root',
    imports: [
        CommonModule,
        RouterOutlet,
        MatDialogModule,
        MatButtonModule,
    ],
    templateUrl: './app.html',
    styleUrl: './app.scss'
})
export class AppComponent {
    protected readonly title = signal('kino-client');

    readonly dialog: MatDialog = inject(MatDialog);

    /**
     * Opens the movie card component inside an Angular Material Dialog.
     */
    openMoviesDialog(): void {
        this.dialog.open(MovieCardComponent, {
          width: '900px',
          maxWidth: '90vw'
        });
      }
}

