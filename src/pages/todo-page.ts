import type { Locator, Page } from '@playwright/test';

/**
 * Page Object for the TodoMVC demo app.
 *
 * Locators are declared once in the constructor and reused — specs never
 * touch raw selectors, so UI changes are absorbed here instead of rippling
 * through the suite.
 */
export class TodoPage {
  readonly newTodoInput: Locator;
  readonly todoItems: Locator;
  readonly todoCount: Locator;
  readonly clearCompletedButton: Locator;

  constructor(public readonly page: Page) {
    this.newTodoInput = page.getByPlaceholder('What needs to be done?');
    this.todoItems = page.getByTestId('todo-item');
    this.todoCount = page.getByTestId('todo-count');
    this.clearCompletedButton = page.getByRole('button', { name: 'Clear completed' });
  }

  async goto(): Promise<void> {
    await this.page.goto('./');
  }

  async addTodo(text: string): Promise<void> {
    await this.newTodoInput.fill(text);
    await this.newTodoInput.press('Enter');
  }

  async addTodos(items: string[]): Promise<void> {
    for (const item of items) {
      await this.addTodo(item);
    }
  }

  todoItem(text: string): Locator {
    return this.todoItems.filter({ hasText: text });
  }

  async completeTodo(text: string): Promise<void> {
    await this.todoItem(text).getByRole('checkbox').check();
  }

  async deleteTodo(text: string): Promise<void> {
    const item = this.todoItem(text);
    await item.hover();
    await item.getByRole('button', { name: 'Delete' }).click();
  }

  async filterBy(filter: 'All' | 'Active' | 'Completed'): Promise<void> {
    await this.page.getByRole('link', { name: filter }).click();
  }
}
