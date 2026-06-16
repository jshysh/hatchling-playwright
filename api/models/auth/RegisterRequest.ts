export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
  turnstileToken: string;
  acceptedTerms: boolean;
}
