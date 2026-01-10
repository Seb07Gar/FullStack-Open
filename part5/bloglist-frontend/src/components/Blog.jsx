import { useState } from 'react'

const Blog = ({ blog, likeBlog, deleteBlog, user }) => {
  const [detailsVisible, setDetailsVisible] = useState(false)

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const showDeleteButton =
    blog.user && user && blog.user.username === user.username

  return (
    <div style={blogStyle} className="blog">
      <div className="blog-summary" data-testid="blog-title">
        {blog.title} {blog.author}
        <button onClick={() => setDetailsVisible(!detailsVisible)}>
          {detailsVisible ? 'hide' : 'view'}
        </button>
      </div>

      {detailsVisible && (
        <div className="blog-details">
          <div className="blog-url">{blog.url}</div>

          <div className="blog-likes">
            likes <span data-testid="likes-count">{blog.likes}</span>
            <button onClick={() => likeBlog(blog)}>like</button>
          </div>

          <div className="blog-user">added by {blog.user?.name}</div>

          {showDeleteButton && (
            <button onClick={() => deleteBlog(blog.id, blog.title)}>
              delete
            </button>
          )}
        </div>
      )}
    </div>
  )
}

export default Blog
