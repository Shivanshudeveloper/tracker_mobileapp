import * as types from '../constants'
import axios from 'axios'
import { API_SERVICE } from '../../URI'

const createGroup = (bodyData) => async (dispatch, getState) => {
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
            `${API_SERVICE}/create/group`,
            body,
            config
        )

        dispatch({
            type: types.CREATE_GROUP_SUCCESS,
            payload: data,
        })

        sessionStorage.setItem(
            'groupList',
            JSON.stringify(getState().groups.groupList)
        )
    } catch (error) {
        dispatch({
            type: types.CREATE_GROUP_FAIL,
            payload: error.message,
        })
    }
}

const getGroups = (createdBy) => async (dispatch) => {
    try {
        const { data } = await axios.get(
            `${API_SERVICE}/get/groups/${createdBy}`
        )
        dispatch({
            type: types.GET_GROUP_SUCCESS,
            payload: data,
        })
    } catch (error) {
        dispatch({
            type: types.GET_GROUP_FAIL,
            payload: error.message,
        })
    }
}

const updateGroup = (body) => async (dispatch, getState) => {
    try {
        const config = {
            headers: {
                'Content-Type': 'application/json',
            },
        }

        const { data } = await axios.put(
            `${API_SERVICE}/update/group`,
            body,
            config
        )

        dispatch({
            type: types.UPDATE_GROUP_SUCCESS,
            payload: data,
        })

        sessionStorage.setItem(
            'groupList',
            JSON.stringify(getState().groups.groupList)
        )
    } catch (error) {
        dispatch({
            type: types.UPDATE_GROUP_FAIL,
            payload: error.message,
        })
    }
}

const deleteGroup = (_id) => async (dispatch, getState) => {
    try {
        await axios.delete(`${API_SERVICE}/delete/group/${_id}`)

        dispatch({
            type: types.DELETE_GROUP_SUCCESS,
            payload: _id,
        })

        sessionStorage.setItem(
            'groupList',
            JSON.stringify(getState().groups.groupList)
        )
    } catch (error) {
        dispatch({
            type: types.DELETE_GROUP_FAIL,
            payload: error.message,
        })
    }
}

export { createGroup, getGroups, updateGroup, deleteGroup }
