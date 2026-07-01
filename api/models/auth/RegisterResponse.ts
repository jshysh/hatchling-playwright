export interface RegisterResponse {
  token: string;
  /** Always null in the response body — refresh token is delivered as an HttpOnly cookie */
  refreshToken: string | null;
  userId: string;
  email: string;
  name: string;
  role: string;
  emailVerified: boolean;
  capabilities: string[];
  verificationToken: string;
}

/**
 * ASP.NET Core ProblemDetails format returned for validation errors (HTTP 400).
 * Content-Type: application/problem+json
 */
export interface RegisterErrorResponse {
  type?: string;
  title: string;
  status: number;
  detail?: string;
  message?: string;
  errors?: Record<string, string[]>;
  traceId?: string;
}

/**
 * Returned when registering with an email that already exists (HTTP 400).
 * Content-Type: application/json
 */
export interface RegisterDuplicateEmailErrorResponse {
  message: string;
}

/** Returned by the API when the registration rate limit is exceeded (429) */
export interface RateLimitResponse {
  error: 'rate_limited';
  message: string;
  retryAfterSeconds: number;
}
