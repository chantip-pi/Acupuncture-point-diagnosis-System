/**
 * Datasource configuration
 * 
 * Controls which datasource implementation to use.
 * 
 * To use mock datasource (default):
 *   - Set USE_MOCK_DATASOURCE=true in environment variables, OR
 *   - Leave this config as "mock"
 * 
 * To use real API datasource:
 *   - Set USE_MOCK_DATASOURCE=false in environment variables, OR
 *   - Change the default below to "api"
 * 
 * In the future, you can add more datasource types (e.g., 'database', 'api', 'mock')
 */
export type DatasourceType = "mock" | "api";

// Check environment variable (works in both Node.js and Vite)
const useMockEnv = 
  typeof process !== "undefined" && process.env
    ? process.env.USE_MOCK_DATASOURCE || process.env.VITE_USE_MOCK_DATASOURCE
    : undefined;

export const DATASOURCE_CONFIG = {
  /**
   * Determines which datasource to use.
   * Can be set via environment variable USE_MOCK_DATASOURCE or VITE_USE_MOCK_DATASOURCE
   * Defaults to "mock" for development
   */
  type: (useMockEnv === "false" ? "api" : "mock") as DatasourceType,
} as const;

