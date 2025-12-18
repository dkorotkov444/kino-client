/**
 * @module
 * @category Components
 * @fileoverview Dialog component to display director information in Kino app
 * @author Dmitri Korotkov
 * @copyright Dmitri Korotkov 2025
 */
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';

@Component({
    standalone: true,
    selector: 'kino-director-dialog',
    imports: [CommonModule, MatDialogModule],
    templateUrl: './director-dialog.html',
    styleUrl: './director-dialog.scss'
})
/**
 * Dialog component to display director information.
 */
export class DirectorDialogComponent {
    constructor(@Inject(MAT_DIALOG_DATA) public data: { name?: string; bio?: string; birth_date?: string; death_date?: string }) {}
}
