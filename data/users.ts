export interface LoginCredentials {
  email: string;
  password: string;
}

export const validProvider: LoginCredentials = {
  email: "provider@example.com",
  password: "Password1!",
};

export const invalidProvider: LoginCredentials = {
  email: "invalid@example.com",
  password: "wrong-password",
};
