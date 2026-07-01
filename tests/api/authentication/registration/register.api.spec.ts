import { test, expect } from '../../../../fixtures/api.fixture';
import { RegisterRequestBuilder } from '../../../../api/builders/auth/RegisterRequestBuilder';
import {
  RegisterResponse,
  RegisterErrorResponse,
  RegisterDuplicateEmailErrorResponse,
} from '../../../../api/models/auth/RegisterResponse';

/**
 * POST /auth/provider/register
 *
 * Confirmed via contract exploration (local dev):
 * - Success: HTTP 200, flat JSON body, refresh token delivered as HttpOnly cookie
 * - Validation failures: ASP.NET ProblemDetails (title, status, errors)
 * - Duplicate email: HTTP 400 with { message: string }
 * - acceptedTerms is not enforced server-side (API returns 200 regardless)
 * - Rate limit: 429 with retry-after: 3600s — run tests serially to avoid exhausting quota
 * - Turnstile token 'XXXX.DUMMY.TOKEN.XXXX' is accepted in local dev
 */

test.describe('Authentication', () => {
  test.describe.configure({ mode: 'serial' });

  test.describe('Registration', () => {
    test('should register a new provider', async ({ authClient }) => {
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
      expect(body.refreshToken).toBeNull();
    });

    test('should reject duplicate email', async ({ authClient }) => {
      const payload = RegisterRequestBuilder.default().build();

      const firstResponse = await authClient.register(payload);
      expect(firstResponse.status()).toBe(200);

      const duplicateResponse = await authClient.register(payload);

      expect(duplicateResponse.status()).toBe(400);

      const body = (await duplicateResponse.json()) as RegisterDuplicateEmailErrorResponse;
      expect(body.message).toBe('User with this email already exists');
    });

    test('should reject invalid email', async ({ authClient }) => {
      const payload = RegisterRequestBuilder.default()
        .withEmail('not-a-valid-email')
        .build();

      const response = await authClient.register(payload);

      expect(response.status()).toBe(400);

      const body = (await response.json()) as RegisterErrorResponse;
      expect(body.status).toBe(400);
      expect(body.title).toBeTruthy();

      const emailErrors = body.errors?.['Email'] ?? body.errors?.['email'];
      expect(emailErrors).toBeDefined();
      expect(emailErrors!.length).toBeGreaterThan(0);
    });

    test('should reject weak password', async ({ authClient }) => {
      const payload = RegisterRequestBuilder.default()
        .withPassword('abc')
        .build();

      const response = await authClient.register(payload);

      expect(response.status()).toBe(400);

      const body = (await response.json()) as RegisterErrorResponse;
      expect(body.status).toBe(400);
      expect(body.title).toBeTruthy();

      const passwordErrors = body.errors?.['Password'] ?? body.errors?.['password'];
      expect(passwordErrors).toBeDefined();
      expect(passwordErrors!.length).toBeGreaterThan(0);
    });

    test('should register when terms are not accepted (client-side enforcement only)', async ({
      authClient,
    }) => {
      const payload = RegisterRequestBuilder.default()
        .withAcceptedTerms(false)
        .build();

      const response = await authClient.register(payload);

      expect(response.status()).toBe(200);
    });
  });
});
