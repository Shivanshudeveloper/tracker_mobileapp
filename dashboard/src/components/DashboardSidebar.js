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

  const paths = [
    '/app/dashboard',
    '',
    '/app/manage-devices',
    '/app/manage-hotspots',
    // '/app/notifications',
    '/app/reports',
  ]

  const names = [
    'Overview',
    'Locations',
    'Devices',
    'Hotspots',
    // 'Notifications',
    'Reports',
  ]

  return (
    <div className={classes.root}>
      <CssBaseline />
      {/* <AppBar position='fixed' className={classes.appBar}>
        <Toolbar sx={{ backgroundColor: '#007bff' }}>
          <Typography variant='h3' sx={{ ml: 2 }} noWrap></Typography>
        </Toolbar>
      </AppBar> */}
      <Drawer variant='permanent'>
        <div className={classes.listContainer}>
          <List>
            {[
              <Home fontSize='large' sx={{ color: 'purple' }} />,
              <LocationOnIcon fontSize='large' sx={{ color: 'red' }} />,
              <PhoneAndroidIcon fontSize='large' sx={{ color: '#007bff' }} />,
              <WifiTetheringIcon fontSize='large' color='success' />,
              // <NotificationsIcon fontSize='large' color='primary' />,
              <SignalCellularAltIcon fontSize='large' color='warning' />,
            ].map((text, index) => (
              <Link to={paths[index]}>
                <ListItem
                  button
                  sx={{
                    pt: 1.5,
                    pb: 1.5,
                    px: 1,
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  {text}
                  <Typography color='black' sx={{ fontSize: 12 }}>
                    {names[index]}
                  </Typography>
                </ListItem>
              </Link>
            ))}
          </List>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <Link to='/app/settings'>
            <IconButton sx={{ mb: 2 }}>
              <Settings fontSize='large' />
            </IconButton>
          </Link>
        </div>
      </Drawer>
    </div>
  )
}

export default DashboardSidebar
