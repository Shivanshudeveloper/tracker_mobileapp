import { createStore, applyMiddleware, combineReducers } from 'redux'
import thunk from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension'

import { UserFormReducer } from './reducers/UserFormReducer'

const reducer = combineReducers({
  forms: UserFormReducer,
})

const gettingFormsFromStorage = sessionStorage.getItem('userForms')
  ? JSON.parse(sessionStorage.getItem('userForms'))
  : []

const initialState = {
  forms: { userForms: gettingFormsFromStorage },
}
const middleware = [thunk]

const store = createStore(
  reducer,
  initialState,
  composeWithDevTools(applyMiddleware(...middleware))
)

export default store
