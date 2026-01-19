import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import usersService from '../services/users'
import { Table } from 'react-bootstrap'

const Users = () => {
  const [users, setUsers] = useState([])

  useEffect(() => {
    usersService.getAll().then(setUsers)
  }, [])

  return (
    <div>
      <h2>Users</h2>

      <Table striped bordered hover variant="dark">
        <thead>
          <tr>
            <th>User</th>
            <th>blogs created</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>
                <Link to={`/users/${user.id}`}>{user.name}</Link>
              </td>
              <td>{user.blogs.length}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  )
}

export default Users
