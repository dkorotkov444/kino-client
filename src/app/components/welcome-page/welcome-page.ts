/**
 * @module
 * @category Components
 * @fileoverview Welcome page component for the Kino app. Handles user entry, registration, and login dialogs.
 * @author Dmitri Korotkov
 * @copyright Dmitri Korotkov 2025
 */
// Angular core & common
import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

// Angular Material
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

// Local components
import { UserRegistrationFormComponent } from '../user-registration-form/user-registration-form';
import { UserLoginFormComponent } from '../user-login-form/user-login-form';

@Component({
  selector: 'kino-welcome-page',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
  ],
  templateUrl: './welcome-page.html',
  styleUrl: './welcome-page.scss',
})
/**
 * Welcome page component for the Kino app.
 * Displays the app title and provides entry points for user registration and login.
 */
export class WelcomePageComponent {
    protected readonly title = signal('KINO App');
    readonly dialog: MatDialog = inject(MatDialog);

    openUserRegistrationDialog(): void {
        this.dialog.open(UserRegistrationFormComponent, {
        width: '280px',
        });
    }

    openUserLoginDialog(): void {
        this.dialog.open(UserLoginFormComponent, {
            width: '280px',
        });
    }
}
