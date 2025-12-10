# KinoAngularClient

A modern Angular 21 client application for browsing and managing movies using the REEL Movie API. Built with Angular's latest standalone components, RxJS for reactive programming, and Vitest for unit testing.

## Overview

KinoAngularClient is a movie browsing and management application that connects to the REEL Movie API. The application features user authentication, movie browsing, and a service-oriented architecture with comprehensive error handling.

**Version:** 0.0.0 | **Angular:** 21.0.0 | **Node:** 20+ | **npm:** 10.9.3

## Features

- **User Authentication:** JWT-based login with automatic token management
- **Movie Browsing:** View all movies or search by title
- **User Management:** User profile management with favorites tracking
- **Service Architecture:** Modular services for authentication, movies, users, and API communication
- **Error Handling:** Centralized HTTP error handling with proper error propagation
- **Type Safety:** TypeScript with strict configuration
- **Standalone Components:** Modern Angular standalone components architecture
- **Server-Side Rendering:** Built-in Angular SSR support with Express integration

## Project Structure

```
src/
├── app/
│   ├── services/              # Core application services
│   │   ├── auth.service.ts    # Authentication and login
│   │   ├── movie.service.ts   # Movie data management
│   │   ├── user.service.ts    # User profile management
│   │   └── api-base.service.ts # Base API service with common functionality
│   ├── app.ts                 # Root component
│   ├── app.routes.ts          # Route definitions
│   ├── app.html               # Root template
│   └── app.scss               # Root styles
├── environments/              # Environment-specific configuration
│   ├── environment.ts         # Development environment
│   └── environment.prod.ts    # Production environment
└── index.html                 # Main HTML entry point
```

## Services

### ApiBaseService
Base service providing common functionality for all API services:
- JWT token management from localStorage
- Authorization header creation
- Centralized HTTP error handling

### AuthService
Handles user authentication:
- `login(credentials)` - POST to `/login` endpoint
- Token and user data persistence to localStorage
- Automatic token attachment to requests

### MovieService
Manages movie data operations:
- `getMovieList()` - GET `/movies/list` - Movie titles only
- `getAllMovies()` - GET `/movies` - Full movie details
- `getMovieByTitle(title)` - GET `/movies/:title` - Single movie by title

### UserService
Manages user profile operations (extends ApiBaseService)

## Development Setup

### Prerequisites
- Node.js 20+
- npm 10.9.3

### Installation

```bash
npm install
```

## Development server

To start a local development server, run:

```bash
npm start
```

or

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
npm run build
```

or

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

### Server-Side Rendering (SSR)

To run the SSR build:

```bash
npm run serve:ssr:kino-client
```

## Running unit tests

To execute unit tests with the [Vitest](https://vitest.dev/) test runner, use the following command:

```bash
npm test
```

or

```bash
ng test
```

Tests are configured for all service files and component specs.

## API Configuration

The application connects to the REEL Movie API. Configure the API URL in the environment files:

- **Development:** `src/environments/environment.ts`
- **Production:** `src/environments/environment.prod.ts`

Set the `apiUrl` variable to match your API base URL:

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080/' // Development API
};
```

For API documentation, see `public/Movie_API_Documentation.md`.

## Authentication Flow

1. User submits login credentials via `AuthService.login()`
2. Server returns JWT token and user profile
3. Token is automatically stored in localStorage
4. Subsequent API requests automatically include Authorization header with token
5. Token expires in 3 hours

## Dependencies

### Core
- `@angular/core` - Angular framework
- `@angular/forms` - Form handling
- `@angular/router` - Client-side routing
- `@angular/platform-browser` - Browser platform
- `@angular/platform-server` - Server platform for SSR
- `@angular/ssr` - Server-side rendering
- `@angular/common` - Common utilities

### API & Data
- `rxjs` - Reactive programming library

### Server
- `express` - Web server framework for SSR

### Development
- `@angular/cli` - Angular CLI tooling
- `@angular/build` - Build system
- `typescript` - TypeScript compiler
- `vitest` - Unit testing framework
- `jsdom` - DOM implementation for testing

## Scripts

```json
{
  "start": "ng serve",
  "build": "ng build",
  "watch": "ng build --watch --configuration development",
  "test": "ng test",
  "serve:ssr:kino-client": "node dist/kino-client/server/server.mjs"
}
```

## Code Style

The project uses Prettier for code formatting with the following configuration:
- Print width: 100 characters
- Single quotes for JavaScript/TypeScript
- Angular parser for HTML files

## Additional Resources

- [Angular Documentation](https://angular.dev)
- [Angular CLI Reference](https://angular.dev/tools/cli)
- [RxJS Documentation](https://rxjs.dev)
- [Vitest Documentation](https://vitest.dev)
- [REEL Movie API Documentation](public/Movie_API_Documentation.md)
