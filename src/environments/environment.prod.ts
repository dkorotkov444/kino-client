/**
 * @file src/environments/environment.prod.ts
 * @fileoverview Production environment configuration for Kino app.
 * This file is used for production builds and deployment. It replaces environment.ts during the build process.
 * @author Dmitri Korotkov
 * @copyright Dmitri Korotkov 2025
 */
export const environment = {
    production: true,
    apiUrl: 'https://reel-movie-api-608b8b4b3a04.herokuapp.com/'  // Your production API URL
};
