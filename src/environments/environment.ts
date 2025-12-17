/**
 * @file src/environments/environment.ts
 * @fileoverview Development environment configuration for Kino app.
 * This file is used for local builds and debugging. It can be replaced during build by using the `fileReplacements` array in angular.json.
 * `ng build` replaces `environment.ts` with `environment.prod.ts` for production builds.
 * @author Dmitri Korotkov
 * @copyright Dmitri Korotkov 2025
 */

export const environment = {
    production: false,
    apiUrl: 'http://localhost:8080/'  // Your local development API URL
};

