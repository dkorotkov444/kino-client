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
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private userService = inject(UserService);
  private snack = inject(MatSnackBar);

  user = this.auth.getUser();

  form = this.fb.group({
    username: [this.user?.username || '', [Validators.required]],
    password: [''],
    email: [this.user?.email || '', [Validators.required, Validators.email]],
    birth_date: [this.user?.birth_date ? new Date(this.user.birth_date) : null],
  });

  saving = false;

  save(): void {
    if (!this.user) return;
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
    this.userService.updateUser(currentUsername, updates).subscribe({
      next: (updated) => {
        // If username or password changed, force re-login
        if (updates.newUsername || updates.newPassword) {
          this.auth.logout();
          this.snack.open('Profile updated. Please log in again.', 'Close', { duration: 4000 });
        } else {
          this.auth.setUser(updated);
          this.user = updated;
          this.snack.open('Profile updated successfully.', 'Close', { duration: 3000 });
        }
      },
      error: () => {
        this.snack.open('Failed to update profile.', 'Close', { duration: 4000 });
      },
      complete: () => { this.saving = false; }
    });
  }

  deleteAccount(): void {
    if (!this.user) return;
    const username = this.user.username;
    this.userService.deleteUser(username).subscribe({
      next: () => {
        this.auth.logout();
        this.snack.open('Account deleted. Goodbye!', 'Close', { duration: 4000 });
      },
      error: () => this.snack.open('Failed to delete account.', 'Close', { duration: 4000 }),
    });
  }

  // placeholder favorite toggle using title per API signature
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
