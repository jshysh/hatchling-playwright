export type Environment = 'local' | 'staging' | 'production';

export interface EnvironmentConfig {
  baseURL: string;
  apiBaseURL: string;
}

const VALID_ENVIRONMENTS: Environment[] = ['local', 'staging', 'production'];

const environments: Record<Environment, EnvironmentConfig> = {
  local: {
    baseURL: 'http://localhost:3000',
    apiBaseURL: 'http://localhost:3000/api',
  },
  staging: {
    baseURL: 'https://staging.hatchling.app',
    apiBaseURL: 'https://staging.hatchling.app/api',
  },
  production: {
    baseURL: 'https://hatchling.app',
    apiBaseURL: 'https://hatchling.app/api',
  },
};

function resolveEnvironment(): Environment {
  const raw = process.env['TEST_ENV'] ?? 'local';

  if (!VALID_ENVIRONMENTS.includes(raw as Environment)) {
    throw new Error(
      `Unknown TEST_ENV: "${raw}". Valid values: ${VALID_ENVIRONMENTS.join(', ')}.`
    );
  }

  return raw as Environment;
}

export function getEnvConfig(): EnvironmentConfig {
  return environments[resolveEnvironment()];
}
