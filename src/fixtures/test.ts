import { test as base } from '@playwright/test';
import { TodoPage } from '../pages/todo-page';
import { ApiClient } from '../api/api-client';

/**
 * Custom fixtures: specs receive ready-to-use page objects and API clients
 * instead of constructing them inline. Adding a new page object means one
 * line here, not boilerplate in every spec.
 */
type Fixtures = {
  todoPage: TodoPage;
  apiClient: ApiClient;
};

export const test = base.extend<Fixtures>({
  todoPage: async ({ page }, use) => {
    const todoPage = new TodoPage(page);
    await todoPage.goto();
    await use(todoPage);
  },
  apiClient: async ({ request }, use) => {
    await use(new ApiClient(request));
  },
});

export { expect } from '@playwright/test';
