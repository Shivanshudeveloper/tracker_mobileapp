import React from 'react'
import { Link } from 'react-router-dom'
import { makeStyles } from '@mui/styles'
import Drawer from '@mui/material/Drawer'
import List from '@mui/material/List'
import CssBaseline from '@mui/material/CssBaseline'
import ListItem from '@mui/material/ListItem'
import LocationOnIcon from '@mui/icons-material/LocationOnOutlined'
import PhoneAndroidIcon from '@mui/icons-material/PhoneAndroidOutlined'
import GroupsIcon from '@mui/icons-material/GroupsOutlined'
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettingsRounded'
import SignalCellularAltIcon from '@mui/icons-material/SignalCellularAltOutlined'
import { Settings, HomeOutlined } from '@mui/icons-material'
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

  const [selectedIndex, setSelectedIndex] = React.useState(0)

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
  //
  return (
    <div className={classes.root}>
      <CssBaseline />
      <Drawer variant='permanent'>
        <div className={classes.listContainer}>
          <List>
            {[
              <HomeOutlined fontSize='large' sx={{ color: '#6600cc' }} />,
              <LocationOnIcon fontSize='large' sx={{ color: 'red' }} />,
              <PhoneAndroidIcon fontSize='large' sx={{ color: '#007bff' }} />,
              <SignalCellularAltIcon
                fontSize='large'
                sx={{ color: 'orange' }}
              />,
              <GroupsIcon fontSize='large' sx={{ color: 'green' }} />,
              <AdminPanelSettingsIcon
                fontSize='large'
                sx={{ color: '#cc33ff' }}
              />,
            ].map((text, index) => (
              <Link to={paths[index]}>
                <ListItem
                  sx={{
                    pt: 1.5,
                    pb: 1.5,
                    px: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    borderBottomColor: '#007bff',
                    borderBottomWidth: 10,
                  }}
                  onClick={() => setSelectedIndex(index)}
                >
                  <div>{text}</div>

                  <Typography
                    color='black'
                    sx={{
                      fontSize: 12,
                    }}
                  >
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
