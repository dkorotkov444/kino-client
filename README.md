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

All services are provided in the root injector and can be injected into any component or service.

### ApiBaseService

Base service providing common functionality for all API services. Extend this service to inherit authentication and error handling capabilities.

**Key Features:**
- JWT token management from localStorage
- Authorization header creation with Bearer token
- Centralized HTTP error handling with proper error propagation

**Methods:**
- `getAuthHeaders()` - Returns HttpHeaders with Authorization Bearer token
- `handleError(error)` - Centralized error handler for HTTP requests

### AuthService

Handles user authentication and session management. Automatically manages JWT tokens and user data in localStorage.

**Methods:**
- `login(credentials)` - POST `/login` - Authenticates user with username/password
  - Returns: `{ user: object, token: string }`
  - Auto-stores token and user data
- `setToken(token)` - Stores JWT token in localStorage
- `setUser(user)` - Stores user profile in localStorage
- `getToken()` - Retrieves token from localStorage
- `getUser()` - Retrieves and parses user data from localStorage
- `isAuthenticated()` - Checks if user has valid token
- `logout()` - Clears token and user data from localStorage

### MovieService

Manages movie data retrieval from the API. Provides methods to get movies, genres, directors, and actors.

**Methods:**
- `getMovieList()` - GET `/movies/list` - Returns array of movie title strings
- `getAllMovies()` - GET `/movies` - Returns array of complete movie objects with full details
- `getMovieByTitle(title)` - GET `/movies/:title` - Returns single movie object by title
- `getGenre(genreName)` - GET `/movies/genres/:genreName` - Returns genre object with name and description
- `getDirector(directorName)` - GET `/movies/directors/:directorName` - Returns director object with bio and birth date
- `getMovieActors(title)` - GET `/movies/:title/starring` - Returns array of actor names for a movie
- `getActor(actorName)` - GET `/movies/actors/:actorName` - Returns actor information

### UserService

Manages user profiles, registration, and user favorites. Handles user lifecycle operations including account updates and deletion.

**Methods:**
- `getAllUsers()` - GET `/users` - Returns array of all user objects (admin use)
- `userRegistration(userDetails)` - POST `/users` - Creates new user account
  - Expects: `{ username, password, email, birth_date? }`
  - Returns: newly created user object
- `updateUser(username, updates)` - PATCH `/users/:username` - Updates user information
  - Updates: `{ newUsername?, newPassword?, newEmail?, newBirthDate? }`
  - Returns: updated user object
- `deleteUser(username)` - DELETE `/users/:username` - Deletes user account
- `addFavoriteMovie(username, movieTitle)` - PATCH `/users/:username/:movieTitle` - Adds movie to favorites
  - Returns: updated user object with favorites array
- `removeFavoriteMovie(username, movieTitle)` - DELETE `/users/:username/:movieTitle` - Removes movie from favorites
  - Returns: updated user object with favorites array

## Quick Start

Get up and running in minutes:

```bash
# Clone the repository
git clone https://github.com/dkorotkov444/kino-client.git
cd kino-client

# Install dependencies
npm install

# Start development server
npm start

# Open http://localhost:4200 in your browser
```

## Development Setup

### Prerequisites
- Node.js 20+
- npm 10.9.3
- Git
- A code editor (VS Code recommended)

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

## Architecture & Dependency Injection

The application uses Angular's dependency injection system with root-level providers. All services are provided as singletons in the root injector using `providedIn: 'root'`:

```typescript
@Injectable({
  providedIn: 'root'
})
export class AuthService extends ApiBaseService { ... }
```

**Benefits:**
- Services are automatically tree-shakeable (only bundled if used)
- Single instance shared across the entire application
- Can be injected into any component or service
- No need for manual module imports

**Service Hierarchy:**
```
ApiBaseService (base class)
├── AuthService (authentication)
├── MovieService (movie data)
└── UserService (user management)
```

## Error Handling

All HTTP requests use centralized error handling through `ApiBaseService.handleError()`:

**Error Handling Flow:**
1. HTTP request fails in any service
2. Error caught in `.pipe(catchError(this.handleError))`
3. Error logged to console with status code and details
4. Throws error message: `'Something bad happened; please try again later.'`
5. Component/caller handles the Observable error

**Usage Example:**
```typescript
this.authService.login(credentials).subscribe({
  next: (response) => { /* handle success */ },
  error: (error) => { /* handle error */ }
});
```

## Development Workflow

### Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

**Common generation commands:**
```bash
# Generate component
ng generate component features/movie-list

# Generate service
ng generate service services/comment

# Generate module
ng generate module modules/shared

# Generate pipe
ng generate pipe pipes/uppercase-first
```

For a complete list of available schematics, run:

```bash
ng generate --help
```

### Creating a New Component

Best practices when adding a new component:

1. **Create the component** in a feature folder
2. **Import required Angular modules** (RouterOutlet, NgIf, etc.)
3. **Inject services** in the component constructor
4. **Use reactive patterns** with RxJS Observables
5. **Add unit tests** in `.spec.ts` file

**Example:**
```typescript
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MovieService } from '../services/movie.service';

@Component({
  selector: 'app-movie-list',
  imports: [CommonModule],
  templateUrl: './movie-list.component.html',
  styleUrl: './movie-list.component.scss'
})
export class MovieListComponent {
  private movieService = inject(MovieService);
  movies$ = this.movieService.getAllMovies();
}
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

### Environment Files

- **Development:** `src/environments/environment.ts`
- **Production:** `src/environments/environment.prod.ts`

### Development Environment

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080/'  // Local API for testing
};
```

### Production Environment

```typescript
export const environment = {
  production: true,
  apiUrl: 'https://reel-movie-api-608b8b4b3a04.herokuapp.com'  // Production API
};
```

**Build with Production Configuration:**
```bash
ng build --configuration production
```

### API Base URLs

- **Development:** `http://localhost:8080`
- **Production:** `https://reel-movie-api-608b8b4b3a04.herokuapp.com`

For detailed API documentation, see `public/Movie_API_Documentation.md`.

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

**Format code:**
```bash
npx prettier --write "src/**/*.{ts,html,scss}"
```

## Troubleshooting

### Common Issues

**Issue: "Cannot find module '@angular/...'"**
- Run `npm install` to ensure all dependencies are installed
- Delete `node_modules` and `package-lock.json`, then run `npm install` again

**Issue: CORS errors when calling API**
- Ensure the API is running on the configured URL
- Check `src/environments/environment.ts` for correct `apiUrl`
- Verify CORS is enabled on the backend API

**Issue: 401 Unauthorized errors**
- User may not be logged in (token missing)
- Token may have expired (3-hour expiration)
- Run `AuthService.logout()` and login again
- Check browser localStorage: `localStorage.getItem('token')`

**Issue: "ng: The term 'ng' is not recognized"**
- Angular CLI not installed globally or locally
- Run `npm install --global @angular/cli`
- Or use `npx ng <command>` to run locally installed CLI

**Issue: Port 4200 already in use**
- Start server on different port: `ng serve --port 4300`
- Or kill process using port 4200

### Testing Tips

```bash
# Run tests in watch mode
npm test

# Run tests with coverage
ng test --code-coverage

# Run specific test file
ng test --include='**/movie.service.spec.ts'
```

## Contributing Guidelines

When contributing to the project:

1. **Create a feature branch** from `main`
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Follow the existing code style** (Prettier will auto-format)

3. **Add tests** for new features
   ```bash
   ng generate service services/new-service --skip-tests=false
   ```

4. **Keep commits atomic** - one feature per commit

5. **Write meaningful commit messages**
   ```
   feat: add user profile component
   fix: resolve token expiration issue
   docs: update API documentation
   ```

6. **Test before pushing**
   ```bash
   npm test
   npm run build
   ```

7. **Create a pull request** with clear description

## Additional Resources

- [Angular Documentation](https://angular.dev)
- [Angular CLI Reference](https://angular.dev/tools/cli)
- [RxJS Documentation](https://rxjs.dev)
- [Vitest Documentation](https://vitest.dev)
- [REEL Movie API Documentation](public/Movie_API_Documentation.md)
