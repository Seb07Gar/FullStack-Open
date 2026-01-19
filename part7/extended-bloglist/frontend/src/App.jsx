import { useState, useEffect, useRef } from 'react'
import blogService from './services/blogs'
import loginService from './services/login'
import Blog from './components/Blog'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import BlogForm from './components/Blogform'
import { useDispatch, useSelector } from 'react-redux'
import {
  setNotification,
  clearNotification,
} from './reducers/notificationReducer'
import {
  initializeBlogs,
  createBlog,
  likeBlog,
  deleteBlog,
} from './reducers/blogReducer'
import { setUser, clearUser } from './reducers/userReducer'
import { Routes, Route, Link } from 'react-router-dom'
import Users from './components/Users'
import User from './components/User'
import BlogView from './components/BlogView'
import Navigation from './components/Navigation'
import { Form, Button } from 'react-bootstrap'

const App = () => {
  const dispatch = useDispatch()

  const blogs = useSelector((state) => state.blogs)
  const user = useSelector((state) => state.user)

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const blogFormRef = useRef()

  useEffect(() => {
    dispatch(initializeBlogs())
  }, [dispatch])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      dispatch(setUser(user))
      blogService.setToken(user.token)
    }
  }, [dispatch])

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({ username, password })
      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))

      blogService.setToken(user.token)
      dispatch(setUser(user))
      setUsername('')
      setPassword('')
    } catch (error) {
      console.log(error)

      dispatch(setNotification('wrong username or password'))
      setTimeout(() => {
        dispatch(clearNotification())
      }, 5000)
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    dispatch(clearUser())
  }

  const addBlog = async (blogObject) => {
    try {
      blogFormRef.current.toggleVisibility()

      dispatch(createBlog(blogObject))

      dispatch(
        setNotification(
          `a new blog ${blogObject.title} by ${blogObject.author} added`
        )
      )

      setTimeout(() => {
        dispatch(clearNotification())
      }, 5000)
    } catch (error) {
      console.log(error)
      dispatch(setNotification('error creating blog'))
      setTimeout(() => {
        dispatch(clearNotification())
      }, 5000)
    }
  }

  const loginForm = () => (
    <Form onSubmit={handleLogin} style={{ color: '#e5e7eb' }}>
      <Form.Group className="mb-3">
        <Form.Label>username</Form.Label>
        <Form.Control
          value={username}
          onChange={({ target }) => setUsername(target.value)}
          style={{
            backgroundColor: '#1e293b', // slate-800
            color: '#e5e7eb',
            border: '1px solid #334155',
          }}
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>password</Form.Label>
        <Form.Control
          type="password"
          value={password}
          onChange={({ target }) => setPassword(target.value)}
          style={{
            backgroundColor: '#1e293b',
            color: '#e5e7eb',
            border: '1px solid #334155',
          }}
        />
      </Form.Group>

      <Button variant="outline-info" type="submit">
        login
      </Button>
    </Form>
  )

  const handleLike = (blog) => {
    dispatch(likeBlog(blog))
  }

  const handleDelete = (id, title) => {
    const confirm = window.confirm(`remove blog "${title}"?`)
    if (!confirm) return

    dispatch(deleteBlog(id))
  }

  const blogsSortedByLikes = [...blogs].sort((a, b) => b.likes - a.likes)

  if (user === null) {
    return (
      <div
        style={{
          minHeight: '100vh',
          backgroundColor: '#0f172a',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column',
          padding: '2rem',
          color: '#e5e7eb',
        }}
      >
        <h2>Log in to application</h2>

        <Notification />

        <div className="mt-3">{loginForm()}</div>
      </div>
    )
  }

  return (
    <div
      style={{
        backgroundColor: '#0f172a',
        minHeight: '100vh',
        color: '#e5e7eb',
        paddingBottom: '2rem',
      }}
    >
      <Navigation user={user} handleLogout={handleLogout} />

      <h2>extended blog app</h2>

      <Notification />

      <Routes>
        <Route path="/users/:id" element={<User />} />
        <Route path="/users" element={<Users />} />

        <Route
          path="/blogs/:id"
          element={
            <BlogView
              likeBlog={handleLike}
              deleteBlog={handleDelete}
              user={user}
            />
          }
        />

        <Route
          path="/"
          element={
            <>
              <Togglable buttonLabel="create new blog" ref={blogFormRef}>
                <BlogForm createBlog={addBlog} />
              </Togglable>

              {blogsSortedByLikes.map((blog) => (
                <Blog key={blog.id} blog={blog} />
              ))}
            </>
          }
        />
      </Routes>
    </div>
  )
}

export default App
