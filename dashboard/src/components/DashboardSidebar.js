import React from 'react'
import { Link } from 'react-router-dom'
import { makeStyles } from '@material-ui/styles'
import Drawer from '@material-ui/core/Drawer'
import List from '@material-ui/core/List'
import CssBaseline from '@material-ui/core/CssBaseline'
import Divider from '@material-ui/core/Divider'
import IconButton from '@material-ui/core/IconButton'
import ListItem from '@material-ui/core/ListItem'
import LocationOnIcon from '@material-ui/icons/LocationOn'
import PhoneAndroidIcon from '@material-ui/icons/PhoneAndroid'
import WifiTetheringIcon from '@material-ui/icons/WifiTethering'
import NotificationsIcon from '@material-ui/icons/Notifications'
import SignalCellularAltIcon from '@material-ui/icons/SignalCellularAlt'
import { Settings, Home } from '@material-ui/icons'
import { AppBar, Toolbar, Typography } from '@material-ui/core'

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  drawer: {
    width: 60,
    flexShrink: 0,
    whiteSpace: 'nowrap',
  },

  appBar: {
    width: `calc(100% - ${60}px)`,
    marginLeft: 60,
  },

  toolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
  },
  listContainer: {
    display: 'flex',
    height: '100%',
    flexDirection: 'column',
    justifyContent: 'center',
  },
}))

const DashboardSidebar = () => {
  const classes = useStyles()

  const paths = ['', '', '', '/app/notifications', '/app/reports']

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar position='fixed' className={classes.appBar}>
        <Toolbar>
          <Typography variant='h3' sx={{ ml: 2 }} noWrap>
            DASHBOARD
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer variant='permanent'>
        <div className={classes.toolbar}>
          <Link to='/app/dashboard'>
            <IconButton>
              <Home fontSize='large' />
            </IconButton>
          </Link>
        </div>
        <div className={classes.listContainer}>
          <List>
            {[
              <LocationOnIcon fontSize='large' color='error' />,
              <PhoneAndroidIcon fontSize='large' color='info' />,
              <WifiTetheringIcon fontSize='large' color='success' />,
              <NotificationsIcon fontSize='large' color='primary' />,
              <SignalCellularAltIcon fontSize='large' color='warning' />,
            ].map((text, index) => (
              <Link to={paths[index]}>
                <ListItem button sx={{ pt: 1.5, pb: 1.5 }}>
                  {text}
                </ListItem>
              </Link>
            ))}
          </List>
        </div>
        <Link to='/app/settings'>
          <IconButton sx={{ mb: 2 }}>
            <Settings fontSize='large' />
          </IconButton>
        </Link>
      </Drawer>
    </div>
  )
}

export default DashboardSidebar
