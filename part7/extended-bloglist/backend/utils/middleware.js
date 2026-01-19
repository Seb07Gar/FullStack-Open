const logger = require('./logger')
const jwt = require('jsonwebtoken')
const User = require('../models/user')

const tokenExtractor = (request, response, next) => {
  const authorization = request.get('authorization')

  if (authorization && authorization.startsWith('Bearer ')) {
    request.token = authorization.replace('Bearer ', '')
  } else {
    request.token = null
  }

  next()
}

const userExtractor = async (request, response, next) => {
  if (!request.token) {
    return response.status(401).json({
      error: 'token missing or invalid'
    })
  }

  const decodedToken = jwt.verify(request.token, process.env.JWT_SECRET)

  if (!decodedToken.id) {
    return response.status(401).json({
      error: 'token missing or invalid'
    })
  }

  const user = await User.findById(decodedToken.id)
  console.log('Middleware userExtractor -> user:', user.username)
  request.user = user

  next()
}

const requestLogger = (req, res, next) => {
  logger.info('Method:', req.method)
  logger.info('Path:  ', req.path)
  logger.info('Body:  ', req.body)
  logger.info('---')
  next()
}

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, req, res, next) => {
  logger.error(error.message)
  if (error.name === 'CastError') return res.status(400).send({ error: 'malformatted id' })

  if (error.name === 'ValidationError') {
    return res.status(400).json({ error: error.message })
  }

  if (error.name === 'MongoServerError' && error.code === 11000) {
    return res.status(400).json({
      error: 'expected `username` to be unique'
    })
  }
  if (error.name === 'JsonWebTokenError') {
  return res.status(401).json({
    error: 'token missing or invalid'
  })
  }

  if (error.name === 'TokenExpiredError') {
    return res.status(401).json({
      error: 'token expired'
    })
  }
  next(error)
}

module.exports = { tokenExtractor, userExtractor, requestLogger, unknownEndpoint, errorHandler }
