import type { APIRequestContext, APIResponse } from '@playwright/test';
import { expect } from '@playwright/test';

/**
 * Shared API client wrapping Playwright's APIRequestContext.
 *
 * Centralizes status assertions and JSON parsing so API specs read as
 * intent ("get user 1, expect shape X") rather than HTTP plumbing. In a
 * real framework this layer also owns auth-token refresh, retries, and
 * request/response logging.
 */
export class ApiClient {
  constructor(private readonly request: APIRequestContext) {}

  async get<T>(path: string, expectedStatus = 200): Promise<T> {
    const response = await this.request.get(path);
    return this.parse<T>(response, expectedStatus);
  }

  async post<T>(path: string, data: unknown, expectedStatus = 201): Promise<T> {
    const response = await this.request.post(path, { data });
    return this.parse<T>(response, expectedStatus);
  }

  async put<T>(path: string, data: unknown, expectedStatus = 200): Promise<T> {
    const response = await this.request.put(path, { data });
    return this.parse<T>(response, expectedStatus);
  }

  async delete(path: string, expectedStatus = 200): Promise<void> {
    const response = await this.request.delete(path);
    expect(response.status(), `DELETE ${path}`).toBe(expectedStatus);
  }

  private async parse<T>(response: APIResponse, expectedStatus: number): Promise<T> {
    expect(response.status(), `${response.url()} returned ${response.status()}`).toBe(expectedStatus);
    return (await response.json()) as T;
  }
}
