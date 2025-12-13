// src/main.ts

import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';               // Import the application configuration
import { AppComponent } from './app/app';                   // Import the root component

bootstrapApplication(AppComponent, appConfig)
    .catch((err) => console.error(err));
