import React, { useState, useEffect } from 'react'
import {
  Paper,
  Box,
  List,
  ListItem,
  Avatar,
  ListItemAvatar,
  ListItemText,
  Stack,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@material-ui/core'
import { Image } from '@material-ui/icons'
import { firestore } from '../Firebase/index'

const Notification = () => {
  const [filter, setFilter] = useState('All')
  const [notificationList, setNotificationList] = useState([])

  const userInfo = JSON.parse(sessionStorage.getItem('userInfo'))
  const senderId = userInfo._id

  const handleChange = (event) => {
    setFilter(event.target.value)
  }

  useEffect(() => {
    const notificationRef = firestore
      .collection('trackingNotifications')
      .doc(senderId)
    notificationRef.onSnapshot((snapshot) => {
      if (snapshot.exists) {
        if (snapshot.data().notificationList !== undefined) {
          setNotificationList(snapshot.data().notificationList.reverse())
        }
      }
    })
  }, [])

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', m: 4 }}>
      <Paper sx={{ width: '50%' }}>
        <Stack direction='row' justifyContent='space-between' sx={{ p: 2 }}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'flex-start',
              alignItems: 'center',
            }}
          >
            <Typography variant='h4'>Filter By</Typography>
            <FormControl variant='filled' sx={{ width: 250, ml: 3 }}>
              <InputLabel>Select Filter</InputLabel>
              <Select
                value={filter}
                onChange={handleChange}
                label='Select Filter'
              >
                <MenuItem value={'All'}>All</MenuItem>
                <MenuItem value={'Today'}>Today</MenuItem>
                <MenuItem value={'Last Week'}>Last Week</MenuItem>
                <MenuItem value={'Sent Request'}>Sent Request</MenuItem>
              </Select>
            </FormControl>
          </Box>
          <Typography>mark all as read</Typography>
        </Stack>
        <List sx={{ padding: 2 }}>
          {notificationList.map((x) => (
            <ListItem sx={{ mt: 1.5 }}>
              <ListItemAvatar>
                <Avatar>
                  <Image />
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary={x.message} />
            </ListItem>
          ))}
        </List>
      </Paper>
    </Box>
  )
}

export default Notification
