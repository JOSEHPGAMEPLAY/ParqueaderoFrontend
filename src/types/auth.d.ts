// Tipos relacionados con autenticación
type AuthInputs = {
  username: string;
  password: string;
};

export type LoginInputs = AuthInputs;

export type RegisterInputs = AuthInputs & {
  confirmPassword: string;
};

export type LoginResponse = {
  token: string;
  user: {
    id: string;
    username: string;
    role?: string;
  };
};