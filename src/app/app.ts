// src/app/app.ts

import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { AuthService } from './services/auth.service';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [
        CommonModule,
        RouterOutlet,
        MatButtonModule,
        MatToolbarModule,
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

    onLogout(): void {
        this.authService.logout();
        this.router.navigate(['welcome']);
    }
}

