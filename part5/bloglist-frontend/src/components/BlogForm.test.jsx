import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlogForm from './BlogForm'

test('calls createBlog with correct details', async () => {
  const createBlog = vi.fn()
  const user = userEvent.setup()

  render(<BlogForm createBlog={createBlog} />)

  const inputs = screen.getAllByRole('textbox')
  const submitButton = screen.getByText('create')

  await user.type(inputs[0], 'New Blog')
  await user.type(inputs[1], 'Sebastian')
  await user.type(inputs[2], 'http://newblog.com')

  await user.click(submitButton)

  expect(createBlog).toHaveBeenCalledTimes(1)
  expect(createBlog.mock.calls[0][0]).toEqual({
    title: 'New Blog',
    author: 'Sebastian',
    url: 'http://newblog.com'
  })
})
