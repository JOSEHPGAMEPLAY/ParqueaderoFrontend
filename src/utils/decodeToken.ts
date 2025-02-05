import jwt from 'jsonwebtoken';

export interface DecodedToken {
  role?: string;
  exp?: number;
  [key: string]: any; 
}

export const decodeToken = (token: string): DecodedToken | null => {
  try {
    return jwt.decode(token) as DecodedToken;
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
};
