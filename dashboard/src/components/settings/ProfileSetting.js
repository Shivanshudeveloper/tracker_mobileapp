import React, { useState, useEffect } from 'react'
import {
  TextField,
  Button,
  Box,
  Avatar,
  IconButton,
  CircularProgress,
} from '@mui/material'
import { makeStyles } from '@mui/styles'

import CreateIcon from '@mui/icons-material/Create'
import { storage, db } from '../../Firebase/index'
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage'
import { updateDoc, doc } from 'firebase/firestore'

const useStyles = makeStyles((theme) => ({
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
}))

const ProfileSetting = (props) => {
  const { open, success, error } = props

  const classes = useStyles()

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [companyName, setCompanyName] = useState('')

  const [profilePhoto, setProfilePhoto] = useState('')
  const [previewUrl, setPreviewUrl] = useState(null)
  const [selectedFile, setSelectedFile] = useState(null)

  const [isUpdating, setIsUpdating] = useState(false)

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
            success('Profile updated successfully')
            open(true)
            setSelectedFile(null)
            setPreviewUrl(null)
            setProfilePhoto(photo)
            setIsUpdating(false)
          })
        })
        .catch((error) => {
          error(error.message)
          open(true)
          setIsUpdating(false)
        })
    } catch (err) {
      error(err.message)
      open(true)
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
    <Box>
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

        <Box
          sx={{
            display: 'flex',
            width: 150,
            height: 150,
            alignItems: 'center',
            mt: 2,
          }}
        >
          <Avatar
            src={previewUrl === null ? profilePhoto : previewUrl}
            alt='profiile photo'
            sx={{ my: 1.5, width: 150, height: 150 }}
          />

          <IconButton component='label' sx={{ ml: 3, width: 50, height: 50 }}>
            <CreateIcon />
            <input
              type='file'
              hidden
              onChange={fileSelectHandler}
              accept='image/*'
            />
          </IconButton>
        </Box>

        <Button
          variant='contained'
          onClick={() => updateProfileHandler()}
          sx={{ py: 1.2, px: 4, fontSize: 15, mt: 4, mb: 1 }}
          startIcon={
            isUpdating && <CircularProgress size={20} color='inherit' />
          }
        >
          Update Profile
        </Button>
      </form>
    </Box>
  )
}

export default ProfileSetting
