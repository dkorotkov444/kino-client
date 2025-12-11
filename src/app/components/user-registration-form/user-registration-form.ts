// src/app/user-registration-form/user-registration-form.ts

import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { UserService } from '../../services/user.service';

@Component({
    standalone: true,
    selector: 'kino-user-registration-form',
    templateUrl: './user-registration-form.html',
    styleUrl: './user-registration-form.scss',
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

})
export class UserRegistrationFormComponent {
    // Modern dependency injection (v21)
    readonly dialogRef: MatDialogRef<UserRegistrationFormComponent> = inject(MatDialogRef);
    readonly snackBar: MatSnackBar = inject(MatSnackBar);
    readonly userService: UserService = inject(UserService);
  
    // Define the reactive form model with basic validation
    registrationForm = new FormGroup({
      username: new FormControl('', { nonNullable: true, validators: Validators.required }),
      password: new FormControl('', { nonNullable: true, validators: Validators.required }),
      email: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.email] }),
      birthdate: new FormControl('', { nonNullable: true }), 
    });

    // Function responsible for sending the form inputs to the backend
    registerUser(): void {
        if (this.registrationForm.valid) {
            
            const formData = this.registrationForm.value as { username: string; password: string; email: string; birthdate: string };

            const apiPayload = {
                username: formData.username,
                password: formData.password,
                email: formData.email,
                birth_date: formData.birthdate 
            };

            this.userService.userRegistration(apiPayload).subscribe({
                next: (result) => {
                    console.log('Registration response:', result);
                    this.dialogRef.close(); 
                    this.snackBar.open('Registration successful! You can now log in.', 'OK', {
                        duration: 2000
                    });
                },
                error: (error) => {
                    console.error('Registration API Error:', error);
                    this.snackBar.open('Registration failed. Please check your details and try again.', 'OK', {
                        duration: 2000
                    });
                }
            });
        } else {
            console.error('Form is invalid. Cannot submit registration.');
        }
    } 
}
