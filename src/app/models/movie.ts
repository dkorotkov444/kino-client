/**
 * @file src/app/models/movie.ts
 * @fileoverview Movie model interface for Kino app
 * @author Dmitri Korotkov
 * @copyright Dmitri Korotkov 2025
 */

/**
 * Type definition for movie data returned by the Kino API.
 */
export interface Movie {
  _id: string;
  title: string;
  description: string;
  release_year: number;
  image_url?: string;
  rating_imdb?: number;
  featured?: boolean;
  starring?: string[];
  director?: {
    name: string;
    bio?: string;
    birth_date?: string;
    death_date?: string;
  };
  genre?: {
    name: string;
    description?: string;
  };
}
