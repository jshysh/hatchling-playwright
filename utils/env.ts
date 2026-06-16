export type Environment = "local" | "staging" | "production";

export interface EnvironmentConfig {
  baseURL: string;
  apiBaseURL: string;
}

const VALID_ENVIRONMENTS: Environment[] = ["local", "staging", "production"];

const environments: Record<Environment, EnvironmentConfig> = {
  local: {
    baseURL: "http://localhost:5400",
    apiBaseURL: "http://localhost:5400",
  },
  staging: {
    baseURL: "https://dev.hatchling.ca",
    apiBaseURL: "https://hatchling-dev-api.up.railway.app",
  },
  production: {
    baseURL: "https://hatchling.ca",
    apiBaseURL: "https://api.hatchling.ca",
  },
};

function resolveEnvironment(): Environment {
  const raw = process.env["TEST_ENV"] ?? "local";

  if (!VALID_ENVIRONMENTS.includes(raw as Environment)) {
    throw new Error(
      `Unknown TEST_ENV: "${raw}". Valid values: ${VALID_ENVIRONMENTS.join(", ")}.`,
    );
  }

  return raw as Environment;
}

export function getEnvConfig(): EnvironmentConfig {
  return environments[resolveEnvironment()];
}
