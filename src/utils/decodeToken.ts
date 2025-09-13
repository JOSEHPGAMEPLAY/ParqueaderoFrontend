import { jwtDecode, JwtPayload } from 'jwt-decode';

export interface DecodedToken extends JwtPayload {
  role?: string;
  userId?: string;
  [key: string]: any;
}

export const decodeJwt = (token: string): DecodedToken | null => {
  try {
    return jwtDecode<DecodedToken>(token);
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
};
