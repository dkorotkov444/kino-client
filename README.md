# KinoAngularClient

A modern Angular 21 client application for browsing and managing movies using the REEL Movie API. Built with Angular's latest standalone components, RxJS reactive patterns with async pipe, automatic HTTP interceptors, and optimized SSR configuration.

## Overview

KinoAngularClient is a movie browsing and management application that connects to the REEL Movie API. The application features JWT authentication with automatic token injection, reactive movie browsing with search, and a clean service-oriented architecture with user-friendly error handling.

**Version:** 0.0.0 | **Angular:** 21.0.0 | **Node:** 20+ | **npm:** 10.9.3

## Features

- **JWT Authentication:** Automatic token management with HTTP interceptor and localStorage persistence
- **Auth Interceptor:** Centralized token injection for all authenticated API requests
- **User Registration:** Full registration form with validation (username, password, email, birthdate)
- **Material Design UI:** Professional Material Design components throughout the app
- **Movie Browsing:** Responsive grid layout with all movies displayed
- **Movie Search:** Client-side filtering by title, director, genre, and actors (5+ characters)
- **Reactive Patterns:** RxJS streams with async pipe, BehaviorSubjects, and shareReplay for optimal performance
- **Type Safety:** Full TypeScript Movie interface matching backend MongoDB schema
- **Error Notifications:** Material Snackbar with status-specific error messages (400, 401, 403, 404, etc.)
- **Standalone Components:** Modern Angular 21 architecture (no NgModules)
- **Optimized SSR:** Server-side rendering for public routes only (welcome page), client-side for authenticated views
- **SSR Hydration:** Event replay for improved UX during app bootstrap
- **Logout Functionality:** Navbar logout button with automatic state cleanup

## Project Structure

```
src/
├── app/
│   ├── components/                                      # Application components
│   │   ├── movie-card/                                # Movie browsing component
│   │   │   ├── movie-card.ts                         # Reactive movie display with search and filtering
│   │   │   ├── movie-card.html                       # Responsive grid layout with Material cards
│   │   │   ├── movie-card.scss                       # Component styles with hover effects
│   │   │   └── movie-card.spec.ts                    # Component tests
│   │   │
│   │   ├── user-registration-form/                    # User registration component (Material dialog)
│   │   │   ├── user-registration-form.ts              # Registration form component with reactive forms
│   │   │   ├── user-registration-form.html            # Registration form template
│   │   │   ├── user-registration-form.scss            # Component styles
│   │   │   └── user-registration-form.spec.ts         # Component tests
│   │   │
│   │   ├── user-login-form/                           # User login component (Material dialog)
│   │   │   ├── user-login-form.ts                     # Login form component with reactive forms
│   │   │   ├── user-login-form.html                   # Login form template
│   │   │   ├── user-login-form.scss                   # Component styles
│   │   │   └── user-login-form.spec.ts                # Component tests
│   │   │
│   │   └── welcome-page/                              # Landing page component
│   │       ├── welcome-page.ts                        # Welcome component with dialog triggers
│   │       ├── welcome-page.html                      # Welcome page template
│   │       ├── welcome-page.scss                      # Component styles
│   │       └── welcome-page.spec.ts                   # Component tests
│   │
│   ├── services/                                       # Core application services
│   │   ├── api-base.service.ts                        # Base API service with enhanced error handling & snackbar notifications
│   │   ├── api-base.service.spec.ts                   # API base service tests
│   │   ├── auth.service.ts                            # Authentication and JWT token management
│   │   ├── auth.service.spec.ts                       # Auth service tests
│   │   ├── auth.interceptor.ts                        # HTTP interceptor for automatic token injection
│   │   ├── movie.service.ts                           # Movie data retrieval (typed with Movie interface)
│   │   ├── movie.service.spec.ts                      # Movie service tests
│   │   ├── user.service.ts                            # User profile and favorites management
│   │   └── user.service.spec.ts                       # User service tests
│   │
│   ├── models/                                         # TypeScript interfaces
│   │   └── movie.ts                                   # Movie interface matching MongoDB schema
│   │
│   ├── app.ts                                         # Root component with navbar and logout
│   ├── app.html                                       # Root template with navbar and router outlet
│   ├── app.scss                                       # Global component styles & error snackbar styling
│   ├── app.spec.ts                                    # Root component tests
│   ├── app.routes.ts                                  # Application routing (welcome, movies)
│   ├── app.routes.server.ts                           # SSR config: prerender welcome only, client-render movies
│   ├── app.config.ts                                  # App providers with auth interceptor
│   └── app.config.server.ts                           # Server-side configuration
│
├── environments/                                       # Environment-specific configuration
│   ├── environment.ts                                 # Development environment (localhost:8080)
│   └── environment.prod.ts                            # Production environment (Heroku API)
│
├── main.ts                                            # Application bootstrap entry point
├── main.server.ts                                     # Server-side bootstrap for SSR
├── server.ts                                          # Express server configuration for SSR
├── styles.scss                                        # Global application styles
└── index.html                                         # Main HTML entry point
```

### Component Architecture

The application uses **standalone components** (Angular 21):

- **App (Root Component):** Entry point with router outlet for lazy-loaded routes
- **UserRegistrationFormComponent:** Material dialog component for user registration with:
  - Reactive forms with validation
  - Material Dialog integration
  - Snackbar notifications for success/error
  - Service integration with UserService

## Services

All services are provided in the root injector and can be injected into any component or service.

### ApiBaseService

Base service providing common functionality for all API services. Extend this service to inherit error handling capabilities with user-friendly notifications.

**Key Features:**
- Centralized HTTP error handling with Material Snackbar notifications
- Status-specific error messages (400, 401, 403, 404, 409, 422, 500, 503)
- Network error detection and user-friendly messaging
- Backend error message parsing and display
- 5-second snackbar duration with close button

**Methods:**
- `handleError(error)` - Enhanced error handler with snackbar notifications and status-specific messages

**Note:** Authentication headers are now handled automatically by the `authInterceptor`, so manual header management is no longer needed.

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

Manages movie data retrieval from the API. All methods return strongly-typed observables using the `Movie` interface. Authentication headers are automatically added by the `authInterceptor`.

**Methods:**
- `getMovieList()` - GET `/movies/list` - Returns `Observable<any>` of movie title strings
- `getAllMovies()` - GET `/movies` - Returns `Observable<Movie[]>` with complete movie objects
- `getMovieByTitle(title)` - GET `/movies/:title` - Returns `Observable<Movie>` for a single movie
- `getGenre(genreName)` - GET `/movies/genres/:genreName` - Returns genre object with name and description
- `getDirector(directorName)` - GET `/movies/directors/:directorName` - Returns director object with bio and birth date
- `getMovieActors(title)` - GET `/movies/:title/starring` - Returns `Observable<string[]>` of actor names
- `getActor(actorName)` - GET `/movies/actors/:actorName` - Returns actor information

### AuthInterceptor

Functional HTTP interceptor that automatically attaches JWT tokens to authenticated requests.

**Key Features:**
- Automatically adds `Authorization: Bearer <token>` header to requests
- Reads token from localStorage (client-side only, SSR-safe)
- Skips public endpoints (`/login` and `POST /users` registration)
- Platform-aware: only runs on browser (checks `isPlatformBrowser`)

**Configuration:** Registered in `app.config.ts` via `provideHttpClient(withInterceptors([authInterceptor]))`

**Location:** `src/app/services/auth.interceptor.ts`

### UserService

Manages user profiles, registration, and user favorites. Handles user lifecycle operations including account updates and deletion. Authentication headers are automatically added by the `authInterceptor`.

**Methods:**
- `getAllUsers()` - GET `/users` - Returns array of all user objects (admin use)
- `userRegistration(userDetails)` - POST `/users` - Creates new user account (public endpoint, no auth required)
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

## TypeScript Models

### Movie Interface

Strongly-typed interface matching the backend MongoDB schema.

**Location:** `src/app/models/movie.ts`

**Properties:**
```typescript
interface Movie {
  _id: string;                    // MongoDB document ID
  title: string;                  // Movie title (required)
  description: string;            // Movie description (required)
  release_year: number;           // Release year (required)
  image_url?: string;             // Poster image URL (optional)
  rating_imdb?: number;           // IMDb rating (optional)
  featured?: boolean;             // Featured flag (optional)
  starring?: string[];            // Array of actor names (optional)
  director?: {                    // Director object (optional)
    name: string;                 // Director name (required if director exists)
    bio?: string;                 // Director bio (optional)
    birth_date?: string;          // Birth date as ISO string (optional)
    death_date?: string;          // Death date as ISO string (optional)
  };
  genre?: {                       // Genre object (optional)
    name: string;                 // Genre name (required if genre exists)
    description?: string;         // Genre description (optional)
  };
}
```

## Components

### App (Root Component)

The main application component with navigation bar and logout functionality. Uses standalone component architecture.

**Features:**
- Material toolbar navbar with conditional rendering (hidden on welcome page)
- Router outlet for page navigation
- Logout button in navbar that clears auth state and redirects to welcome
- RouterLink navigation to Home (movies) and conditionally Profile
- Material button and toolbar modules

**Methods:**
- `onLogout()` - Calls `authService.logout()` to clear localStorage and navigates to welcome

**Location:** `src/app/app.ts`

### MovieCardComponent

Reactive movie browsing component with search and filtering. Displays movies in a responsive grid layout.

**Features:**
- **Reactive Streams:** Uses RxJS `BehaviorSubject`, `combineLatest`, and `shareReplay(1)` for efficient data flow
- **Async Pipe:** Template subscribes to observables with async pipe (no manual subscription management)
- **Search:** Real-time client-side filtering by title, director, genre, and actors (min 5 characters)
- **Responsive Grid:** Auto-filling grid layout that adapts to screen size
- **Hover Effects:** Card animations on hover for better UX
- **Loading States:** Shows "Loading movies..." while fetching data
- **Empty States:** Displays messages for empty results or no matches

**Observables:**
- `movies$` - Source stream from `MovieService.getAllMovies()` with `shareReplay(1)` to prevent duplicate HTTP calls
- `filteredMovies$` - Derived stream that filters movies based on search term using `combineLatest`
- `searchTermSubject` - BehaviorSubject for reactive search input

**Methods:**
- `onSearchChange()` - Updates search subject when user types (triggers filtering)

**Location:** `src/app/components/movie-card/`

### UserRegistrationFormComponent

A Material dialog component for user registration with reactive form validation.

**Features:**
- Standalone component with Material dependencies
- Reactive form with validation:
  - Username: required
  - Password: required
  - Email: required, valid email format
  - Birthdate: optional (date format)
- Form submission to `UserService.userRegistration()`
- Material Dialog integration for modal presentation
- Snackbar notifications for success/error feedback
- Automatic dialog closing on successful registration

**Dependencies:**
- `@angular/material/dialog` - MatDialog integration
- `@angular/material/snack-bar` - Toast notifications
- `@angular/material/card` - Card container styling
- `@angular/material/form-field` - Form field styling
- `@angular/material/input` - Input field styling
- `@angular/forms` - Reactive forms
- `UserService` - User registration API calls

**Location:** `src/app/components/user-registration-form/`

### UserLoginFormComponent

A Material dialog component for user login with reactive form validation.

**Features:**
- Standalone component with Material dependencies
- Reactive form with validation:
  - Username: required
  - Password: required
- Form submission to `AuthService.login()`
- Material Dialog integration for modal presentation
- Snackbar notifications for success/error feedback
- Automatic dialog closing on successful login
- Console logging of login response for debugging

**Dependencies:**
- `@angular/material/dialog` - MatDialog integration
- `@angular/material/snack-bar` - Toast notifications
- `@angular/material/card` - Card container styling
- `@angular/material/form-field` - Form field styling
- `@angular/material/input` - Input field styling
- `@angular/forms` - Reactive forms
- `AuthService` - User login API calls

**Location:** `src/app/components/user-login-form/`

## Material Dialog Pattern

The application uses Angular Material Dialogs for modal components. This pattern is used for authentication (login/registration) to keep the main application layout intact while presenting focused user interactions.

### How Material Dialogs Work in This Application

1. **Root Component (AppComponent)** injects `MatDialog` service
2. **Buttons in AppComponent** trigger dialog opening methods:
   - `openUserRegistrationDialog()` - Opens UserRegistrationFormComponent
   - `openUserLoginDialog()` - Opens UserLoginFormComponent
3. **Dialog components** (UserRegistrationFormComponent, UserLoginFormComponent):
   - Are standalone components
   - Are NOT included in the parent component's imports array
   - Are opened at runtime by MatDialog service
   - Close themselves on form submission
4. **Communication**:
   - Dialog components inject required services (AuthService, UserService)
   - They communicate with backend API directly
   - Show snackbar notifications for feedback
   - Auto-close after successful submission

### Benefits of This Pattern

- **Clean separation of concerns** - Dialog logic isolated in component
- **Reusability** - Same component can be opened from different locations
- **No template pollution** - Dialog markup not in main component template
- **Dynamic loading** - Components loaded only when needed
- **Easy to test** - Components can be tested independently

### Opening a Dialog Example

```typescript
// In AppComponent
readonly dialog = inject(MatDialog);

openUserLoginDialog(): void {
  const dialogRef = this.dialog.open(UserLoginFormComponent, {
    width: '280px',
    disableClose: false
  });

  // Optional: handle dialog close result
  dialogRef.afterClosed().subscribe(() => {
    // Dialog closed - perform any additional actions
  });
}
```

### Important Notes

- Dialog components should NOT be imported in parent component's `imports` array
- Dialog components should be standalone (`standalone: true`)
- Dialog components are dynamically instantiated by MatDialog service
- Use `MatDialogRef` to close dialog: `this.dialogRef.close()`

## Angular CLI Configuration

The project uses Angular CLI with custom schematics configuration to enforce consistent project structure.

### Component Naming Prefix

All generated components automatically use the **`kino-`** prefix as configured in `angular.json`:

```json
"@schematics/angular:component": {
  "prefix": "kino"
}
```

**Examples:**
- `ng generate component movie-list` → `<kino-movie-list></kino-movie-list>`
- `ng generate component movie-details` → `<kino-movie-details></kino-movie-details>`
- `ng generate component user-profile` → `<kino-user-profile></kino-user-profile>`

**Exception:** The root AppComponent uses `app-root` selector (defined explicitly in component)

### Component Directory Path

Components are automatically generated in `src/app/components/` as configured:

```json
"@schematics/angular:component": {
  "path": "src/app/components"
}
```

This ensures consistent file organization and makes it easy to locate components as the project grows.

## Quick Start

Get up and running in minutes:

```bash
# Clone the repository
git clone https://github.com/dkorotkov444/kino-client.git
cd kino-client

# Install dependencies
npm install

# Make sure backend API is running on localhost:8080
# Then start development server
npm start

# Open http://localhost:4200 in your browser
```

## Development Setup

### Prerequisites
- Node.js 20+
- npm 10.9.3
- Backend API running on `http://localhost:8080`
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

### Important: Backend API Requirement

**The application requires the REEL Movie API to be running** for authentication and data retrieval to work. 

- **Default development URL:** `http://localhost:8080`
- **Configuration:** See `src/environments/environment.ts`

Make sure the backend API is running before testing login/registration functionality.

### Testing Authentication

Once both the frontend and backend are running:

1. Navigate to `http://localhost:4200`
2. Click "Sign Up" button to register a new user
   - Fill in username, password, email, and birthdate
   - Check browser console (F12 → Console tab) for registration response
3. Click "Login" button to log in
   - Use credentials from registration
   - Check browser console for login response and token storage
4. Verify authentication:
   - Open browser DevTools (F12)
   - Go to Application → Local Storage
   - Look for `token` key containing JWT token
   - Look for `user` key containing user profile data

**Console Output Example:**
```
Registration response: { userId: "123", username: "john_doe", email: "john@example.com" }
Login response: { user: {...}, token: "eyJhbGciOiJIUzI1NiIs..." }
```

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

Angular CLI includes powerful code scaffolding tools. The project is configured to automatically generate components in the `src/app/components/` directory with the `kino-` prefix. To generate a new component, run:

```bash
ng generate component component-name
```

**Common generation commands:**
```bash
# Generate component (automatically placed in src/app/components/)
ng generate component movie-list

# Generate service (in src/app/services/)
ng generate service services/comment

# Generate pipe
ng generate pipe pipes/uppercase-first
```

**Generated component selector example:** `<kino-movie-list></kino-movie-list>`

For a complete list of available schematics, run:

```bash
ng generate --help
```

### Creating a New Component

Best practices when adding a new component:

1. **Generate the component** using Angular CLI (automatically placed in `src/app/components/`)
   ```bash
   ng generate component movie-list
   ```

2. **Import required Angular modules** (CommonModule, ReactiveFormsModule, Material modules, etc.)

3. **Inject services** using the `inject()` function pattern
   ```typescript
   private movieService = inject(MovieService);
   ```

4. **Use reactive patterns** with RxJS Observables and Services

5. **Add Material components** if needed (Dialog, Form Fields, Buttons, Cards, etc.)

6. **Write unit tests** in the auto-generated `.spec.ts` file

7. **Follow the naming convention:** Use `kino-` prefix (automatically applied by Angular CLI)

**Example - Movie List Component:**
```typescript
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MovieService } from '../../services/movie.service';

@Component({
  selector: 'kino-movie-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './movie-list.component.html',
  styleUrl: './movie-list.component.scss'
})
export class MovieListComponent {
  private movieService = inject(MovieService);
  movies$ = this.movieService.getAllMovies();
}
```

**Expected directory structure after generation:**
```
src/app/components/
├── user-registration-form/
├── user-login-form/
├── movie-list/                    # Generated here
│   ├── movie-list.component.ts
│   ├── movie-list.component.html
│   ├── movie-list.component.scss
│   └── movie-list.component.spec.ts
└── ... (more components)
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
