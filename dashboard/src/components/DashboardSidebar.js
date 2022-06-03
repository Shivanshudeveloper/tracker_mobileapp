import React from 'react'
import { Link } from 'react-router-dom'
import { makeStyles } from '@mui/styles'
import Drawer from '@mui/material/Drawer'
import List from '@mui/material/List'
import CssBaseline from '@mui/material/CssBaseline'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import ListItem from '@mui/material/ListItem'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import PhoneAndroidIcon from '@mui/icons-material/PhoneAndroid'
import GroupsIcon from '@mui/icons-material/Groups'
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettingsRounded'
import SignalCellularAltIcon from '@mui/icons-material/SignalCellularAlt'
import { Settings, Home } from '@mui/icons-material'
import { AppBar, Toolbar, Typography } from '@mui/material'

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
    '/app/manage-hotspots',
    '/app/manage-devices',
    '/app/reports',
    '/app/manage-groups',
    '/app/manage-admins',
  ]

  const names = [
    'Overview',
    'Hotspots',
    'Devices',
    'Reports',
    'Groups',
    'Admins',
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
              <Home fontSize='large' sx={{ color: '#6600cc' }} />,
              <LocationOnIcon fontSize='large' sx={{ color: 'red' }} />,
              <PhoneAndroidIcon fontSize='large' sx={{ color: '#007bff' }} />,
              <SignalCellularAltIcon fontSize='large' color='warning' />,
              <GroupsIcon fontSize='large' color='success' />,
              <AdminPanelSettingsIcon
                fontSize='large'
                sx={{ color: '#cc33ff' }}
              />,
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
        {/* <div style={{ display: 'flex', justifyContent: 'center' }}>
          <Link to='/app/settings'>
            <IconButton sx={{ mb: 2 }}>
              <Settings fontSize='large' />
            </IconButton>
          </Link>
        </div> */}
      </Drawer>
    </div>
  )
}

export default DashboardSidebar
