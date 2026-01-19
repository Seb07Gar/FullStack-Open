import { Link } from 'react-router-dom'

const Navigation = ({ user, handleLogout }) => {
  const style = {
    padding: 10,
    background: '#eee',
    marginBottom: 20,
  }

  const linkStyle = {
    marginRight: 10,
  }

  return (
    <div style={style}>
      <Link to="/" style={linkStyle}>
        blogs
      </Link>

      <Link to="/users" style={linkStyle}>
        users
      </Link>

      <span>
        {user.name} logged in
        <button onClick={handleLogout} style={{ marginLeft: 10 }}>
          logout
        </button>
      </span>
    </div>
  )
}

export default Navigation
