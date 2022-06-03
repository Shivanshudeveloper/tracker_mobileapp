import React, { useState, useEffect } from 'react'
import {
  Box,
  Grid,
  TextField,
  Button,
  Avatar,
  IconButton,
  CircularProgress,
  Snackbar,
  Alert,
} from '@mui/material'
import { makeStyles } from '@mui/styles'

import PhotoCamera from '@mui/icons-material/PhotoCamera'
import { storage, db } from '../Firebase'
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage'
import { updateDoc, doc } from 'firebase/firestore'
import SecuritySetting from '../components/settings/SecuritySetting'

const useStyles = makeStyles((theme) => ({
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
}))

const Profile = () => {
  const classes = useStyles()

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [companyName, setCompanyName] = useState('')

  const [profilePhoto, setProfilePhoto] = useState('')
  const [previewUrl, setPreviewUrl] = useState(null)
  const [selectedFile, setSelectedFile] = useState(null)
  const [isUpdating, setIsUpdating] = useState(false)
  // snackbar states
  const [snackOpen, setSnackOpen] = useState(false)
  const [success, setSuccess] = useState(null)
  const [error, setError] = useState(null)

  const userData = sessionStorage.getItem('userData')
    ? JSON.parse(sessionStorage.getItem('userData'))
    : null

  useEffect(() => {
    if (userData !== null) {
      setProfilePhoto(userData.profilePhoto)
      setFirstName(userData.firstName)
      setCompanyName(userData.companyName)
      setLastName(userData.lastName)
    }
  }, [])

  const handleSnackClose = (event, reason) => {
    if (reason === 'clickaway') {
      return
    }

    setSnackOpen(false)
    setError(null)
    setSuccess(null)
  }

  const updateProfileHandler = async () => {
    try {
      setIsUpdating(true)
      await uploaProfilPhoto()
        .then(async (photo) => {
          const userRef = doc(db, 'trackerWebUser', userData.uid)
          await updateDoc(userRef, {
            firstName,
            lastName,
            companyName,
            profilePhoto: photo,
          }).then(() => {
            const data = {
              firstName,
              lastName,
              companyName,
              profilePhoto: photo,
              uid: userData.uid,
              createdAt: userData.createdAt,
              email: userData.email,
            }
            sessionStorage.setItem('userData', JSON.stringify(data))
            setSuccess('Profile updated successfully')
            setSnackOpen(true)
            setSelectedFile(null)
            setPreviewUrl(null)
            setProfilePhoto(photo)
            setIsUpdating(false)
          })
        })
        .catch((error) => {
          setError(error.message)
          setSnackOpen(true)
          setIsUpdating(false)
        })
    } catch (err) {
      setError(err.message)
      setSnackOpen(true)
      setIsUpdating(false)
    }
  }

  const uploaProfilPhoto = async () => {
    return new Promise((resolve) => {
      if (previewUrl === null) {
        resolve(userData.profilePhoto)
      }

      const storageRef = ref(
        storage,
        `gpsTrackerWebApp/profile/${userData.uid}`
      )
      const uploadTask = uploadBytesResumable(storageRef, selectedFile)

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          console.log('Upload is ' + progress + '% done')
          switch (snapshot.state) {
            case 'paused':
              console.log('Upload is paused')
              break
            case 'running':
              console.log('Upload is running')
              break
          }
        },
        (error) => {
          console.log(error)
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) => {
            resolve(downloadUrl)
          })
        }
      )
    })
  }

  const fileSelectHandler = (e) => {
    const selected = e.target.files[0]
    if (selected) {
      setSelectedFile(selected)

      let src = URL.createObjectURL(selected)
      setPreviewUrl(src)
    }
  }

  return (
    <Box
      sx={{ width: '100%', p: 4, display: 'flex', justifyContent: 'center' }}
    >
      <Box sx={{ width: '70%' }}>
        <Grid container spacing={2}>
          <Grid
            item
            md={5}
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'column',
            }}
          >
            <Avatar
              src={previewUrl === null ? profilePhoto : previewUrl}
              alt='profiile photo'
              sx={{ my: 1.5, width: 200, height: 200 }}
            />

            <IconButton component='label' sx={{ width: 50, height: 50 }}>
              <PhotoCamera />
              <input
                type='file'
                hidden
                onChange={fileSelectHandler}
                accept='image/*'
              />
            </IconButton>
          </Grid>
          <Grid item md={7}>
            <form className={classes.form} noValidate>
              <TextField
                variant='outlined'
                margin='normal'
                fullWidth
                id='firstName'
                label='First Name'
                name='firstName'
                autoComplete='name'
                autoFocus
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
              <TextField
                variant='outlined'
                margin='normal'
                fullWidth
                id='lastName'
                label='Last Name'
                name='lastName'
                autoComplete='name'
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
              <TextField
                variant='outlined'
                margin='normal'
                fullWidth
                id='email'
                label='Company Name'
                name='companyName'
                autoComplete='text'
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
              />

              <Button
                variant='contained'
                onClick={() => updateProfileHandler()}
                sx={{ py: 1.2, px: 4, fontSize: 15, mt: 2, mb: 4 }}
                startIcon={
                  isUpdating && <CircularProgress size={20} color='inherit' />
                }
              >
                Update Profile
              </Button>
            </form>
          </Grid>
        </Grid>
        <Grid container spacing={2}>
          <Grid item md={5}></Grid>
          <Grid item md={7}>
            <SecuritySetting
              open={setSnackOpen}
              success={setSuccess}
              error={setError}
            />
          </Grid>
        </Grid>
      </Box>

      {success !== null && (
        <Snackbar
          open={snackOpen}
          autoHideDuration={4000}
          onClose={handleSnackClose}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <Alert
            onClose={handleSnackClose}
            severity='success'
            sx={{ width: '100%' }}
          >
            {success}
          </Alert>
        </Snackbar>
      )}
      {error !== null && (
        <Snackbar
          open={snackOpen}
          autoHideDuration={4000}
          onClose={handleSnackClose}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <Alert
            onClose={handleSnackClose}
            severity='error'
            sx={{ width: '100%' }}
          >
            {error}
          </Alert>
        </Snackbar>
      )}
    </Box>
  )
}

export default Profile
