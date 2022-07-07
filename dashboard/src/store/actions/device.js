import * as types from '../constants'
import axios from 'axios'
import { API_SERVICE } from '../../URI'

const createDevice = (bodyData) => async (dispatch, getState) => {
    try {
        const config = {
            headers: {
                'Content-Type': 'application/json',
            },
        }

        const body = {
            body: bodyData,
        }

        const { data } = await axios.post(
            `${API_SERVICE}/create/device`,
            body,
            config
        )

        dispatch({
            type: types.CREATE_DEVICE_SUCCESS,
            payload: data,
        })

        sessionStorage.setItem(
            'deviceList',
            JSON.stringify(getState().devices.deviceList)
        )
    } catch (error) {
        dispatch({
            type: types.CREATE_DEVICE_FAIL,
            payload: error.message,
        })
    }
}

const getDevices = (createdBy) => async (dispatch) => {
    try {
        const { data } = await axios.get(
            `${API_SERVICE}/get/devices/${createdBy}`
        )
        dispatch({
            type: types.GET_DEVICE_SUCCESS,
            payload: data,
        })
    } catch (error) {
        dispatch({
            type: types.GET_DEVICE_FAIL,
            payload: error.message,
        })
    }
}

const getAdminDevices = (body) => async (dispatch) => {
    try {
        const config = {
            headers: {
                'Content-Type': 'application/json',
            },
        }
        const { data } = await axios.post(
            `${API_SERVICE}/get/devices/admin`,
            body,
            config
        )
        dispatch({
            type: types.GET_DEVICE_SUCCESS,
            payload: data,
        })
    } catch (error) {
        dispatch({
            type: types.GET_DEVICE_FAIL,
            payload: error.message,
        })
    }
}

const updateDevice = (body) => async (dispatch, getState) => {
    try {
        const config = {
            headers: {
                'Content-Type': 'application/json',
            },
        }

        const { data } = await axios.put(
            `${API_SERVICE}/update/device`,
            body,
            config
        )

        dispatch({
            type: types.UPDATE_DEVICE_SUCCESS,
            payload: data,
        })

        sessionStorage.setItem(
            'deviceList',
            JSON.stringify(getState().devices.deviceList)
        )
    } catch (error) {
        dispatch({
            type: types.UPDATE_DEVICE_FAIL,
            payload: error.message,
        })
    }
}

const deleteDevice = (_id) => async (dispatch, getState) => {
    try {
        await axios.delete(`${API_SERVICE}/delete/device/${_id}`)

        dispatch({
            type: types.DELETE_DEVICE_SUCCESS,
            payload: _id,
        })

        sessionStorage.setItem(
            'deviceList',
            JSON.stringify(getState().devices.deviceList)
        )
    } catch (error) {
        dispatch({
            type: types.DELETE_DEVICE_FAIL,
            payload: error.message,
        })
    }
}

export { createDevice, getAdminDevices, getDevices, updateDevice, deleteDevice }
