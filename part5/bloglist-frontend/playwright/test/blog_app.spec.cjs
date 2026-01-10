const { test, expect, describe } = require('@playwright/test')

describe('Blog app', () => {
  test.beforeEach(async ({ page, request }) => {
    // Reset database
    await request.post('http://localhost:3003/api/testing/reset')

    // Create user
    await request.post('http://localhost:3003/api/users', {
      data: {
        name: 'Test User',
        username: 'testuser',
        password: 'password123',
      },
    })

    // Create another user
    await request.post('http://localhost:3003/api/users', {
      data: {
        name: 'Other User',
        username: 'otheruser',
        password: 'password123',
      },
    })

    // Go to frontend
    await page.goto('http://localhost:5173')
  })

  test('Login form is shown', async ({ page }) => {
    await expect(page.getByText('Log in to application')).toBeVisible()
    await expect(page.getByRole('textbox', { name: 'Username' })).toBeVisible()
    await expect(page.getByRole('textbox', { name: 'Password' })).toBeVisible()
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await page.getByRole('textbox', { name: 'Username' }).fill('testuser')
      await page.getByRole('textbox', { name: 'Password' }).fill('password123')
      await page.getByRole('button', { name: 'login' }).click()
      await expect(page.getByText('Test User logged in')).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await page.getByRole('textbox', { name: 'Username' }).fill('testuser')
      await page.getByRole('textbox', { name: 'Password' }).fill('wrongpassword')
      await page.getByRole('button', { name: 'login' }).click()
      await expect(page.getByText('wrong username or password')).toBeVisible()
    })
  })

  describe('When logged in', () => {
    test.beforeEach(async ({ page }) => {
      // Login
      await page.getByTestId('username').fill('testuser')
      await page.getByTestId('password').fill('password123')
      await page.getByRole('button', { name: 'login' }).click()
    })

    test('a new blog can be created', async ({ page }) => {
      await page.getByRole('button', { name: 'create new blog' }).click()

      const inputs = page.getByRole('textbox')
      await inputs.nth(0).fill('Playwright testing blog')
      await inputs.nth(1).fill('E2E Tester')
      await inputs.nth(2).fill('https://playwright.dev')

      await page.getByRole('button', { name: 'create' }).click()

      await expect(page.getByTestId('blog-title')).toHaveText('Playwright testing blog E2E Tester')
    })

    test('a blog can be liked', async ({ page, request }) => {
      // Create blog via API
      const loginRes = await request.post('http://localhost:3003/api/login', {
        data: { username: 'testuser', password: 'password123' },
      })
      const token = loginRes.data.token
      await request.post('http://localhost:3003/api/blogs', {
        data: { title: 'Like Test Blog', author: 'E2E Tester', url: 'https://playwright.dev' },
        headers: { Authorization: `Bearer ${token}` },
      })

      await page.reload()
      const blog = page.locator('.blog').filter({ hasText: 'Like Test Blog' })
      await blog.getByRole('button', { name: 'view' }).click()

      const likesCount = blog.getByTestId('likes-count')
      await blog.getByRole('button', { name: 'like' }).click()
      await expect(likesCount).toHaveText('1')
    })

    test('the user who created a blog can delete it', async ({ page, request }) => {
      // Create blog via API
      const loginRes = await request.post('http://localhost:3003/api/login', {
        data: { username: 'testuser', password: 'password123' },
      })
      const token = loginRes.data.token
      await request.post('http://localhost:3003/api/blogs', {
        data: { title: 'Delete Test Blog', author: 'E2E Tester', url: 'https://playwright.dev' },
        headers: { Authorization: `Bearer ${token}` },
      })

      await page.reload()
      const blog = page.locator('.blog').filter({ hasText: 'Delete Test Blog' })
      await blog.getByRole('button', { name: 'view' }).click()

      // Intercept window.confirm
      page.on('dialog', dialog => dialog.accept())

      await blog.getByRole('button', { name: 'delete' }).click()

      await expect(blog).toHaveCount(0)
    })

    test("only the creator sees the delete button", async ({ page, request }) => {
      // Create blog as testuser
      const loginRes = await request.post('http://localhost:3003/api/login', {
        data: { username: 'testuser', password: 'password123' },
      })
      const token = loginRes.data.token
      await request.post('http://localhost:3003/api/blogs', {
        data: { title: 'Only Creator Blog', author: 'E2E Tester', url: 'https://playwright.dev' },
        headers: { Authorization: `Bearer ${token}` },
      })

      await page.reload()
      const blog = page.locator('.blog').filter({ hasText: 'Only Creator Blog' })
      await blog.getByRole('button', { name: 'view' }).click()
      await expect(blog.getByRole('button', { name: 'delete' })).toBeVisible()

      // Logout
      await page.getByRole('button', { name: 'logout' }).click()

      // Login as otheruser
      await page.getByTestId('username').fill('otheruser')
      await page.getByTestId('password').fill('password123')
      await page.getByRole('button', { name: 'login' }).click()

      await page.reload()
      const blogOther = page.locator('.blog').filter({ hasText: 'Only Creator Blog' })
      await blogOther.getByRole('button', { name: 'view' }).click()
      await expect(blogOther.getByRole('button', { name: 'delete' })).toHaveCount(0)
    })

    test('blogs are ordered according to likes', async ({ page, request }) => {
      // Login and get token
      const loginRes = await request.post('http://localhost:3003/api/login', {
        data: { username: 'testuser', password: 'password123' },
      })
      const token = loginRes.data.token

      // Create multiple blogs with likes
      const blogs = [
        { title: 'Blog One', author: 'A', url: 'url1', likes: 1 },
        { title: 'Blog Two', author: 'B', url: 'url2', likes: 3 },
        { title: 'Blog Three', author: 'C', url: 'url3', likes: 2 },
      ]

      for (const blog of blogs) {
        await request.post('http://localhost:3003/api/blogs', {
          data: blog,
          headers: { Authorization: `Bearer ${token}` },
        })
      }

      await page.reload()

      // Expand all blogs
      const allBlogs = page.locator('.blog')
      const count = await allBlogs.count()
      for (let i = 0; i < count; i++) {
        await allBlogs.nth(i).getByRole('button', { name: 'view' }).click()
      }

      // Collect likes
      const likesArray = []
      for (let i = 0; i < count; i++) {
        const likesText = await allBlogs.nth(i).getByTestId('likes-count').textContent()
        likesArray.push(parseInt(likesText))
      }

      // Check descending order
      for (let i = 0; i < likesArray.length - 1; i++) {
        expect(likesArray[i]).toBeGreaterThanOrEqual(likesArray[i + 1])
      }
    })
  })
})
