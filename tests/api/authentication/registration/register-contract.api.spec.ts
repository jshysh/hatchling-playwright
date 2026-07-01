import { test, expect } from '../../../../fixtures/api.fixture';
import { RegisterRequestBuilder } from '../../../../api/builders/auth/RegisterRequestBuilder';

/**
 * Temporary contract exploration test for POST /auth/provider/register.
 * Excluded from CI — run locally with:
 *   npx playwright test tests/api/authentication/registration/register-contract.api.spec.ts
 */

test.describe.configure({ mode: 'serial' });

test.describe('Authentication', () => {
  test.describe('Registration', () => {
    test.describe('Contract Exploration', () => {
      async function printResponse(
        label: string,
        status: number,
        headers: Record<string, string>,
        text: string
      ): Promise<void> {
        console.log(`\n${'='.repeat(60)}`);
        console.log(`SCENARIO: ${label}`);
        console.log(`STATUS: ${status}`);
        console.log('HEADERS:');
        console.log(JSON.stringify(headers, null, 2));
        console.log('BODY:');
        try {
          console.log(JSON.stringify(JSON.parse(text), null, 2));
        } catch {
          console.log(text);
        }
        console.log('='.repeat(60));
      }

      test('scenario: successful registration', async ({ authClient }) => {
        const payload = RegisterRequestBuilder.default().build();
        console.log('\nREQUEST:', JSON.stringify(payload, null, 2));

        const response = await authClient.register(payload);
        await printResponse(
          'Successful registration',
          response.status(),
          response.headers(),
          await response.text()
        );

        expect(response.status()).toBeGreaterThanOrEqual(100);
      });

      test('scenario: duplicate email', async ({ authClient }) => {
        const payload = RegisterRequestBuilder.default().build();

        const first = await authClient.register(payload);
        console.log(`\nFirst registration status: ${first.status()}`);

        const response = await authClient.register(payload);
        await printResponse(
          'Duplicate email',
          response.status(),
          response.headers(),
          await response.text()
        );

        expect(response.status()).toBeGreaterThanOrEqual(100);
      });

      test('scenario: acceptedTerms false', async ({ authClient }) => {
        const payload = RegisterRequestBuilder.default().withAcceptedTerms(false).build();

        const response = await authClient.register(payload);
        await printResponse(
          'acceptedTerms: false',
          response.status(),
          response.headers(),
          await response.text()
        );

        expect(response.status()).toBeGreaterThanOrEqual(100);
      });

      test('scenario: invalid email', async ({ authClient }) => {
        const payload = RegisterRequestBuilder.default().withEmail('not-a-valid-email').build();

        const response = await authClient.register(payload);
        await printResponse(
          'Invalid email',
          response.status(),
          response.headers(),
          await response.text()
        );

        expect(response.status()).toBeGreaterThanOrEqual(100);
      });

      test('scenario: invalid password', async ({ authClient }) => {
        const payload = RegisterRequestBuilder.default().withPassword('abc').build();

        const response = await authClient.register(payload);
        await printResponse(
          'Invalid password (too short)',
          response.status(),
          response.headers(),
          await response.text()
        );

        expect(response.status()).toBeGreaterThanOrEqual(100);
      });
    });
  });
});
