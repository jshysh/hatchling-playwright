import { test as base } from '@playwright/test';
import { ApiClient } from '../api/clients/ApiClient';
import { AuthClient } from '../api/clients/AuthClient';
import { getEnvConfig } from '../utils/env';

interface ApiFixtures {
  apiClient: ApiClient;
  authClient: AuthClient;
}

export const test = base.extend<ApiFixtures>({
  apiClient: async ({ request }, use) => {
    const { apiBaseURL } = getEnvConfig();
    await use(new ApiClient(request, apiBaseURL));
  },

  authClient: async ({ request }, use) => {
    const { apiBaseURL } = getEnvConfig();
    await use(new AuthClient(request, apiBaseURL));
  },
});

export { expect } from '@playwright/test';
