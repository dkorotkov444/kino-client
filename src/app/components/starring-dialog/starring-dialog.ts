/**
 * @file src/app/components/starring-dialog/starring-dialog.ts
 * @fileoverview Dialog component to display starring actors in Kino app
 * @author Dmitri Korotkov
 * @copyright Dmitri Korotkov 2025
 */
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatListModule } from '@angular/material/list';
import { CommonModule } from '@angular/common';

@Component({
    standalone: true,
    selector: 'kino-starring-dialog',
    imports: [CommonModule, MatDialogModule, MatListModule],
    templateUrl: './starring-dialog.html',
    styleUrl: './starring-dialog.scss'
})
/**
 * Dialog component to display starring actors.
 */
export class StarringDialogComponent {
    constructor(@Inject(MAT_DIALOG_DATA) public data: { starring?: string[] }) {}
}
