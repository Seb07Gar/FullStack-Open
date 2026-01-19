import { useParams } from 'react-router-dom'
import usersService from '../services/users'
import { useEffect, useState } from 'react'

const User = () => {
  const [user, setUser] = useState(null)
  const { id } = useParams()

  useEffect(() => {
    usersService.getAll().then((users) => {
      const foundUser = users.find((u) => u.id === id)
      setUser(foundUser)
    })
  }, [id])

  if (!user) {
    return null
  }

  return (
    <div>
      <h2>{user.name}</h2>

      <h3>added blogs</h3>
      <ul>
        {user.blogs.map((blog) => (
          <li key={blog.id}>{blog.title}</li>
        ))}
      </ul>
    </div>
  )
}

export default User
