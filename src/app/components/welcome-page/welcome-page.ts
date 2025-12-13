import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
//import { RouterOutlet } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { UserRegistrationFormComponent } from '../user-registration-form/user-registration-form';
import { UserLoginFormComponent } from '../user-login-form/user-login-form';

@Component({
  selector: 'kino-welcome-page',
  imports: [
    CommonModule,
    //RouterOutlet,
    MatDialogModule,
    MatButtonModule,
  ],
  templateUrl: './welcome-page.html',
  styleUrl: './welcome-page.scss',
})
export class WelcomePageComponent {
    protected readonly title = signal('KINO App');

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
     * Opens the user login form inside an Angular Material Dialog.
     */
    openUserLoginDialog(): void {
        this.dialog.open(UserLoginFormComponent, {
            width: '280px',
        });
    }
}
