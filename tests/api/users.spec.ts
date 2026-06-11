import { test, expect } from '../../src/fixtures/test';

interface User {
  id: number;
  name: string;
  username: string;
  email: string;
}

interface Post {
  id: number;
  userId: number;
  title: string;
  body: string;
}

test.describe('JSONPlaceholder API', () => {
  test('fetches a user by id', async ({ apiClient }) => {
    const user = await apiClient.get<User>('/users/1');

    expect(user.id).toBe(1);
    expect(user.email).toMatch(/^[^@]+@[^@]+\.[a-z]+$/i);
    expect(user.name).toBeTruthy();
  });

  test('lists all users', async ({ apiClient }) => {
    const users = await apiClient.get<User[]>('/users');

    expect(users).toHaveLength(10);
    for (const user of users) {
      expect(user).toMatchObject({
        id: expect.any(Number),
        name: expect.any(String),
        email: expect.any(String),
      });
    }
  });

  test('creates a post', async ({ apiClient }) => {
    const created = await apiClient.post<Post>('/posts', {
      userId: 1,
      title: 'Testing with a shared API client',
      body: 'Specs stay declarative; HTTP plumbing lives in one place.',
    });

    expect(created.id).toEqual(expect.any(Number));
    expect(created.title).toBe('Testing with a shared API client');
  });

  test('returns 404 for a missing resource', async ({ apiClient }) => {
    await apiClient.get('/users/9999', 404);
  });
});
