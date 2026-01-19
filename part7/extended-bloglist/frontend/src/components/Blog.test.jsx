import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

test('renders title and author but not url or likes by default', () => {
  const blog = {
    title: 'Testing React components',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7,
    user: {
      name: 'Matti Luukkainen',
      username: 'mluukkai'
    }
  }

  render(<Blog blog={blog} />)

  
  expect(
    screen.getByText('Testing React components Michael Chan')
  ).toBeInTheDocument()

  
  expect(screen.queryByText('https://reactpatterns.com/')).toBeNull()
  expect(screen.queryByText(/likes/)).toBeNull()
})

test('shows url and likes when view button is clicked', async () => {
  const blog = {
    title: 'Testing React',
    author: 'Sebastian',
    url: 'http://test.com',
    likes: 5,
    user: {
      username: 'seba',
      name: 'Sebastian'
    }
  }

  const user = { username: 'seba' }

  render(
    <Blog
      blog={blog}
      user={user}
      likeBlog={() => {}}
      deleteBlog={() => {}}
    />
  )

  const viewButton = screen.getByText('view')
  await userEvent.click(viewButton)

  expect(screen.getByText('http://test.com')).toBeDefined()
  expect(screen.getByText(/likes 5/i)).toBeDefined()
})

test('shows url and likes when view button is clicked', async () => {
  const blog = {
    title: 'Testing React',
    author: 'Sebastian',
    url: 'http://test.com',
    likes: 5,
    user: {
      username: 'seba',
      name: 'Sebastian'
    }
  }

  const user = { username: 'seba' }

  render(
    <Blog
      blog={blog}
      user={user}
      likeBlog={() => {}}
      deleteBlog={() => {}}
    />
  )

  const viewButton = screen.getByText('view')
  await userEvent.click(viewButton)

  expect(screen.getByText('http://test.com')).toBeDefined()
  expect(screen.getByText(/likes 5/i)).toBeDefined()
})


