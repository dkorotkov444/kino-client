/**
 * @file src/app/components/user-profile/user-profile.ts
 * @fileoverview User profile component for Kino app
 * @author Dmitri Korotkov
 * @copyright Dmitri Korotkov 2025
 */
// Angular core & common
import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';

// Forms
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';

// Angular Material
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';

// App services & components
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user';

@Component({
    standalone: true,
    selector: 'kino-user-profile',
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatCardModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatDatepickerModule,
        MatNativeDateModule,
    ],
    templateUrl: './user-profile.html',
    styleUrl: './user-profile.scss',
})
/**
 * User profile component.
 */
export class UserProfileComponent implements OnInit {
    
    private fb = inject(FormBuilder);
    private auth = inject(AuthService);
    private userService = inject(UserService);
    private snack = inject(MatSnackBar);
    private cdr: ChangeDetectorRef = inject(ChangeDetectorRef);

    // Local state for the user
    user: User | null = this.auth.getUser();

    // Reactive form for profile editing
    form = this.fb.group({
        username: [this.user?.username || '', [Validators.required, Validators.minLength(3)]],
        password: ['', [Validators.minLength(8)]],
        email: [this.user?.email || '', [Validators.required, Validators.email]],
        birth_date: [this.user?.birth_date ? new Date(this.user.birth_date) : null],
    });
    // Loading state
    saving : boolean= false;

    /**
     * Angular lifecycle hook. No-op for now.
     */
    ngOnInit() {}

    /**
     * Save profile changes. Updates user info and handles re-login if username or password changes.
     */
    save(): void {
        if (this.form.invalid || !this.user) {
            return;
        }

        const currentUsername = this.user.username;
        const value = this.form.value;
        const updates: any = {};

        if (value.username && value.username !== currentUsername) updates.newUsername = value.username;
        if (value.password) updates.newPassword = value.password;
        if (value.email && value.email !== this.user.email) updates.newEmail = value.email;
        if (value.birth_date) updates.newBirthDate = this.toIsoDate(value.birth_date as Date);

        if (Object.keys(updates).length === 0) {
            this.snack.open('No changes to update.', 'Close', { duration: 3000 });
            return;
        }

        this.saving = true;
        this.cdr.detectChanges();

        this.userService.updateUser(currentUsername, updates).subscribe({
            next: (updatedUser) => {
                
                if (updates.newUsername || updates.newPassword) {           // If username or password changed, force re-login
                    this.auth.logout();
                    this.snack.open('Username/password changed. You are logged out for security.', 'Close', { duration: 4000 });
                } else {                                                    // Otherwise, just update the user info in AuthService and locally
                    this.auth.setUser(updatedUser); 
                    this.user = updatedUser; 
                    this.snack.open('Profile updated successfully.', 'Close', { duration: 3000 });
                }
            },
            error: (err) => {
                this.snack.open('Failed to update profile.', 'Close', { duration: 4000 });
                this.saving = false;
                this.cdr.detectChanges();
            },
            complete: () => {
                this.saving = false;
                this.cdr.detectChanges();
            }
        });
    }

    /**
     * Delete the user account after confirmation. Logs out and notifies the user.
     */
    deleteAccount(): void {
        if (!this.user) {
            return;
        }
        // Security check: confirm deletion with a dangerous-themed warning
        const confirmationMessage = 
        '⚠️ WARNING: This action cannot be undone. \n\n' +
        'Are you sure you want to permanently delete your account and all associated data?';

        const confirmed = window.confirm(confirmationMessage );

        if (!confirmed) {
            return;
        }
        
        const username = this.user.username;
        this.userService.deleteUser(username).subscribe({
            next: () => {
                this.auth.logout();
                this.snack.open('Account deleted. Goodbye!', 'Close', { duration: 4000, panelClass: ['snack-danger'] });
            },
            error: (err) => {
                this.snack.open('Failed to delete account.', 'Close', { duration: 4000, panelClass: ['snack-danger'] });
            },
        });
    }

    private toIsoDate(d: Date): string {
        const yyyy = d.getFullYear();
        const mm = String(d.getMonth() + 1).padStart(2, '0');
        const dd = String(d.getDate()).padStart(2, '0');
        return `${yyyy}-${mm}-${dd}`;
    }
}
