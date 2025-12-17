/**
 * @file src/app/models/user.ts
 * @fileoverview User model interface for Kino app
 * @author Dmitri Korotkov
 * @copyright Dmitri Korotkov 2025
 */

/**
 * Type definition for user data returned by the Kino API.
 */
export interface User {
    username: string;
    password: string;
    email: string;
    birth_date?: string;
    tokenInvalidBefore?: Date;
    favorites?: string[];
  }
  