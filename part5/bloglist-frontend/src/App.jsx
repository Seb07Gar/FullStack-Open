import { useState, useEffect } from 'react'
import blogService from './services/blogs'
import loginService from './services/login'
import Blog from './components/Blog'
import Notification from './components/Notification'

const App = () => {
  const [blogs, setBlogs] = useState([])

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  const [newTitle, setNewTitle] = useState('')
  const [newAuthor, setNewAuthor] = useState('')
  const [newUrl, setNewUrl] = useState('')

  const [notification, setNotification] = useState(null)

  useEffect(() => {
    blogService.getAll().then(blogs => {
      setBlogs(blogs)
    })
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({ username, password })
      window.localStorage.setItem(
      'loggedBlogappUser',
      JSON.stringify(user)
      )

      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')

    }catch (error) {

      console.log(error)

      setNotification('wrong username or password')
      setTimeout(() => {
        setNotification(null)
      }, 5000);

    }
    
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
  }

  const addBlog = async (event) => {
    event.preventDefault()

    try {
      const newBlog = {
        title: newTitle,
        author: newAuthor,
        url: newUrl,
      }

      const returnedBlog = await blogService.create(newBlog)
      setBlogs(blogs.concat(returnedBlog))

      setNewTitle('')
      setNewAuthor('')
      setNewUrl('')

      setNotification(`a new blog ${returnedBlog.title} by ${returnedBlog.author} added`)
      setTimeout(() => {
        setNotification(null)
      }, 5000)
    } catch (error) {
      console.log(error)
      setNotification('error creating blog')
      setTimeout(() => {
        setNotification(null)
      }, 5000)
    }
}


  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <div>
        username
        <input
          value={username}
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        password
        <input
          type="password"
          value={password}
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button type="submit">login</button>
    </form>
  )

  const blogForm = () => (
    <form onSubmit={addBlog}>
      <div>
        title
        <input value={newTitle} onChange={({ target }) => setNewTitle(target.value)} />
      </div>
      <div>
        author
        <input value={newAuthor} onChange={({ target }) => setNewAuthor(target.value)} />
      </div>
      <div>
        url
        <input value={newUrl} onChange={({ target }) => setNewUrl(target.value)} />
      </div>
      <button type="submit">create</button>
    </form>
  )

  if (user === null) {
    return (
      <div>
        <h2>Log in to application</h2>

        <Notification message={notification} />

        {loginForm()}
      </div>
    )
  }

  return (
    <div>
      <h2>blogs</h2>

      <Notification message={notification} />

      <p>
        {user.name} logged in
        <button onClick={handleLogout}>logout</button>
      </p>

      {blogForm()}

      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
    </div>
  )
}

export default App
