export interface User {
    username: string;
    password: string;
    email: string;
    birth_date?: string;
    tokenInvalidBefore?: Date;
    favorites?: string[];
  }
  