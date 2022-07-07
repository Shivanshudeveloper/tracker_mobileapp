import * as types from '../constants'

export const hotspotReducer = (state = { hotspotList: [] }, action) => {
    switch (action.type) {
        case types.GET_HOTSPOT_SUCCESS:
            return {
                hotspotList: action.payload,
            }
        case types.GET_HOTSPOT_FAIL:
            return {
                error: action.payload,
                hotspotList: [],
            }

        case types.CREATE_HOTSPOT_SUCCESS: {
            const item = action.payload
            console.log(item)
            const exitHotspot = state.hotspotList.find(
                (x) => x._id === item._id
            )

            if (exitHotspot) {
                return {
                    ...state,
                    hotspotList: state.hotspotList.map((x) =>
                        x._id === exitHotspot._id ? item : x
                    ),
                    success: 'Hotspot created succssfully',
                }
            }
            return {
                ...state,
                hotspotList: [...state.hotspotList, item],
                success: 'Hotspot created succssfully',
            }
        }
        case types.CREATE_HOTSPOT_FAIL:
            return {
                hotspotList: [...state.hotspotList],
                error: action.payload,
            }

        case types.UPDATE_HOTSPOT_SUCCESS: {
            const item = action.payload
            console.log(item)
            const exitHotspot = state.hotspotList.find(
                (x) => x._id === item._id
            )

            if (exitHotspot) {
                return {
                    ...state,
                    hotspotList: state.hotspotList.map((x) =>
                        x._id === exitHotspot._id ? item : x
                    ),
                    success: 'Hotspot updated succssfully',
                }
            }
            return {
                ...state,
                hotspotList: [...state.hotspotList, item],
                success: 'Hotspot updated succssfully',
            }
        }

        case types.UPDATE_HOTSPOT_FAIL:
            return {
                hotspotList: [...state.hotspotList],
                error: action.payload,
            }

        case types.DELETE_HOTSPOT_SUCCESS:
            return {
                ...state,
                hotspotList: state.hotspotList.filter(
                    (x) => x._id !== action.payload
                ),
                success: 'Hotspot deleted succssfully',
            }
        case types.DELETE_HOTSPOT_FAIL:
            return {
                error: action.payload,
                hotspotList: [...state.hotspotList],
            }

        default:
            return state
    }
}
