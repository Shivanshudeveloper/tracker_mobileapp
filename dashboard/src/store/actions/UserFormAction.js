import * as types from '../constants'
import axios from 'axios'
import { API_SERVICE } from '../../URI'

export const addForm =
  (fullName, email, phoneNumber, designation, salary, senderEmail, requestId) =>
  async (dispatch, getState) => {
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
      }

      const body = {
        fullName,
        email,
        phoneNumber,
        designation,
        salary,
        senderEmail,
        requestId,
      }

      const { data } = await axios.post(
        `${API_SERVICE}/api/v1/main/tracker/userform`,
        body,
        config
      )

      dispatch({
        type: types.ADD_FORM_SUCCESS,
        payload: data,
      })

      sessionStorage.setItem(
        'userForms',
        JSON.stringify(getState().forms.userForms)
      )
    } catch (error) {
      dispatch({
        type: types.ADD_FORM_FAIL,
        payload:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
      })
    }
  }

export const getForm = (senderEmail) => async (dispatch) => {
  try {
    const { data } = await axios.get(
      `${API_SERVICE}/api/v1/main/tracker/userform/${senderEmail}`
    )
    dispatch({
      type: types.GET_FORM_SUCCESS,
      payload: data,
    })
  } catch (error) {
    dispatch({
      type: types.GET_FORM_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    })
  }
}

export const delForm = (id) => async (dispatch, getState) => {
  try {
    await axios.delete(`${API_SERVICE}/api/v1/main/tracker/userform/${id}`)
    dispatch({
      type: types.DELETE_FORM_SUCCESS,
      payload: id,
    })
    sessionStorage.setItem(
      'userForms',
      JSON.stringify(getState().forms.userForms)
    )
  } catch (error) {
    dispatch({
      type: types.DELETE_FORM_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    })
  }
}
