const { test, describe, beforeEach, after } = require('node:test')
const assert = require('node:assert')
const supertest = require('supertest')
const mongoose = require('mongoose')

const app = require('../app')
const User = require('../models/user')

const api = supertest(app)

beforeEach(async () => {
  await User.deleteMany({})

  const user = new User({
    username: 'root',
    name: 'Superuser',
    passwordHash: 'hashedpassword'
  })

  await user.save()
})

describe('user creation', () => {

  test('fails if username is missing', async () => {
    const newUser = {
      name: 'NoUsername',
      password: 'secret'
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)

    assert(result.body.error)
  })

  test('fails if password is too short', async () => {
    const newUser = {
      username: 'shortpwd',
      name: 'Test',
      password: '12'
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)

    assert(result.body.error)
  })

  test('fails if username is not unique', async () => {
    const newUser = {
      username: 'root',
      name: 'Duplicate',
      password: 'secret'
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)

    assert(result.body.error.includes('unique'))
  })
})

after(async () => {
  await mongoose.connection.close()
})
