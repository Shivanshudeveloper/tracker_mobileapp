import * as types from '../constants'
import axios from 'axios'
import { API_SERVICE } from '../../URI'

const createAdmin = (bodyData) => async (dispatch, getState) => {
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
            `${API_SERVICE}/create/admin`,
            body,
            config
        )

        dispatch({
            type: types.CREATE_ADMIN_SUCCESS,
            payload: data,
        })

        sessionStorage.setItem(
            'adminList',
            JSON.stringify(getState().admins.adminList)
        )
    } catch (error) {
        dispatch({
            type: types.CREATE_ADMIN_FAIL,
            payload: error.message,
        })
    }
}

const getAdmins = (createdBy) => async (dispatch) => {
    try {
        const { data } = await axios.get(
            `${API_SERVICE}/get/admins/${createdBy}`
        )
        dispatch({
            type: types.GET_ADMIN_SUCCESS,
            payload: data,
        })
    } catch (error) {
        dispatch({
            type: types.GET_ADMIN_FAIL,
            payload: error.message,
        })
    }
}

const updateAdmin = (body) => async (dispatch, getState) => {
    try {
        const config = {
            headers: {
                'Content-Type': 'application/json',
            },
        }

        const { data } = await axios.put(
            `${API_SERVICE}/update/admin`,
            body,
            config
        )

        console.log(data)

        dispatch({
            type: types.UPDATE_ADMIN_SUCCESS,
            payload: data,
        })

        sessionStorage.setItem(
            'adminList',
            JSON.stringify(getState().admins.adminList)
        )
    } catch (error) {
        dispatch({
            type: types.UPDATE_ADMIN_FAIL,
            payload: error.message,
        })
    }
}

const deleteAdmin = (_id) => async (dispatch, getState) => {
    try {
        await axios.delete(`${API_SERVICE}/delete/admin/${_id}`)

        dispatch({
            type: types.DELETE_ADMIN_SUCCESS,
            payload: _id,
        })

        sessionStorage.setItem(
            'adminList',
            JSON.stringify(getState().admins.adminList)
        )
    } catch (error) {
        dispatch({
            type: types.DELETE_ADMIN_FAIL,
            payload: error.message,
        })
    }
}

export { createAdmin, getAdmins, updateAdmin, deleteAdmin }
