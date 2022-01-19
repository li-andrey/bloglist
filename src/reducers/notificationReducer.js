const initialState = {
  successMessage: null,
  errorMessage: null
}
const notificationReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_SUCCESS_MESSAGE':
      return { ...state, successMessage: action.successMessage }
    case 'SET_ERROR_MESSAGE':
      return { ...state, errorMessage: action.errorMessage }
    default:
      return state
  }
}

export const setSuccessMessage = (successMessage) => {
  return async dispatch => {
    dispatch({
      type: 'SET_SUCCESS_MESSAGE',
      successMessage
    })
  }
}

export const setErrorMessage = (errorMessage) => {
  return async dispatch => {
    dispatch({
      type: 'SET_ERROR_MESSAGE',
      errorMessage
    })
  }
}

export default notificationReducer