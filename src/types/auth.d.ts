// Tipos relacionados con autenticación
type AuthInputs = {
  username: string;
  password: string;
};

export type LoginInputs = AuthInputs;

export type RegisterInputs = AuthInputs & {
  confirmPassword: string;
};

// Usuario unificado
export type User = {
  id: string;
  username: string;
  role: string;
};

export type LoginResponse = {
  token: string;
  user: User;
};

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (credentials: LoginInputs) => Promise<User>; 
  logout: () => void;
}