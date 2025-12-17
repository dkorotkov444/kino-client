/**
 * @file src/app/components/user-login-form/user-login-form.ts
 * @fileoverview User login dialog component for Kino app
 * @author Dmitri Korotkov
 * @copyright Dmitri Korotkov 2025
 */
// Angular core & common
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

// Router & forms
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';

// Angular Material
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

// App services
import { AuthService } from '../../services/auth.service';

@Component({
    standalone: true,
    selector: 'kino-user-login-form',
    imports: [
        CommonModule,
        ReactiveFormsModule, 
        MatDialogModule, 
        MatSnackBarModule,
        MatFormFieldModule,
        MatCardModule,
        MatInputModule,
        MatButtonModule,
    ],
    templateUrl: './user-login-form.html',
    styleUrl: './user-login-form.scss',
})
/**
 * User login dialog component.
 */
export class UserLoginFormComponent {
    // Modern dependency injection (v21)
    readonly dialogRef: MatDialogRef<UserLoginFormComponent> = inject(MatDialogRef);
    readonly snackBar: MatSnackBar = inject(MatSnackBar);
    readonly authService: AuthService = inject(AuthService);
    readonly router: Router = inject(Router);

    // Define the reactive form model with basic validation
    loginForm = new FormGroup({
      username: new FormControl('', { nonNullable: true, validators: Validators.required }),
      password: new FormControl('', { nonNullable: true, validators: Validators.required }),
    });

    // Function responsible for sending the form inputs to the backend
    loginUser(): void {
        if (this.loginForm.valid) {
            
            const formData = this.loginForm.value as { username: string; password: string };

            const apiPayload = {
                username: formData.username,
                password: formData.password,
            };

            this.authService.login(apiPayload).subscribe({
                next: (result) => {
                    this.dialogRef.close(); 
                    this.snackBar.open('Login successful!', 'OK', {
                        duration: 2000
                    });
                    this.router.navigate(['movies']); // Navigate to the movies home page after successful login
                },
                error: (error) => {
                    console.error('Login API Error:', error);
                    this.snackBar.open('Login failed. Please check your credentials and try again.', 'OK', {
                        duration: 2000
                    });
                }
            });
        } else {
            console.error('Form is invalid. Cannot submit registration.');
        }
    } 
}
