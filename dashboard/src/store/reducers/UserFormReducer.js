import * as types from '../constants'

export const UserFormReducer = (state = { userForms: [] }, action) => {
  switch (action.type) {
    case types.ADD_FORM_SUCCESS: {
      const item = action.payload
      return {
        ...state,
        userForms: [...state.userForms, item],
        error: null,
        success: 'Form added succssfully',
      }
    }
    case types.ADD_FORM_FAIL:
      return {
        loading: false,
        error: action.payload,
        userForms: [...state.userForms],
      }

    // get content cases
    case types.GET_FORM_SUCCESS:
      return { loading: false, userForms: action.payload, error: null }
    case types.GET_FORM_FAIL:
      return { loading: false, error: action.payload }

    // delete content cases
    case types.DELETE_FORM_SUCCESS:
      return {
        ...state,
        userForms: state.userForms.filter((x) => x._id !== action.payload),
        error: null,
        success: 'Form deleted succssfully',
      }
    case types.DELETE_FORM_FAIL:
      return { loading: false, error: action.payload }
    default:
      return state
  }
}
