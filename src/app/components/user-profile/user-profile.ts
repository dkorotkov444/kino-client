// Angular core & common
import { Component, inject } from '@angular/core';
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
import { MatDialog } from '@angular/material/dialog';

// App services & components
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { MovieCardComponent } from '../movie-card/movie-card';

@Component({
    standalone: true,
    selector: 'kino-user-profile',
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MovieCardComponent,
    ],
    templateUrl: './user-profile.html',
    styleUrl: './user-profile.scss',
})
export class UserProfileComponent {
    constructor() {
        // Debug: Log when the component is initialized
        console.debug('[UserProfileComponent] Initialized');
    }
    
    private fb = inject(FormBuilder);
    private auth = inject(AuthService);
    private userService = inject(UserService);
    private snack = inject(MatSnackBar);
    private dialog = inject(MatDialog);

    user = this.auth.getUser();

    ngOnInit() {
        // Debug: Log when ngOnInit is called
        console.debug('[UserProfileComponent] ngOnInit called');
        console.debug('[UserProfileComponent] Current user:', this.user);
    }

    form = this.fb.group({
        username: [this.user?.username || '', [Validators.required]],
        password: [''],
        email: [this.user?.email || '', [Validators.required, Validators.email]],
        birth_date: [this.user?.birth_date ? new Date(this.user.birth_date) : null],
    });

    saving = false;

    save(): void {
        console.debug('[UserProfileComponent] save() called');
        if (!this.user) {
            console.debug('[UserProfileComponent] No user found, aborting save.');
            return;
        }
        const currentUsername = this.user.username;
        const value = this.form.value;
        const updates: any = {};
        if (value.username && value.username !== currentUsername) updates.newUsername = value.username;
        if (value.password) updates.newPassword = value.password;
        if (value.email && value.email !== this.user.email) updates.newEmail = value.email;
        if (value.birth_date) updates.newBirthDate = this.toIsoDate(value.birth_date as Date);

        console.debug('[UserProfileComponent] Form value:', value);
        console.debug('[UserProfileComponent] Updates to send:', updates);

        if (Object.keys(updates).length === 0) {
            console.debug('[UserProfileComponent] No changes to update.');
            this.snack.open('No changes to update.', 'Close', { duration: 3000 });
            return;
        }

        this.saving = true;
        this.userService.updateUser(currentUsername, updates).subscribe({
            next: (updated) => {
                console.debug('[UserProfileComponent] Update successful:', updated);
                // If username or password changed, force re-login
                if (updates.newUsername || updates.newPassword) {
                    console.debug('[UserProfileComponent] Username or password changed, logging out.');
                    this.auth.logout();
                    this.snack.open('Username/password changed. You are logged out for security.', 'Close', { duration: 4000 });
                } else {
                    this.auth.setUser(updated);
                    this.user = updated;
                    this.snack.open('Profile updated successfully.', 'Close', { duration: 3000 });
                }
            },
            error: (err) => {
                console.debug('[UserProfileComponent] Update failed:', err);
                this.snack.open('Failed to update profile.', 'Close', { duration: 4000 });
            },
            complete: () => {
                console.debug('[UserProfileComponent] Update request complete.');
                this.saving = false;
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
        const confirmed = window.confirm(
            'Dangerous action!\n\nAre you sure you want to delete your account? This action cannot be undone.'
        );
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

    toggleFavorite(movieTitle: string): void {
        if (!this.user) return;
        const username = this.user.username;
        const favorites: string[] = this.user.favorites || [];
        const isFav = favorites.includes(movieTitle);
        const req$ = isFav
        ? this.userService.removeFavoriteMovie(username, movieTitle)
        : this.userService.addFavoriteMovie(username, movieTitle);
        req$.subscribe({
        next: (updated) => { this.auth.setUser(updated); this.user = updated; },
        error: () => this.snack.open('Failed to update favorites.', 'Close', { duration: 3000 }),
        });
    }

    private toIsoDate(d: Date): string {
        const yyyy = d.getFullYear();
        const mm = String(d.getMonth() + 1).padStart(2, '0');
        const dd = String(d.getDate()).padStart(2, '0');
        return `${yyyy}-${mm}-${dd}`;
    }
}
