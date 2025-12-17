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
import { MovieService } from '../../services/movie.service';
import { Movie } from '../../models/movie';
import { User } from '../../models/user';

// RxJS imports
import { Observable, combineLatest, of, BehaviorSubject } from 'rxjs'; 
import { map, shareReplay } from 'rxjs/operators';

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

    ngOnInit() {
        // Debug: Log when ngOnInit is called
        console.debug('[UserProfileComponent] Current user:', this.user);
    }

    save(): void {
        console.debug('[UserProfileComponent] save() called');
        if (this.form.invalid || !this.user) {
            console.debug('[UserProfileComponent] No user found, aborting save.');
            return;
        }

        const currentUsername = this.user.username;
        const value = this.form.value;
        const updates: any = {};

        console.debug('[UserProfileComponent] Form value:', value);

        if (value.username && value.username !== currentUsername) updates.newUsername = value.username;
        if (value.password) updates.newPassword = value.password;
        if (value.email && value.email !== this.user.email) updates.newEmail = value.email;
        if (value.birth_date) updates.newBirthDate = this.toIsoDate(value.birth_date as Date);

        console.debug('[UserProfileComponent] Updates to send:', updates);

        if (Object.keys(updates).length === 0) {
            console.debug('[UserProfileComponent] No changes to update.');
            this.snack.open('No changes to update.', 'Close', { duration: 3000 });
            return;
        }

        this.saving = true;
        this.cdr.detectChanges();

        this.userService.updateUser(currentUsername, updates).subscribe({
            next: (updatedUser) => {
                console.debug('[UserProfileComponent] Update successful:', updatedUser);
                
                if (updates.newUsername || updates.newPassword) {           // If username or password changed, force re-login
                    console.debug('[UserProfileComponent] Username or password changed, logging out.');
                    this.auth.logout();
                    this.snack.open('Username/password changed. You are logged out for security.', 'Close', { duration: 4000 });
                } else {                                                    // Otherwise, just update the user info in AuthService and locally
                    this.auth.setUser(updatedUser); 
                    this.user = updatedUser; 
                    this.snack.open('Profile updated successfully.', 'Close', { duration: 3000 });
                }
            },
            error: (err) => {
                console.debug('[UserProfileComponent] Update failed:', err);
                this.snack.open('Failed to update profile.', 'Close', { duration: 4000 });
                this.saving = false;
                this.cdr.detectChanges();
            },
            complete: () => {
                console.debug('[UserProfileComponent] Update request complete.');
                this.saving = false;
                this.cdr.detectChanges();
            }
        });
    }

    deleteAccount(): void {
        console.debug('[UserProfileComponent] deleteAccount() called');
        if (!this.user) {
            console.debug('[UserProfileComponent] No user found, aborting delete.');
            return;
        }
        // Security check: confirm deletion with a dangerous-themed warning
        const confirmationMessage = 
        '⚠️ WARNING: This action cannot be undone. \n\n' +
        'Are you sure you want to permanently delete your account and all associated data?';

        const confirmed = window.confirm(confirmationMessage );

        console.debug('[UserProfileComponent] User confirmed deletion:', confirmed);
        if (!confirmed) {
            console.debug('[UserProfileComponent] User cancelled account deletion.');
            return;
        }
        
        const username = this.user.username;
        console.debug('[UserProfileComponent] Sending delete request for user:', username);
        this.userService.deleteUser(username).subscribe({
            next: () => {
                console.debug('[UserProfileComponent] Account deleted successfully. Logging out.');
                this.auth.logout();
                this.snack.open('Account deleted. Goodbye!', 'Close', { duration: 4000, panelClass: ['snack-danger'] });
            },
            error: (err) => {
                console.debug('[UserProfileComponent] Account deletion failed:', err);
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
