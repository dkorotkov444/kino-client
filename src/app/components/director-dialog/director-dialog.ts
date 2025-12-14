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
export class DirectorDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: { name?: string; bio?: string; birth_date?: string; death_date?: string }) {}
}
