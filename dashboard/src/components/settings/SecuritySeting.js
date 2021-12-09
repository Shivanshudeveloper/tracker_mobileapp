import React, { useState } from 'react'
import { TextField, Button, Box } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import axios from 'axios'
import { API_SERVICE } from '../../URI'

const useStyles = makeStyles((theme) => ({
  form: {
    width: '100%',
    marginTop: theme.spacing(1),
  },
}))

const SecuritySeting = (props) => {
  const { open, success, error } = props

  const classes = useStyles()
  const [password, setPassword] = useState('')
  const userInfo = JSON.parse(sessionStorage.getItem('userInfo'))

  const updateProfileHandler = async () => {
    try {
      const id = userInfo._id
      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
      }
      const data = {
        password,
        id,
      }
      const res = await axios.put(
        `${API_SERVICE}/api/v1/main/tracker/user/update`,
        data,
        config
      )

      if (res.data.success) {
        success('Password updated successfully')
        open(true)
        setPassword('')
      } else {
        error(res.data.message)
        open(true)
      }
    } catch (err) {
      error(err)
      open(true)
    }
  }

  return (
    <Box>
      <form className={classes.form} noValidate>
        <TextField
          variant='outlined'
          margin='normal'
          fullWidth
          id='password'
          label='Password'
          name='password'
          autoComplete='name'
          autoFocus
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button variant='contained' onClick={() => updateProfileHandler()}>
          Update Password
        </Button>
      </form>
    </Box>
  )
}

export default SecuritySeting
