// src/app/app.ts

import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
    selector: 'app-root',
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

    get showNavBar(): boolean {
        return !this.router.url.includes('welcome');
    }
}

