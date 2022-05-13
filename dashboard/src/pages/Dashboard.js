import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  TextField,
  InputAdornment,
  SvgIcon,
  Typography,
  Grid,
  Stack,
  ListItemSecondaryAction,
  Toolbar,
} from '@material-ui/core'
import Paper from '@material-ui/core/Paper'
import IconButton from '@material-ui/core/IconButton'
import DeleteIcon from '@material-ui/icons/Delete'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import Avatar from '@material-ui/core/Avatar'
import PeopleIcon from '@material-ui/icons/People'
import Person from '@material-ui/icons/Person'
import Button from '@material-ui/core/Button'
import Snackbar from '@material-ui/core/Snackbar'
import Alert from '@material-ui/core/Alert'
import { Search as SearchIcon } from 'react-feather'
import { makeStyles } from '@material-ui/styles'
import Locationview from './Locationview'
import AllLocationView from './AllLocationView'
import { db, auth } from '../Firebase/index'
import { collection, query, where, onSnapshot } from 'firebase/firestore'
import { signOut } from 'firebase/auth'

const useStyles = makeStyles((theme) => ({
  root: {
    height: '100%',
  },
  paper: {
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
}))

const Dashboard = () => {
  const classes = useStyles()

  const [selectedIndex, setSelectedIndex] = useState(-1)
  const [trackingUsersList, setTrackingUsersList] = useState([])
  const [userLocations, setUserLocations] = useState([])
  const [search, setSearch] = useState('')
  const [searchResult, setSearchResult] = useState([])

  const [snackOpen, setSnackOpen] = useState(false)
  const [success, setSuccess] = useState(null)
  const [error, setError] = useState(null)

  const navigate = useNavigate()

  const handleSnackClose = (_, reason) => {
    if (reason === 'clickaway') {
      return
    }
    setSnackOpen(false)
    setError(null)
    setSuccess(null)
  }

  const userData = sessionStorage.getItem('userData')
    ? JSON.parse(sessionStorage.getItem('userData'))
    : null

  useEffect(() => {
    if (userData !== null) {
      const trackingUserRef = collection(db, 'trackingUsers')
      const q = query(trackingUserRef, where('senderId', '==', userData.uid))

      const unsub = onSnapshot(q, (snapshot) => {
        const users = []
        const phoneNumberArr = []
        snapshot.forEach((doc) => {
          users.push(doc.data())
          phoneNumberArr.push(doc.data().phoneNumber)
        })

        getAllUsersLocation(phoneNumberArr)
        setTrackingUsersList(users)
      })

      return () => unsub()
    }
  }, [])

  useEffect(() => {
    if (search.length === 0) {
      setSearchResult([])
    }

    setSelectedIndex(-1)
    const temp = trackingUsersList

    const filterArr = temp.filter((x) =>
      x.fullName.toLowerCase().includes(search.toLowerCase())
    )

    setSearchResult(filterArr)
  }, [search])

  const getAllUsersLocation = async (phoneNumberArr) => {
    const UsersRef = collection(db, 'trackerAndroidUser')
    const q = query(UsersRef, where('phoneNumber', 'in', phoneNumberArr))

    const unsub = onSnapshot(q, (snapshot) => {
      const users = []

      snapshot.forEach((doc) => {
        users.push(doc.data())
      })

      setUserLocations(users)
    })

    return () => unsub()
  }

  const handleUserDelete = (id) => {
    console.log(id)
  }

  const handleListItemClick = (_, index) => {
    setSelectedIndex(index)
  }

  const logout = () => {
    sessionStorage.removeItem('userData')
    signOut(auth)
      .then(() => navigate('/login', { replace: true }))
      .catch((error) => console.log(error))
  }

  return (
    <Box className={classes.root}>
      <Grid container sx={{ height: 'inherit' }}>
        <Grid item xs={2.4} sx={{ height: '100%' }}>
          <Paper sx={{ height: '100%' }} className={classes.paper}>
            <Box sx={{ maxWidth: 500 }}>
              <TextField
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position='start'>
                      <SvgIcon fontSize='small' color='action'>
                        <SearchIcon />
                      </SvgIcon>
                    </InputAdornment>
                  ),
                }}
                placeholder='Search user'
                variant='outlined'
                onChange={(e) => setSearch(e.target.value)}
              />
            </Box>
            <List component='nav'>
              <ListItem
                key={-1}
                button
                sx={{
                  mt: 0.5,
                  mb: 0.5,
                  backgroundColor: '#F5F5F5',
                  pt: 1.5,
                  pb: 1.5,
                }}
                selected={selectedIndex === -1}
                onClick={() => setSelectedIndex(-1)}
              >
                <ListItemAvatar>
                  <Avatar>
                    <PeopleIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText primary='Overview All Devices' />
              </ListItem>
              {searchResult.length === 0 &&
                trackingUsersList !== undefined &&
                trackingUsersList !== null &&
                trackingUsersList.map((item, index) => (
                  <ListItem
                    key={index}
                    button
                    sx={{ mt: 0.5, mb: 0.5, backgroundColor: '#F5F5F5' }}
                    selected={selectedIndex === index}
                    onClick={(event) => handleListItemClick(event, index)}
                  >
                    <ListItemAvatar>
                      <Avatar>
                        <Person />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText primary={item.fullName} secondary='Active' />
                    {/* <ListItemSecondaryAction>
                      {selectedIndex === index && (
                        <IconButton
                          edge='end'
                          color='error'
                          onClick={() => handleUserDelete(item.phoneNumber)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      )}
                    </ListItemSecondaryAction> */}
                  </ListItem>
                ))}

              {/* showing search results */}
              {searchResult.length !== 0 &&
                searchResult.map((item, index) => (
                  <ListItem
                    key={index}
                    button
                    sx={{ mt: 0.5, mb: 0.5, backgroundColor: '#F5F5F5' }}
                    selected={selectedIndex === index}
                    onClick={(event) => handleListItemClick(event, index)}
                  >
                    <ListItemAvatar>
                      <Avatar>
                        <Person />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText primary={item.fullName} secondary='Active' />
                    <ListItemSecondaryAction>
                      {selectedIndex === index && (
                        <IconButton
                          edge='end'
                          color='error'
                          onClick={() => handleUserDelete(item.phoneNumber)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      )}
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
            </List>
          </Paper>
        </Grid>

        <Grid item xs={9.6} sx={{ height: '100%' }}>
          <Stack
            direction='row'
            justifyContent='space-between'
            sx={{ padding: 2 }}
          >
            <Typography variant='h4' component='h2'>
              Current Activity
            </Typography>
            <Stack direction='row'>
              <Button variant='outlined' onClick={logout}>
                Logout
              </Button>
            </Stack>
          </Stack>
          <Box>
            {selectedIndex === -1 && (
              <AllLocationView userList={userLocations} />
            )}

            {selectedIndex >= 0 && searchResult.length === 0 && (
              <Locationview
                userList={trackingUsersList[selectedIndex]}
                index={selectedIndex}
              />
            )}

            {selectedIndex >= 0 && searchResult.length !== 0 && (
              <Locationview
                userList={searchResult[selectedIndex]}
                index={selectedIndex}
              />
            )}
          </Box>
        </Grid>
      </Grid>
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

export default Dashboard
