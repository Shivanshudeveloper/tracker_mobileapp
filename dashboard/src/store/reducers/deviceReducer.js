import * as types from '../constants'

export const deviceReducer = (state = { deviceList: [] }, action) => {
    switch (action.type) {
        case types.GET_DEVICE_SUCCESS:
            return {
                deviceList: action.payload,
            }
        case types.GET_DEVICE_FAIL:
            return {
                error: action.payload,
                deviceList: [],
            }

        case types.CREATE_DEVICE_SUCCESS: {
            const item = action.payload
            const existdevice = state.deviceList.find((x) => x._id === item._id)

            if (existdevice) {
                return {
                    ...state,
                    deviceList: state.deviceList.map((x) =>
                        x._id === existdevice._id ? item : x
                    ),
                    success: 'Device added succssfully',
                }
            }
            return {
                ...state,
                deviceList: [...state.deviceList, item],
                success: 'Device added succssfully',
            }
        }

        case types.CREATE_DEVICE_FAIL:
            return {
                deviceList: [...state.deviceList],
                error: action.payload,
            }

        case types.UPDATE_DEVICE_SUCCESS: {
            const item = action.payload
            console.log(item)
            const existDevice = state.deviceList.find((x) => x._id === item._id)

            if (existDevice) {
                return {
                    ...state,
                    deviceList: state.deviceList.map((x) =>
                        x._id === existDevice._id ? item : x
                    ),
                    success: 'Device updated succssfully',
                }
            }
            return {
                ...state,
                deviceList: [...state.deviceList, item],
                success: 'Device updated succssfully',
            }
        }

        case types.UPDATE_DEVICE_FAIL:
            return {
                deviceList: [...state.deviceList],
                error: action.payload,
            }

        case types.DELETE_DEVICE_SUCCESS:
            return {
                ...state,
                deviceList: state.deviceList.filter(
                    (x) => x._id !== action.payload
                ),
                success: 'Device deleted succssfully',
            }
        case types.DELETE_DEVICE_FAIL:
            return {
                error: action.payload,
                deviceList: [...state.deviceList],
            }

        default:
            return state
    }
}
