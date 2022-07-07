import * as types from '../constants'
import axios from 'axios'
import { API_SERVICE } from '../../URI'

const createHotspot = (bodyData) => async (dispatch, getState) => {
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
            `${API_SERVICE}/create/hotspot`,
            body,
            config
        )

        dispatch({
            type: types.CREATE_HOTSPOT_SUCCESS,
            payload: data,
        })

        sessionStorage.setItem(
            'hotspotList',
            JSON.stringify(getState().hotspots.hotspotList)
        )
    } catch (error) {
        dispatch({
            type: types.CREATE_HOTSPOT_FAIL,
            payload: error.message,
        })
    }
}

const getAdminHotspots = (body) => async (dispatch) => {
    try {
        const config = {
            headers: {
                'Content-Type': 'application/json',
            },
        }
        const { data } = await axios.post(
            `${API_SERVICE}/get/hotspots/admin`,
            body,
            config
        )
        dispatch({
            type: types.GET_HOTSPOT_SUCCESS,
            payload: data,
        })
    } catch (error) {
        dispatch({
            type: types.GET_HOTSPOT_FAIL,
            payload: error.message,
        })
    }
}

const getHotspots = (createdBy) => async (dispatch) => {
    try {
        const { data } = await axios.get(
            `${API_SERVICE}/get/hotspots/${createdBy}`
        )
        dispatch({
            type: types.GET_HOTSPOT_SUCCESS,
            payload: data,
        })
    } catch (error) {
        dispatch({
            type: types.GET_HOTSPOT_FAIL,
            payload: error.message,
        })
    }
}

const updateHotspot = (body) => async (dispatch, getState) => {
    try {
        const config = {
            headers: {
                'Content-Type': 'application/json',
            },
        }

        const { data } = await axios.put(
            `${API_SERVICE}/update/hotspot`,
            body,
            config
        )

        dispatch({
            type: types.UPDATE_HOTSPOT_SUCCESS,
            payload: data,
        })

        sessionStorage.setItem(
            'hotspotList',
            JSON.stringify(getState().hotspots.hotspotList)
        )
    } catch (error) {
        dispatch({
            type: types.UPDATE_HOTSPOT_FAIL,
            payload: error.message,
        })
    }
}

const deleteHotspot = (_id) => async (dispatch, getState) => {
    try {
        await axios.delete(`${API_SERVICE}/delete/hotspot/${_id}`)

        dispatch({
            type: types.DELETE_HOTSPOT_SUCCESS,
            payload: _id,
        })

        sessionStorage.setItem(
            'hotspotList',
            JSON.stringify(getState().hotspots.hotspotList)
        )
    } catch (error) {
        dispatch({
            type: types.DELETE_HOTSPOT_FAIL,
            payload: error.message,
        })
    }
}

export {
    createHotspot,
    getAdminHotspots,
    getHotspots,
    updateHotspot,
    deleteHotspot,
}
