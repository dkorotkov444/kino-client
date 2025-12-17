/**
 * @file src/app/app.config.ts
 * @fileoverview Provides global application configuration for the Kino app, including router, HTTP client, hydration, and error handling providers.
 * @author Dmitri Korotkov
 * @copyright Dmitri Korotkov 2025
 */

// Angular core & platform
import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';

// App interceptors & routes
import { authInterceptor } from './services/auth.interceptor';

import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';

export const appConfig: ApplicationConfig = {
    providers: [
        provideBrowserGlobalErrorListeners(),
        provideRouter(routes),                      // Register the router service globally
        provideHttpClient(withFetch(), withInterceptors([authInterceptor])),
        provideClientHydration(withEventReplay()),
    ]
};
