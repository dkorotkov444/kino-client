import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { UserRegistrationFormComponent } from './user-registration-form/user-registration-form';

@Component({
  selector: 'app-root',
  imports: [
    CommonModule,
    RouterOutlet,
    MatDialogModule,
    MatButtonModule,
    UserRegistrationFormComponent,
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class AppComponent {
  protected readonly title = signal('kino-client');

  readonly dialog: MatDialog = inject(MatDialog);

  /**
   * Opens the user registration form inside an Angular Material Dialog.
   */
  openUserRegistrationDialog(): void {
    this.dialog.open(UserRegistrationFormComponent, {
      width: '280px',
    });
  }

  /**
   * Placeholder function for the login dialog.
   */
  openUserLoginDialog(): void {
    console.log('Login dialog will open soon...');
  }
}
