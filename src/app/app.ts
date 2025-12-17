/**
 * @file src/app/app.ts
 * @fileoverview Root application component for Kino app
 * @author Dmitri Korotkov
 * @copyright Dmitri Korotkov 2025
 */

// Angular core & common
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterOutlet } from '@angular/router';

// Angular Material
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSnackBarModule } from '@angular/material/snack-bar';

// App services
import { AuthService } from './services/auth.service';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [
        CommonModule,
        RouterLink,
        RouterOutlet,
        MatButtonModule,
        MatToolbarModule,
        MatSnackBarModule,
    ],
    templateUrl: './app.html',
    styleUrl: './app.scss'
})
export class AppComponent {
    readonly router: Router = inject(Router);
    readonly authService: AuthService = inject(AuthService);

    get showNavBar(): boolean {
        return !this.router.url.includes('welcome');
    }
}

