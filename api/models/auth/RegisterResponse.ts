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
 * ASP.NET Core ProblemDetails format returned for validation errors (400).
 * Field-level errors are keyed by property name, each with an array of messages.
 */
export interface RegisterErrorResponse {
  title?: string;
  status?: number;
  message?: string;
  errors?: Record<string, string[]>;
  traceId?: string;
}

/** Returned by the API when the registration rate limit is exceeded (429) */
export interface RateLimitResponse {
  error: 'rate_limited';
  message: string;
  retryAfterSeconds: number;
}
