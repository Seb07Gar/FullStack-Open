import { useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useState } from 'react'
import blogService from '../services/blogs'
import { useDispatch } from 'react-redux'
import { updateBlog } from '../reducers/blogReducer'

const BlogView = ({ likeBlog, deleteBlog, user }) => {
  const { id } = useParams()
  const dispatch = useDispatch()
  const [comment, setComment] = useState('')

  const blog = useSelector((state) => state.blogs.find((b) => b.id === id))

  if (!blog) {
    return null
  }

  const showDeleteButton =
    blog.user && user && blog.user.username === user.username

  const handleCommentSubmit = async (event) => {
    event.preventDefault()

    const updatedBlog = await blogService.addComment(blog.id, comment)
    dispatch(updateBlog(updatedBlog))
    setComment('')
  }

  return (
    <div>
      <h2>
        {blog.title} {blog.author}
      </h2>

      <a href={blog.url}>{blog.url}</a>

      <div>
        likes {blog.likes}
        <button onClick={() => likeBlog(blog)}>like</button>
      </div>

      <div>added by {blog.user?.name}</div>

      {showDeleteButton && (
        <button onClick={() => deleteBlog(blog.id, blog.title)}>delete</button>
      )}
      <h3>comments</h3>
      <form onSubmit={handleCommentSubmit}>
        <input
          value={comment}
          onChange={({ target }) => setComment(target.value)}
        />
        <button type="submit">add comment</button>
      </form>

      <ul>
        {blog.comments?.map((comment, index) => (
          <li key={index}>{comment}</li>
        ))}
      </ul>
    </div>
  )
}

export default BlogView
