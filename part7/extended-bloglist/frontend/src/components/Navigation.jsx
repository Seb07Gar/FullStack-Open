import { Navbar, Nav, Button } from 'react-bootstrap'
import { Link } from 'react-router-dom'

const Navigation = ({ user, handleLogout }) => {
  return (
    <Navbar
      expand="lg"
      className="mb-4"
      style={{ backgroundColor: '#020617' }}
      variant="dark"
    >
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="me-auto">
          <Nav.Link as={Link} to="/" style={{ color: '#e5e7eb' }}>
            blogs
          </Nav.Link>
          <Nav.Link as={Link} to="/users" style={{ color: '#e5e7eb' }}>
            users
          </Nav.Link>
        </Nav>

        <Nav>
          <Navbar.Text className="me-2">{user.name} logged in</Navbar.Text>
          <Button variant="outline-light" size="sm" onClick={handleLogout}>
            logout
          </Button>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  )
}

export default Navigation
