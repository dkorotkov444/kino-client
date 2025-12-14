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
