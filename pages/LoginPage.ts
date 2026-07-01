import { expect, Locator, Page } from "@playwright/test";
import { LoginCredentials } from "../data/users";
import { DashboardPage } from "./DashboardPage";

export class LoginPage {
  private readonly heading = this.page.getByRole("heading", { name: "Welcome back" });
  private readonly emailInput = this.page.getByRole("textbox", { name: /email/i });
  private readonly passwordInput = this.page.getByRole("textbox", { name: /password/i });
  private readonly loginButton = this.page.getByRole("button", { name: "Log in" });
  readonly loginForm: Locator;

  constructor(protected readonly page: Page) {
    this.loginForm = this.page
      .getByRole("heading", { name: "Welcome back" })
      .locator("..");
  }

  async open(): Promise<this> {
    await this.page.goto("/login");
    await this.expectLoaded();
    return this;
  }

  async login(credentials: LoginCredentials): Promise<DashboardPage> {
    await this.emailInput.fill(credentials.email);
    await this.passwordInput.fill(credentials.password);
    await this.loginButton.click();
    return new DashboardPage(this.page);
  }

  async expectLoaded(): Promise<void> {
    await expect(this.heading).toBeVisible();
    await expect(this.emailInput).toBeVisible();
    await expect(this.passwordInput).toBeVisible();
    await expect(this.loginButton).toBeVisible();
  }

  async expectErrorMessage(message: string | RegExp): Promise<void> {
    await expect(this.page.getByText(message)).toBeVisible();
  }
}
