import { createStore, combineReducers, applyMiddleware } from 'redux'
import notificationReducer from '../src/reducers/notificationReducer'
import blogReducer from '../src/reducers/blogReducer'
import { composeWithDevTools } from 'redux-devtools-extension'
import thunk from 'redux-thunk'


const reducer = combineReducers({
  blogs: blogReducer,
  notifications: notificationReducer
})

const store = createStore(reducer, composeWithDevTools(applyMiddleware(thunk)))


export default store