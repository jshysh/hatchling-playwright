import { Page } from "@playwright/test";
import { getEnvConfig } from "./env";

function isLoginPost(method: string, url: string): boolean {
  if (method !== "POST") {
    return false;
  }

  try {
    const { pathname } = new URL(url);
    return /\/(auth\/login|auth\/provider\/login|login)(\/)?$/i.test(pathname);
  } catch {
    return /login/i.test(url);
  }
}

async function fulfillLoginRoute(
  route: Parameters<Parameters<Page["route"]>[1]>[0],
  status: number,
  body: unknown,
  headers?: Record<string, string>,
): Promise<void> {
  await route.fulfill({
    status,
    contentType: "application/json",
    headers,
    body: JSON.stringify(body),
  });
}

export async function mockLoginSuccess(page: Page): Promise<void> {
  const { apiBaseURL } = getEnvConfig();

  const handler = async (route: Parameters<Parameters<Page["route"]>[1]>[0]) => {
    if (!isLoginPost(route.request().method(), route.request().url())) {
      await route.continue();
      return;
    }

    await fulfillLoginRoute(route, 200, {
      token: "mock-access-token",
      refreshToken: null,
      userId: "00000000-0000-0000-0000-000000000001",
      email: "provider@example.com",
      name: "Test Provider",
      role: "Provider",
      emailVerified: true,
      capabilities: ["can_parent"],
      verificationToken: null,
    }, {
      "Set-Cookie": "refresh_token=mock-refresh-token; Path=/; HttpOnly; SameSite=Lax",
    });
  };

  await page.route(`${apiBaseURL}/**`, handler);
  await page.route("**/api/**", handler);
}

export async function mockLoginFailure(
  page: Page,
  message = "Invalid email or password",
): Promise<void> {
  const { apiBaseURL } = getEnvConfig();

  const handler = async (route: Parameters<Parameters<Page["route"]>[1]>[0]) => {
    if (!isLoginPost(route.request().method(), route.request().url())) {
      await route.continue();
      return;
    }

    await fulfillLoginRoute(route, 400, { message });
  };

  await page.route(`${apiBaseURL}/**`, handler);
  await page.route("**/api/**", handler);
}
