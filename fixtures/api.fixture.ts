import { test as base } from '@playwright/test';
import { ApiClient } from '../api/clients/ApiClient';
import { getEnvConfig } from '../utils/env';

interface ApiFixtures {
  apiClient: ApiClient;
}

export const test = base.extend<ApiFixtures>({
  apiClient: async ({ request }, use) => {
    const { apiBaseURL } = getEnvConfig();
    await use(new ApiClient(request, apiBaseURL));
  },
});

export { expect } from '@playwright/test';
