import { useState, useEffect } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import PropTypes from 'prop-types'
import {
  AppBar,
  Avatar,
  Badge,
  Box,
  Divider,
  Hidden,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Menu,
  MenuItem,
  Popover,
  Toolbar,
  Typography,
} from '@material-ui/core'
import MenuIcon from '@material-ui/icons/Menu'
import NotificationsIcon from '@material-ui/icons/Notifications'
import Account from '@material-ui/icons/AccountCircle'
import { db } from '../Firebase/index'
import { onSnapshot, doc, query, orderBy } from 'firebase/firestore'
import moment from 'moment'
import { Image } from '@material-ui/icons'

const DashboardNavbar = ({ onMobileNavOpen, ...rest }) => {
  const [notifications, setNotifications] = useState([])
  const [anchorEl, setAnchorEl] = useState(null)
  const [open, setOpen] = useState(false)

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
    setOpen(false)
  }

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
    setOpen(true)
  }

  const userData = sessionStorage.getItem('userData')
    ? JSON.parse(sessionStorage.getItem('userData'))
    : null

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
          setNotifications(list)
        }
      }
    })

    return () => unsub()
  }, [])

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

  return (
    <AppBar elevation={0} {...rest}>
      <Toolbar
        sx={{
          backgroundColor: '#007bff',
          display: 'flex',
          justifyContent: 'flex-end',
          gap: 1,
        }}
      >
        <IconButton onClick={handleClick}>
          <NotificationsIcon sx={{ color: 'white' }} />
        </IconButton>
        <Popover
          id='notification'
          open={open}
          anchorEl={anchorEl}
          onClose={handleClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          className='notification'
        >
          <List sx={{ padding: 2 }}>
            {notifications.map((x, i) => (
              <Box key={++i} style={{ padding: 2 }}>
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
              </Box>
            ))}
          </List>
        </Popover>

        <Box>
          <IconButton onClick={handleMenu}>
            <Account sx={{ color: 'white' }} />
          </IconButton>
          {/* <Menu
            id='menu-appbar'
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            open={Boolean(anchorEl)}
            onClose={handleClose}
          ></Menu> */}
        </Box>
      </Toolbar>
    </AppBar>
  )
}

DashboardNavbar.propTypes = {
  onMobileNavOpen: PropTypes.func,
}

export default DashboardNavbar
