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
  Divider,
} from '@material-ui/core'
import { Image } from '@material-ui/icons'
//import { firestore } from '../Firebase/index'
import { db } from '../Firebase/index'
import { onSnapshot, doc, query, orderBy } from 'firebase/firestore'
import moment from 'moment'

const Notification = () => {
  const [filter, setFilter] = useState('All')
  const [notificationList, setNotificationList] = useState([])
  const [filterList, setFilterList] = useState([])

  const userData = sessionStorage.getItem('userData')
    ? JSON.parse(sessionStorage.getItem('userData'))
    : null

  const handleFilterChange = (event) => {
    setFilter(event.target.value)
  }

  const getTime = (sec) => {
    const str = moment(new Date(sec * 1000)).fromNow()

    switch (str) {
      case 'in a few seconds':
        return 'few sec'
      case 'a few seconds ago':
        return 'few sec'
      case 'a minute ago':
        return '1m'
      case 'an hour ago':
        return '1h'
      case 'a day ago':
        return '1day'
      default:
        const first = str.split(' ')[0]
        let mid = str.split(' ')[1]
        if (mid === 'minutes' || mid === 'minute') {
          mid = 'm'
        }
        if (mid === 'hours' || mid === 'hour') {
          mid = 'h'
        }
        if (mid === 'days' || mid === 'day') {
          mid = 'd'
        }
        return first + mid
    }
  }

  useEffect(async () => {
    const notificationRef = doc(db, 'trackingWebNotification', userData.uid)

    const unsub = onSnapshot(notificationRef, (snap) => {
      if (snap.exists()) {
        const data = snap.data()
        if (data.notificationList !== undefined) {
          const list = data.notificationList
          list.sort((a, b) => {
            return new Date(b.createdAt.seconds) - new Date(a.createdAt.seconds)
          })
          setNotificationList(list)
        }
      }
    })

    return () => unsub()
  }, [])

  useEffect(() => {
    const temp = notificationList
    const currDate = new Date().getTime()
    let filterArr = []

    if (filter === 'Today') {
      filterArr = temp.filter(
        (x) =>
          new Date(x.createdAt.seconds * 1000).getDate() ===
          new Date(currDate).getDate()
      )
    } else if (filter === 'Last Week') {
      let start = new Date(currDate).getDate() - 7
      if (start <= 0) {
        start = 30 + start
      }
      const end = new Date(currDate).getDate()

      console.log(start, end)

      filterArr = temp.filter(
        (x) =>
          new Date(x.createdAt.seconds * 1000).getDate() >= start ||
          new Date(x.createdAt.seconds * 1000).getDate() <= end
      )
    } else {
      filterArr = temp
    }

    setFilterList(filterArr)
  }, [filter])

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', m: 4 }}>
      <Paper
        sx={{
          width: { md: '70%', lg: '60%', xl: '50%' },
          p: 2,
          borderRadius: 5,
          boxShadow: 5,
        }}
      >
        <Stack direction='row' justifyContent='space-between' sx={{ p: 2 }}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              width: '100%',
            }}
          >
            <Box>
              <Typography variant='h3'>Notifications</Typography>
            </Box>
            <Stack direction='row' alignItems='center'>
              <Typography variant='h4'>Filter By</Typography>
              <FormControl variant='outlined' sx={{ width: 250, ml: 3 }}>
                <InputLabel>Select Filter</InputLabel>
                <Select
                  value={filter}
                  onChange={handleFilterChange}
                  label='Select Filter'
                >
                  <MenuItem value={'All'}>All</MenuItem>
                  <MenuItem value={'Today'}>Today</MenuItem>
                  <MenuItem value={'Last Week'}>Last Week</MenuItem>
                </Select>
              </FormControl>
            </Stack>
          </Box>
          {/* <Typography>mark all as read</Typography> */}
        </Stack>
        <List sx={{ padding: 2 }}>
          {filter === 'All' &&
            notificationList.map((x, i) => (
              <div key={++i}>
                <ListItem sx={{ mt: 1.5 }}>
                  <ListItemAvatar>
                    <Avatar>
                      <Image />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={x.message}
                    secondary={getTime(x.createdAt.seconds) + ' ago'}
                  />
                </ListItem>
                <Divider />
              </div>
            ))}

          {filter !== 'All' &&
            filterList.map((x, i) => (
              <div key={++i}>
                <ListItem sx={{ mt: 1.5 }}>
                  <ListItemAvatar>
                    <Avatar>
                      <Image />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={x.message}
                    secondary={getTime(x.createdAt.seconds) + ' ago'}
                  />
                </ListItem>
                <Divider />
              </div>
            ))}
        </List>
      </Paper>
    </Box>
  )
}

export default Notification
