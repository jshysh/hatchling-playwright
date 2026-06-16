import { test, expect } from '../../../fixtures/api.fixture';
import { RegisterRequestBuilder } from '../../../api/builders/auth/RegisterRequestBuilder';
import { RegisterResponse, RegisterErrorResponse } from '../../../api/models/auth/RegisterResponse';

/**
 * POST /auth/provider/register
 *
 * Confirmed via contract exploration (local dev):
 * - Success: HTTP 200, flat JSON body, refresh token delivered as HttpOnly cookie
 * - Error format: ASP.NET Core ProblemDetails — use `title` and `errors` fields, not `message`
 * - acceptedTerms is not enforced server-side (API returns 200 regardless)
 * - Rate limit: 429 with retry-after: 3600s — run tests serially to avoid exhausting quota
 * - Turnstile token 'XXXX.DUMMY.TOKEN.XXXX' is accepted in local dev
 *
 * Still to confirm against the live API:
 * - Duplicate email status code (assumed 409)
 * - Validation error status codes (assumed 400)
 */

test.describe.configure({ mode: 'serial' });

test.describe('POST /auth/provider/register', () => {
  test('should register a new user successfully', async ({ authClient }) => {
    const payload = RegisterRequestBuilder.default().build();

    const response = await authClient.register(payload);

    expect(response.status()).toBe(200);

    const body = (await response.json()) as RegisterResponse;

    expect(body.token).toBeTruthy();
    expect(body.userId).toBeTruthy();
    expect(body.email).toBe(payload.email);
    expect(body.name).toBe(payload.name);
    expect(body.role).toBe('Provider');
    expect(body.emailVerified).toBe(false);
    expect(body.capabilities).toBeInstanceOf(Array);
    expect(body.verificationToken).toBeTruthy();
    // refresh token is delivered as an HttpOnly cookie, not in the response body
    expect(body.refreshToken).toBeNull();
  });

  test('should return an error when registering with an existing email', async ({ authClient }) => {
    const payload = RegisterRequestBuilder.default().build();

    const firstResponse = await authClient.register(payload);
    expect(firstResponse.status()).toBe(200);

    const duplicateResponse = await authClient.register(payload);

    // ASSUMPTION: 409 Conflict for duplicate email — confirm against live API
    expect(duplicateResponse.status()).toBe(409);

    const body = (await duplicateResponse.json()) as RegisterErrorResponse;
    expect(body.title ?? body.message).toBeTruthy();
  });

  test('API does not enforce acceptedTerms server-side', async ({ authClient }) => {
    const payload = RegisterRequestBuilder.default()
      .withAcceptedTerms(false)
      .build();

    const response = await authClient.register(payload);

    // The API returns 200 regardless of acceptedTerms value.
    // Terms acceptance is enforced client-side only.
    expect(response.status()).toBe(200);
  });

  test('should return a validation error for an invalid email address', async ({ authClient }) => {
    const payload = RegisterRequestBuilder.default()
      .withEmail('not-a-valid-email')
      .build();

    const response = await authClient.register(payload);

    // ASSUMPTION: 400 Bad Request — confirm against live API
    expect(response.status()).toBe(400);

    // ASP.NET Core ProblemDetails format: validation details in `title` and `errors`
    const body = (await response.json()) as RegisterErrorResponse;
    expect(body.title ?? body.message).toBeTruthy();
  });

  test('should return a validation error for an invalid password', async ({ authClient }) => {
    // 'abc' — intentionally below typical minimum length requirements
    const payload = RegisterRequestBuilder.default()
      .withPassword('abc')
      .build();

    const response = await authClient.register(payload);

    // ASSUMPTION: 400 Bad Request — confirm against live API
    expect(response.status()).toBe(400);

    const body = (await response.json()) as RegisterErrorResponse;
    expect(body.title ?? body.message).toBeTruthy();
  });
});
