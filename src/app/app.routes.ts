/**
 * @file src/app/app.routes.ts
 * @fileoverview Defines the main navigation routes for the Kino app, mapping URL paths to standalone components.
 * @author Dmitri Korotkov
 * @copyright Dmitri Korotkov 2025
 */

import { Routes } from '@angular/router';

// Import Standalone Components directly
import { WelcomePageComponent } from './components/welcome-page/welcome-page'; 
import { MovieCardComponent } from './components/movie-card/movie-card';
import { UserProfileComponent } from './components/user-profile/user-profile';

// Define the route array for the application
export const routes: Routes = [
    { path: 'welcome', component: WelcomePageComponent },
    { path: 'movies', component: MovieCardComponent },
    { path: 'users', component: UserProfileComponent },
    { path: '', redirectTo: 'welcome', pathMatch: 'full' },         // Handle redirects (pathMatch is often 'full' for empty routes)
];