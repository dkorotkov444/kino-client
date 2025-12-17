/**
 * @file src/app/components/genre-dialog/genre-dialog.ts
 * @fileoverview Dialog component to display genre information in Kino app
 * @author Dmitri Korotkov
 * @copyright Dmitri Korotkov 2025
 */
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';

@Component({
    standalone: true,
    selector: 'kino-genre-dialog',
    imports: [CommonModule, MatDialogModule],
    templateUrl: './genre-dialog.html',
    styleUrl: './genre-dialog.scss'
})
/**
 * Dialog component to display genre information.
 */
export class GenreDialogComponent {
    constructor(@Inject(MAT_DIALOG_DATA) public data: { name?: string; description?: string }) {}
}
