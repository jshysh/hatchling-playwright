import { expect, Page } from "@playwright/test";

export class DashboardPage {
  constructor(protected readonly page: Page) {}

  async expectLoaded(): Promise<void> {
    await expect(this.page).not.toHaveURL(/\/login$/);
    await expect(this.page.getByText(/found \d+ providers/i)).toBeVisible();
  }
}
