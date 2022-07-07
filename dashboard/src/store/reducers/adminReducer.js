import * as types from '../constants'

export const adminReducer = (state = { adminList: [] }, action) => {
    switch (action.type) {
        case types.GET_ADMIN_SUCCESS:
            return {
                adminList: action.payload,
            }
        case types.GET_ADMIN_FAIL:
            return {
                error: action.payload,
                adminList: [],
            }

        case types.CREATE_ADMIN_SUCCESS: {
            const item = action.payload
            const existadmin = state.adminList.find((x) => x._id === item._id)

            if (existadmin) {
                return {
                    ...state,
                    adminList: state.adminList.map((x) =>
                        x._id === existadmin._id ? item : x
                    ),
                    success: 'Admin created succssfully',
                }
            }
            return {
                ...state,
                adminList: [...state.adminList, item],
                success: 'Admin created succssfully',
            }
        }
        case types.CREATE_ADMIN_FAIL:
            return {
                adminList: [...state.adminList],
                error: action.payload,
            }

        case types.UPDATE_ADMIN_SUCCESS: {
            const item = action.payload
            const existadmin = state.adminList.find((x) => x._id === item._id)

            if (existadmin) {
                return {
                    ...state,
                    adminList: state.adminList.map((x) =>
                        x._id === existadmin._id ? item : x
                    ),
                    success: 'Admin updated succssfully',
                }
            }
            return {
                ...state,
                adminList: [...state.adminList, item],
                success: 'Admin updated succssfully',
            }
        }
        case types.UPDATE_ADMIN_FAIL:
            return {
                adminList: [...state.adminList],
                error: action.payload,
            }

        case types.DELETE_ADMIN_SUCCESS:
            return {
                ...state,
                adminList: state.adminList.filter(
                    (x) => x._id !== action.payload
                ),
                success: 'Admin deleted successfully',
            }
        case types.DELETE_ADMIN_FAIL:
            return {
                error: action.payload,
                hotspotList: [...state.adminList],
            }

        default:
            return state
    }
}
