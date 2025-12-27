const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')

test('dummy returns one', () => {
  const blogs = []

  const result = listHelper.dummy(blogs)
  assert.strictEqual(result, 1)
  
})

describe('total likes', () => {
  const listWithOneBlog = [
    {
      _id: '5a422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
      likes: 5,
      __v: 0
    }
  ]

  const listWithMultipleBlogs = [
    ...listWithOneBlog,
    {
      _id: '5a422b3a1b54a676234d17f9',
      title: 'React patterns',
      author: 'Michael Chan',
      url: 'https://reactpatterns.com/',
      likes: 7,
      __v: 0
    },
    {
      _id: '5a422b891b54a676234d17fa',
      title: 'Go To Statement Considered Harmful 2',
      author: 'Edsger W. Dijkstra',
      url: 'https://example.com',
      likes: 12,
      __v: 0
    }
  ]

  test('when list has only one blog, equals the likes of that', () => {
    const result = listHelper.totalLikes(listWithOneBlog)
    assert.strictEqual(result, 5)
  })

  test('when list has multiple blogs, equals the sum of likes', () => {
    const result = listHelper.totalLikes(listWithMultipleBlogs)
    assert.strictEqual(result, 24) // 5 + 7 + 12
  })

  test('of empty list is zero', () => {
    const result = listHelper.totalLikes([])
    assert.strictEqual(result, 0)
  })
})

describe('favorite blog', () => {
  const listWithOneBlog = [
    {
      _id: '1',
      title: 'Single Blog',
      author: 'Author One',
      url: 'http://example.com',
      likes: 5
    }
  ]

  const listWithMultipleBlogs = [
    ...listWithOneBlog,
    {
      _id: '2',
      title: 'Second Blog',
      author: 'Author Two',
      url: 'http://example2.com',
      likes: 12
    },
    {
      _id: '3',
      title: 'Third Blog',
      author: 'Author Three',
      url: 'http://example3.com',
      likes: 7
    }
  ]

  test('of empty list is null', () => {
    const result = listHelper.favoriteBlog([])
    assert.strictEqual(result, null)
  })

  test('when list has only one blog, equals that blog', () => {
    const result = listHelper.favoriteBlog(listWithOneBlog)
    assert.deepStrictEqual(result, listWithOneBlog[0])
  })

  test('when list has multiple blogs, returns the one with most likes', () => {
    const result = listHelper.favoriteBlog(listWithMultipleBlogs)
    assert.deepStrictEqual(result, listWithMultipleBlogs[1]) // 12 likes
  })
})

describe('most blogs', () => {
  const listWithOneBlog = [
    { title: 'Single Blog', author: 'Author One', likes: 5 }
  ]

  const listWithMultipleBlogs = [
    ...listWithOneBlog,
    { title: 'Second Blog', author: 'Author Two', likes: 12 },
    { title: 'Third Blog', author: 'Author One', likes: 7 },
    { title: 'Fourth Blog', author: 'Author Three', likes: 10 },
    { title: 'Fifth Blog', author: 'Author One', likes: 3 }
  ]

  test('of empty list is null', () => {
    const result = listHelper.mostBlogs([])
    assert.strictEqual(result, null)
  })

  test('when list has only one blog, equals that author', () => {
    const result = listHelper.mostBlogs(listWithOneBlog)
    assert.deepStrictEqual(result, { author: 'Author One', blogs: 1 })
  })

  test('when list has multiple blogs, returns the author with most blogs', () => {
    const result = listHelper.mostBlogs(listWithMultipleBlogs)
    assert.deepStrictEqual(result, { author: 'Author One', blogs: 3 })
  })
})

describe('most likes', () => {
  const listWithOneBlog = [
    { title: 'Single Blog', author: 'Author One', likes: 5 }
  ]

  const listWithMultipleBlogs = [
    ...listWithOneBlog,
    { title: 'Second Blog', author: 'Author Two', likes: 12 },
    { title: 'Third Blog', author: 'Author One', likes: 7 },
    { title: 'Fourth Blog', author: 'Author Three', likes: 10 },
    { title: 'Fifth Blog', author: 'Author One', likes: 3 }
  ]

  test('of empty list is null', () => {
    const result = listHelper.mostLikes([])
    assert.strictEqual(result, null)
  })

  test('when list has only one blog, equals that author and likes', () => {
    const result = listHelper.mostLikes(listWithOneBlog)
    assert.deepStrictEqual(result, { author: 'Author One', likes: 5 })
  })

  test('when list has multiple blogs, returns the author with most likes', () => {
    const result = listHelper.mostLikes(listWithMultipleBlogs)
    assert.deepStrictEqual(result, { author: 'Author One', likes: 15 }) // 5+7+3
  })
})