import { useState, useEffect, useRef} from 'react'
import blogService from './services/blogs'
import loginService from './services/login'
import Blog from './components/Blog'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import BlogForm from './components/Blogform'


const App = () => {
  const [blogs, setBlogs] = useState([])

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  const [notification, setNotification] = useState(null)

  const blogFormRef = useRef()

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

  const addBlog = async (blogObject) => {
  try {
    blogFormRef.current.toggleVisibility()

    const returnedBlog = await blogService.create(blogObject)
    setBlogs(blogs.concat(returnedBlog))

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

  const likeBlog = async (blog) => {
    const updatedBlog = {
      title: blog.title,
      author: blog.author,
      url: blog.url,
      likes: blog.likes + 1,
      user: blog.user?.id || blog.user || user.id
    }

    const returnedBlog = await blogService.update(blog.id, updatedBlog)

    setBlogs(blogs.map(b =>
      b.id !== blog.id ? b : returnedBlog
    ))
  }

  const blogsSortedByLikes = [...blogs].sort(
    (a, b) => b.likes - a.likes
  )

  const deleteBlog = async (id, title) => {
    const confirm = window.confirm(`Remove blog "${title}"?`)
    if (!confirm) return

    try {
      await blogService.remove(id)
      setBlogs(blogs.filter(b => b.id !== id))
    } catch (error) {
      console.error(error)
    }
  }


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

      <Togglable buttonLabel="create new blog" ref={blogFormRef}>
        <BlogForm createBlog={addBlog} />
      </Togglable>
     
      {blogsSortedByLikes.map(blog =>
          <Blog 
            key={blog.id} 
            blog={blog}
            user={user}
            likeBlog={likeBlog}
            deleteBlog={deleteBlog} 
          />
        )}  
    </div>
  )
}

export default App
