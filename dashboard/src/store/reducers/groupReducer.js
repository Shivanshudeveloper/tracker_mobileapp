import * as types from '../constants'

export const groupReducer = (state = { groupList: [] }, action) => {
    switch (action.type) {
        case types.GET_GROUP_SUCCESS:
            return {
                groupList: action.payload,
            }
        case types.GET_GROUP_FAIL:
            return {
                error: action.payload,
                groupList: [],
            }

        case types.CREATE_GROUP_SUCCESS: {
            const item = action.payload
            const existgroup = state.groupList.find((x) => x._id === item._id)

            if (existgroup) {
                return {
                    ...state,
                    groupList: state.groupList.map((x) =>
                        x._id === existgroup._id ? item : x
                    ),
                    success: 'Group created succssfully',
                }
            }
            return {
                ...state,
                groupList: [...state.groupList, item],
                success: 'Group created succssfully',
            }
        }
        case types.CREATE_GROUP_FAIL:
            return {
                groupList: [...state.groupList],
                error: action.payload,
            }

        case types.UPDATE_GROUP_SUCCESS: {
            const item = action.payload
            const existgroup = state.groupList.find((x) => x._id === item._id)

            if (existgroup) {
                return {
                    ...state,
                    groupList: state.groupList.map((x) =>
                        x._id === existgroup._id ? item : x
                    ),
                    success: 'Group updated succssfully',
                }
            }
            return {
                ...state,
                groupList: [...state.groupList, item],
                success: 'Group updated succssfully',
            }
        }
        case types.UPDATE_GROUP_FAIL:
            return {
                groupList: [...state.groupList],
                error: action.payload,
            }

        case types.DELETE_GROUP_SUCCESS:
            return {
                ...state,
                groupList: state.groupList.filter(
                    (x) => x._id !== action.payload
                ),
                success: 'Group deleted succssfully',
            }
        case types.DELETE_GROUP_FAIL:
            return {
                error: action.payload,
                groupList: [...state.groupList],
            }

        default:
            return state
    }
}
