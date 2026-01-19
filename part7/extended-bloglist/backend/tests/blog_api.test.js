const { test, describe, beforeEach, after } = require('node:test')
const assert = require('node:assert')
const supertest = require('supertest')
const mongoose = require('mongoose')

const app = require('../app')
const Blog = require('../models/blog')
const User = require('../models/user')
const helper = require('./test_helper')

const api = supertest(app)
let token = null // token global para tests de POST

beforeEach(async () => {
  // Limpiar base de datos
  await Blog.deleteMany({})
  await Blog.insertMany(helper.initialBlogs)

  await User.deleteMany({})
  const newUser = {
    username: 'testuser',
    name: 'Test User',
    password: 'secret123'
  }
  await api.post('/api/users').send(newUser)

  // Obtener token de login
  const loginResponse = await api
    .post('/api/login')
    .send({ username: 'testuser', password: 'secret123' })

  token = loginResponse.body.token
})

describe('GET /api/blogs', () => {
  test('returns blogs as json and correct amount', async () => {
    const response = await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)

    assert.strictEqual(response.body.length, helper.initialBlogs.length)
  })

  test('blogs have id property instead of _id', async () => {
    const response = await api.get('/api/blogs')

    response.body.forEach(blog => {
      assert(blog.id)
      assert.strictEqual(blog._id, undefined)
    })
  })
})

describe('POST /api/blogs', () => {
  test('a valid blog can be added with token', async () => {
    const newBlog = {
      title: 'Blog with token',
      author: 'Tester',
      url: 'http://example.com',
      likes: 5
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    const titles = blogsAtEnd.map(b => b.title)
    assert(titles.includes('Blog with token'))
  })

  test('fails with 401 if token is not provided', async () => {
    const newBlog = {
      title: 'No token blog',
      author: 'Hacker',
      url: 'http://hack.com',
      likes: 1
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(401)
  })

  test('if likes is missing, it defaults to 0', async () => {
    const newBlog = {
      title: 'Blog without likes',
      author: 'Sebas',
      url: 'http://nolikes.com'
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/blogs')
    const savedBlog = response.body.find(b => b.title === 'Blog without likes')
    assert.strictEqual(savedBlog.likes, 0)
  })
})

describe('POST /api/blogs validation', () => {
  test('fails with status 400 if title is missing', async () => {
    const newBlog = {
      author: 'Sebas',
      url: 'http://notitle.com',
      likes: 3
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(400)
  })

  test('fails with status 400 if url is missing', async () => {
    const newBlog = {
      title: 'Blog without url',
      author: 'Sebas',
      likes: 3
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(400)
  })
})

describe('deletion of a blog', () => {
  test('succeeds with status code 204 if id is valid and user is creator', async () => {
    // Crear blog nuevo con token
    const newBlog = { title: 'Blog to delete', author: 'Tester', url: 'http://del.com' }
    const added = await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)

    const blogToDelete = added.body

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(204)

    const blogsAtEnd = await helper.blogsInDb()
    const titles = blogsAtEnd.map(b => b.title)
    assert(!titles.includes(blogToDelete.title))
  })
})

describe('updating a blog', () => {
  test('succeeds in updating likes', async () => {
    const blogsAtStart = await Blog.find({})
    const blogToUpdate = blogsAtStart[0]

    const updatedBlog = {
      ...blogToUpdate.toJSON(),
      likes: blogToUpdate.likes + 1
    }

    const response = await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(updatedBlog)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    assert.strictEqual(response.body.likes, blogToUpdate.likes + 1)
  })
})

after(async () => {
  await mongoose.connection.close()
})
