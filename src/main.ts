// src/main.ts

// Angular platform
import { bootstrapApplication } from '@angular/platform-browser';

// App root & config
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app';

bootstrapApplication(AppComponent, appConfig)
    .catch((err) => console.error(err));
