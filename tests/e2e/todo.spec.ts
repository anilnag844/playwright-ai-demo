import { test, expect } from '../../src/fixtures/test';

test.describe('TodoMVC', () => {
  test('adds new todos', async ({ todoPage }) => {
    await todoPage.addTodos(['write Playwright tests', 'review pull request']);

    await expect(todoPage.todoItems).toHaveCount(2);
    await expect(todoPage.todoCount).toContainText('2 items left');
  });

  test('completes a todo', async ({ todoPage }) => {
    await todoPage.addTodo('ship the release');
    await todoPage.completeTodo('ship the release');

    await expect(todoPage.todoItem('ship the release')).toHaveClass(/completed/);
    await expect(todoPage.todoCount).toContainText('0 items left');
  });

  test('deletes a todo', async ({ todoPage }) => {
    await todoPage.addTodos(['keep me', 'delete me']);
    await todoPage.deleteTodo('delete me');

    await expect(todoPage.todoItems).toHaveCount(1);
    await expect(todoPage.todoItem('keep me')).toBeVisible();
  });

  test('filters active and completed todos', async ({ todoPage }) => {
    await todoPage.addTodos(['done task', 'open task']);
    await todoPage.completeTodo('done task');

    await todoPage.filterBy('Active');
    await expect(todoPage.todoItems).toHaveCount(1);
    await expect(todoPage.todoItem('open task')).toBeVisible();

    await todoPage.filterBy('Completed');
    await expect(todoPage.todoItems).toHaveCount(1);
    await expect(todoPage.todoItem('done task')).toBeVisible();
  });

  test('clears completed todos', async ({ todoPage }) => {
    await todoPage.addTodos(['finished', 'in progress']);
    await todoPage.completeTodo('finished');
    await todoPage.clearCompletedButton.click();

    await expect(todoPage.todoItems).toHaveCount(1);
    await expect(todoPage.todoItem('in progress')).toBeVisible();
  });
});
