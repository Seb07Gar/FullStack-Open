const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (req, res) => {
  const blogs = await Blog.find({})
  res.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
  const { title, url, likes } = request.body

  
  if (!title || !url) {
    return response.status(400).json({
      error: 'title and url are required'
    })
  }

  const blog = new Blog({
    title,
    url,
    likes: likes || 0,
    author: request.body.author
  })

  const savedBlog = await blog.save()
  response.status(201).json(savedBlog)
})

blogsRouter.delete('/:id', async (request, response) => {
  await Blog.findByIdAndDelete(request.params.id)
  response.status(204).end()
})

blogsRouter.put('/:id', async (request, response) => {
  const { title, author, url, likes } = request.body

  const updatedBlog = {
    title,
    author,
    url,
    likes
  }

  const result = await Blog.findByIdAndUpdate(
    request.params.id,
    updatedBlog,
    { new: true }
  )

  response.json(result)
})



module.exports = blogsRouter