// import { useEffect } from 'react'
// import { Link as RouterLink, useLocation } from 'react-router-dom'
// import PropTypes from 'prop-types'
// import {
//   Avatar,
//   Box,
//   Button,
//   Divider,
//   Drawer,
//   Hidden,
//   List,
//   Typography,
// } from '@material-ui/core'
// import {
//   AlertCircle as AlertCircleIcon,
//   BarChart as BarChartIcon,
//   Lock as LockIcon,
//   Settings as SettingsIcon,
//   ShoppingBag as ShoppingBagIcon,
//   User as UserIcon,
//   UserPlus as UserPlusIcon,
//   Users as UsersIcon,
// } from 'react-feather'
// import NavItem from './NavItem'

// const user = {
//   avatar: '',
//   jobTitle: '',
//   name: 'Infosys Pvt. Ltd.',
// }

// const items = [
//   {
//     href: '/app/dashboard',
//     icon: BarChartIcon,
//     title: 'Dashboard',
//   },
//   {
//     href: '/app/settings',
//     icon: SettingsIcon,
//     title: 'Settings',
//   },
// ]

// const DashboardSidebar = ({ onMobileClose, openMobile }) => {
//   const location = useLocation()

//   const userInfo = sessionStorage.getItem('userInfo')
//     ? JSON.parse(sessionStorage.getItem('userInfo'))
//     : null

//   useEffect(() => {
//     if (openMobile && onMobileClose) {
//       onMobileClose()
//     }
//   }, [location.pathname])

//   const content = (
//     <Box
//       sx={{
//         display: 'flex',
//         flexDirection: 'column',
//         height: '100%',
//       }}
//     >
//       <Box
//         sx={{
//           alignItems: 'center',
//           display: 'flex',
//           flexDirection: 'column',
//           p: 2,
//         }}
//       >
//         <Avatar
//           component={RouterLink}
//           src={user.avatar}
//           sx={{
//             cursor: 'pointer',
//             width: 64,
//             height: 64,
//             marginBottom: 1,
//           }}
//           to='/app/account'
//         />
//         {userInfo && (
//           <Typography color='textPrimary' variant='h5'>
//             {userInfo.companyName}
//           </Typography>
//         )}
//         <Typography color='textSecondary' variant='body2'>
//           {user.jobTitle}
//         </Typography>
//       </Box>
//       <Divider />
//       <Box sx={{ p: 2 }}>
//         <List>
//           {items.map((item) => (
//             <NavItem
//               href={item.href}
//               key={item.title}
//               title={item.title}
//               icon={item.icon}
//             />
//           ))}
//         </List>
//       </Box>
//       <Box sx={{ flexGrow: 1 }} />
//     </Box>
//   )

//   return (
//     <>
//       <Hidden lgUp>
//         <Drawer
//           anchor='left'
//           onClose={onMobileClose}
//           open={openMobile}
//           variant='temporary'
//           PaperProps={{
//             sx: {
//               width: 256,
//             },
//           }}
//         >
//           {content}
//         </Drawer>
//       </Hidden>
//       <Hidden xlDown>
//         <Drawer
//           anchor='left'
//           open
//           variant='persistent'
//           PaperProps={{
//             sx: {
//               width: 256,
//               top: 64,
//               height: 'calc(100% - 64px)',
//             },
//           }}
//         >
//           {content}
//         </Drawer>
//       </Hidden>
//     </>
//   )
// }

// DashboardSidebar.propTypes = {
//   onMobileClose: PropTypes.func,
//   openMobile: PropTypes.bool,
// }

// DashboardSidebar.defaultProps = {
//   onMobileClose: () => {},
//   openMobile: false,
// }

// export default DashboardSidebar
import React from 'react'
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
          <IconButton>
            <Home fontSize='large' />
          </IconButton>
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
              <ListItem button sx={{ pt: 1.5, pb: 1.5 }}>
                {/* <IconButton sx={{ p: 0.5 }} key={text}> */}
                {text}
                {/* </IconButton> */}
              </ListItem>
            ))}
          </List>
        </div>
        <IconButton sx={{ mb: 2 }}>
          <Settings fontSize='large' />
        </IconButton>
      </Drawer>
    </div>
  )
}

export default DashboardSidebar
