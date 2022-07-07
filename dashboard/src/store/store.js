import { createStore, applyMiddleware, combineReducers } from 'redux'
import thunk from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension'

import { hotspotReducer } from './reducers/hotspotReducer'
import { groupReducer } from './reducers/groupReducer'
import { adminReducer } from './reducers/adminReducer'
import { deviceReducer } from './reducers/deviceReducer'

const reducer = combineReducers({
    hotspots: hotspotReducer,
    groups: groupReducer,
    admins: adminReducer,
    devices: deviceReducer,
})

const hotspotFromStorage = sessionStorage.getItem('hotspotList')
    ? JSON.parse(sessionStorage.getItem('hotspotList'))
    : []

const groupFromStorage = sessionStorage.getItem('groupList')
    ? JSON.parse(sessionStorage.getItem('groupList'))
    : []

const adminFromStorage = sessionStorage.getItem('adminList')
    ? JSON.parse(sessionStorage.getItem('adminList'))
    : []

const deviceFromStorage = sessionStorage.getItem('deviceList')
    ? JSON.parse(sessionStorage.getItem('deviceList'))
    : []

const initialState = {
    hotspots: { hotspotList: hotspotFromStorage },
    groups: { groupList: groupFromStorage },
    admins: { adminList: adminFromStorage },
    devices: { deviceList: deviceFromStorage },
}
const middleware = [thunk]

const store = createStore(
    reducer,
    initialState,
    composeWithDevTools(applyMiddleware(...middleware))
)

export default store
