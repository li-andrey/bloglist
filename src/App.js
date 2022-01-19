import React, { useState, useEffect } from 'react'
import Blog from './components/Blog'
import BlogForm from './components/BlogForm'
import LoginForm from './components/LoginForm'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import blogService from './services/blogs'
import loginService from './services/login'
import { setSuccessMessage, setErrorMessage } from './reducers/notificationReducer'
import { useDispatch, useSelector } from 'react-redux'
import initializeBlogs from '../src/reducers/blogReducer'

const App = () => {
  const dispatch = useDispatch()
  /*   useEffect(() => {
      dispatch(initializeBlogs())
    }, [dispatch])
   */
  const store = useSelector(state => state)
  console.log('state', store)

  const [allBlogs, setAllBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setAllBlogs(blogs)
    )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({ username, password, })
      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      dispatch(setErrorMessage('Can not login'))
      setTimeout(() => {
        dispatch(setErrorMessage(null))
      }, 5000)
    }
  }

  const handleLogout = async (event) => {
    event.preventDefault()
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
  }

  const createBlog = async (BlogToAdd) => {
    try {
      const createdBlog = await blogService.create(BlogToAdd)
      dispatch(setSuccessMessage(`Blog ${BlogToAdd.title} was successfully added`))
      setAllBlogs(allBlogs.concat(createdBlog))
      setTimeout(() => { dispatch(setSuccessMessage(null)) }, 5000)
    } catch (exception) {
      dispatch(setErrorMessage(`Cannot add blog ${BlogToAdd.title}`))
      setTimeout(() => { dispatch(setErrorMessage(null)) }, 5000)
    }
  }

  const updateBlog = async (BlogToUpdate) => {
    try {
      const updatedBlog = await blogService.update(BlogToUpdate)
      dispatch(setSuccessMessage(`Blog ${BlogToUpdate.title} was successfully updated`))
      setAllBlogs(allBlogs.map(blog => blog.id !== BlogToUpdate.id ? blog : updatedBlog))
      setTimeout(() => { dispatch(setSuccessMessage(null)) }, 5000)
    } catch (exception) {
      dispatch(setErrorMessage(`Cannot update blog ${BlogToUpdate.title}`))
      setTimeout(() => { dispatch(setErrorMessage(null)) }, 5000)
    }
  }

  const deleteBlog = async (BlogToDelete) => {
    try {
      if (window.confirm(`Delete ${BlogToDelete.title} ?`)) {
        await blogService.remove(BlogToDelete.id)
        dispatch(setSuccessMessage(`Blog ${BlogToDelete.title} was successfully deleted`))
        setAllBlogs(allBlogs.filter(blog => blog.id !== BlogToDelete.id))
        setTimeout(() => { dispatch(setSuccessMessage(null)) }, 5000)
      }
    } catch (exception) {
      dispatch(setErrorMessage(`Cannot delete blog ${BlogToDelete.title}`))
      setTimeout(() => { dispatch(setErrorMessage(null)) }, 5000)
    }
  }

  const byLikes = (a, b) => b.likes - a.likes


  //   return (
  //     <div>
  //       <h1>Blogs</h1>
  //       {user === null ?
  //         loginForm() :
  //         <div>
  //           <p>{user.name} logged in</p>
  //           {
  //             blogs.map(blog =>
  //               <Blog key={blog.id} blog={blog} />)
  //           }
  //         </div>
  //       }
  //     </div>
  //   )
  // }

  if (user === null) {
    return (
      <div>
        <h2>Log in to application</h2>
        <Notification />
        <LoginForm
          handleLogin={handleLogin}
          username={username}
          setUsername={setUsername}
          password={password}
          setPassword={setPassword}
        />
      </div>
    )
  }
  return (
    <div>
      <Notification />
      <h2>blogs</h2>
      <p>{user.name} logged in <button onClick={handleLogout} type="submit">Logout</button></p>
      <Togglable buttonLabel='create new blog'>
        <BlogForm createBlog={createBlog} />
      </Togglable>
      {
        allBlogs.sort(byLikes).map(blog =>
          <Blog key={blog.id} blog={blog} updateBlog={updateBlog} deleteBlog={deleteBlog} />)
      }
    </div >
  )
}

export default App