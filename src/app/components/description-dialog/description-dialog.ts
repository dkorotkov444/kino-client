import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'kino-description-dialog',
  imports: [CommonModule, MatDialogModule],
  templateUrl: './description-dialog.html',
  styleUrl: './description-dialog.scss'
})
export class DescriptionDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: { title?: string; description?: string }) {}
}
