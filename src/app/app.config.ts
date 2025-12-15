// src/app/app.config.ts

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
