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
export class StarringDialogComponent {
    constructor(@Inject(MAT_DIALOG_DATA) public data: { starring?: string[] }) {}
}
