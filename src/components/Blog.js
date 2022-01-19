import React, { useState } from 'react'

const Blog = (props) => {
  const blog = props.blog
  const [visible, setVisible] = useState(false)
  const [blogObject, setBlogObject] = useState(blog)
  const showWhenVisible = { display: visible ? '' : 'none' }

  const toggleVisibility = () => {
    setVisible(!visible)
  }
  const buttonLabel = visible ? 'hide' : 'view'

  const increaseLikes = () => {
    const updatedBlog = ({
      ...blog,
      likes: blog.likes + 1,
      user: blog.user.id
    })
    console.log(updatedBlog)
    props.updateBlog(updatedBlog)
    setBlogObject(updatedBlog)
  }

  const removeBlog = () => props.deleteBlog(blog)

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  return (
    <div style={blogStyle} className="blog">
      < div >
        {blog.title} {blog.author} <button onClick={toggleVisibility}>{buttonLabel}</button>
      </div >
      <div style={showWhenVisible}>
        <p>{blog.url}</p>
        <p>{blogObject.likes} <button onClick={increaseLikes}>like</button> </p>
        <button onClick={removeBlog}>Delete</button>
      </div>
    </div>
  )
}

export default Blog
