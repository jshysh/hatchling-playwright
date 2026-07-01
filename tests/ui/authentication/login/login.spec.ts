import { test, expect } from '../../../../fixtures/ui.fixture';
import { validProvider, invalidProvider } from '../../../../data/users';
import { mockLoginSuccess, mockLoginFailure } from '../../../../utils/networkMocks';

test.describe('Authentication', () => {
  test.describe('Login', () => {
    test('should display the login page', async ({ loginPage }) => {
      await loginPage.open();

      await expect(loginPage.loginForm).toHaveScreenshot('login-form.png');
    });

    test('should login successfully with valid credentials', async ({ loginPage, page }) => {
      await mockLoginSuccess(page);
      await loginPage.open();

      const loginResponsePromise = page.waitForResponse(
        (response) =>
          response.request().method() === 'POST' && /login/i.test(response.url()),
      );

      await loginPage.login(validProvider);
      const loginResponse = await loginResponsePromise;

      expect(loginResponse.status()).toBe(200);

      const body = (await loginResponse.json()) as { token: string; email: string };
      expect(body.token).toBe('mock-access-token');
      expect(body.email).toBe('provider@example.com');

      await expect(page).not.toHaveURL(/\/login$/);
      await expect(page.getByText(/found \d+ providers/i)).toBeVisible();
    });

    test('should reject invalid credentials', async ({ loginPage, page }) => {
      await mockLoginFailure(page);
      await loginPage.open();

      await loginPage.login(invalidProvider);

      await expect(page).toHaveURL(/\/login/);
      await loginPage.expectErrorMessage(/invalid email or password/i);
    });
  });
});
