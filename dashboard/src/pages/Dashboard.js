// import React, { useEffect } from 'react'
// import { Link } from 'react-router-dom'
// import { useDispatch, useSelector } from 'react-redux'
// import {
//   Box,
//   Container,
//   Card,
//   CardContent,
//   TextField,
//   InputAdornment,
//   SvgIcon,
// } from '@material-ui/core'

// import Table from '@material-ui/core/Table'
// import TableBody from '@material-ui/core/TableBody'
// import TableCell from '@material-ui/core/TableCell'
// import TableContainer from '@material-ui/core/TableContainer'
// import TableHead from '@material-ui/core/TableHead'
// import TableRow from '@material-ui/core/TableRow'
// import Paper from '@material-ui/core/Paper'
// import IconButton from '@material-ui/core/IconButton'
// import Tooltip from '@material-ui/core/Tooltip'
// import VisibilityIcon from '@material-ui/icons/Visibility'
// import DeleteIcon from '@material-ui/icons/Delete'
// import EditIcon from '@material-ui/icons/Edit'

// import Dialog from '@material-ui/core/Dialog'
// import DialogActions from '@material-ui/core/DialogActions'
// import DialogContent from '@material-ui/core/DialogContent'
// import DialogTitle from '@material-ui/core/DialogTitle'
// import Button from '@material-ui/core/Button'

// import { database } from '../Firebase/index'

// import { Search as SearchIcon } from 'react-feather'
// import { addForm, getForm, delForm } from '../store/actions/UserFormAction'

// const Dashboard = () => {
//   const [open, setOpen] = React.useState(false)
//   const [fullName, setFullName] = React.useState('')
//   const [email, setEmail] = React.useState('')
//   const [phoneNumber, setPhoneNumber] = React.useState('')
//   const [designation, setDesignation] = React.useState('')
//   const [salary, setSalary] = React.useState('')

//   const userInfo = sessionStorage.getItem('userInfo')
//     ? JSON.parse(sessionStorage.getItem('userInfo'))
//     : null

//   const dispatch = useDispatch()
//   const forms = useSelector((state) => state.forms)
//   const { success, error, userForms } = forms

//   let i = 0

//   useEffect(() => {
//     dispatch(getForm(userInfo.email))
//   }, [])

//   const handleClickOpen = () => {
//     setOpen(true)
//   }
//   const handleClose = () => {
//     setOpen(false)
//   }

//   const submitHandler = async () => {
//     if (phoneNumber !== '' && phoneNumber.length === 10) {
//       const requestRef = database.ref(
//         `trackerapp/trackingRequested/${phoneNumber}`
//       )
//       const acceptRef = database.ref(
//         `trackerapp/trackingAccepted/${phoneNumber}`
//       )
//       const requestId = requestRef.push().key
//       await requestRef
//         .child(requestId)
//         .set({
//           companyName: userInfo.companyName,
//           requestPending: true,
//         })
//         .then(() => {
//           console.log(fullName, email, phoneNumber)
//           dispatch(
//             addForm(
//               fullName,
//               email,
//               phoneNumber,
//               designation,
//               salary,
//               userInfo.email,
//               requestId
//             )
//           )
//         })
//         .then(() => {
//           handleClose()
//           setFullName('')
//           setDesignation('')
//           setEmail('')
//           setPhoneNumber('')
//           setSalary('')
//         })
//         .then(() => alert('Tracking request sent'))
//         .catch((error) => console.log(error))

//       await acceptRef
//         .child(requestId)
//         .set({
//           requestAccepted: false,
//         })
//         .catch((error) => console.log(error))
//     } else {
//       alert('10 digit phone number is required')
//     }
//   }

//   return (
//     <>
//       <Dialog
//         open={open}
//         fullWidth
//         maxWidth='sm'
//         onClose={handleClose}
//         aria-labelledby='alert-dialog-title'
//         aria-describedby='alert-dialog-description'
//       >
//         <DialogTitle id='alert-dialog-title'>Create a new user</DialogTitle>
//         <DialogContent>
//           <TextField
//             id='outlined-basic'
//             fullWidth
//             sx={{ mb: 2, mt: 4 }}
//             label='Full Name'
//             variant='outlined'
//             value={fullName}
//             onChange={(e) => setFullName(e.target.value)}
//           />
//           <TextField
//             id='outlined-basic'
//             fullWidth
//             sx={{ mb: 2 }}
//             label='Email'
//             variant='outlined'
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//           />
//           <TextField
//             id='outlined-basic'
//             fullWidth
//             sx={{ mb: 2 }}
//             label='Phone Number'
//             variant='outlined'
//             value={phoneNumber}
//             onChange={(e) => setPhoneNumber(e.target.value)}
//           />
//           <TextField
//             id='outlined-basic'
//             fullWidth
//             sx={{ mb: 2 }}
//             label='Designation'
//             variant='outlined'
//             value={designation}
//             onChange={(e) => setDesignation(e.target.value)}
//           />
//           <TextField
//             id='outlined-basic'
//             fullWidth
//             sx={{ mb: 2 }}
//             label='Salary'
//             variant='outlined'
//             value={salary}
//             onChange={(e) => setSalary(e.target.value)}
//           />
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={handleClose} color='primary'>
//             Close
//           </Button>
//           <Button onClick={submitHandler} color='primary' autoFocus>
//             Submit
//           </Button>
//         </DialogActions>
//       </Dialog>

//       <Box
//         sx={{
//           backgroundColor: 'background.default',
//           minHeight: '100%',
//           py: 3,
//         }}
//       >
//         <Container maxWidth={false}>
//           <h2 style={{ marginBottom: '10px' }}>Users</h2>

//           <Box>
//             <Box
//               sx={{
//                 display: 'flex',
//                 justifyContent: 'flex-end',
//               }}
//             >
//               <Button
//                 color='primary'
//                 variant='contained'
//                 onClick={handleClickOpen}
//               >
//                 Add user
//               </Button>
//             </Box>
//             <Box sx={{ mt: 3 }}>
//               <Card>
//                 <CardContent>
//                   <Box sx={{ maxWidth: 500 }}>
//                     <TextField
//                       fullWidth
//                       InputProps={{
//                         startAdornment: (
//                           <InputAdornment position='start'>
//                             <SvgIcon fontSize='small' color='action'>
//                               <SearchIcon />
//                             </SvgIcon>
//                           </InputAdornment>
//                         ),
//                       }}
//                       placeholder='Search user'
//                       variant='outlined'
//                     />
//                   </Box>
//                 </CardContent>
//               </Card>
//             </Box>
//           </Box>
//           <TableContainer sx={{ mt: 2 }} component={Paper}>
//             <Table aria-label='simple table'>
//               <TableHead>
//                 <TableRow>
//                   <TableCell>Full Name</TableCell>
//                   <TableCell align='right'>Email</TableCell>
//                   <TableCell align='right'>Phone No.</TableCell>
//                   <TableCell align='right'>Job Title</TableCell>
//                   <TableCell align='center'>Action</TableCell>
//                 </TableRow>
//               </TableHead>
//               <TableBody>
//                 {userForms !== undefined &&
//                   userForms.map((item) => (
//                     <TableRow key={i++}>
//                       <TableCell component='th' scope='row'>
//                         {item.fullName}
//                       </TableCell>
//                       <TableCell align='right'>{item.email}</TableCell>
//                       <TableCell align='right'>{item.phoneNumber}</TableCell>
//                       <TableCell align='right'>{item.designation}</TableCell>
//                       <TableCell align='center'>
//                         <Link
//                           to={`/app/locationview/${item.phoneNumber}/${item.requestId}`}
//                         >
//                           <Tooltip title='View Location'>
//                             <IconButton
//                               color='primary'
//                               aria-label='upload picture'
//                               component='span'
//                             >
//                               <VisibilityIcon />
//                             </IconButton>
//                           </Tooltip>
//                         </Link>
//                         <Tooltip title='Delete User'>
//                           <IconButton
//                             color='primary'
//                             aria-label='upload picture'
//                             component='span'
//                             onClick={() => dispatch(delForm(item._id))}
//                           >
//                             <DeleteIcon />
//                           </IconButton>
//                         </Tooltip>

//                         <Tooltip title='Edit User'>
//                           <IconButton
//                             color='primary'
//                             aria-label='upload picture'
//                             component='span'
//                           >
//                             <EditIcon />
//                           </IconButton>
//                         </Tooltip>
//                       </TableCell>
//                     </TableRow>
//                   ))}
//               </TableBody>
//             </Table>
//           </TableContainer>
//         </Container>
//       </Box>
//     </>
//   )
// }

// export default Dashboard

import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import {
  Box,
  TextField,
  InputAdornment,
  SvgIcon,
  Typography,
  Grid,
  Stack,
  ListItemSecondaryAction,
} from '@material-ui/core'
import Paper from '@material-ui/core/Paper'
import IconButton from '@material-ui/core/IconButton'
import Tooltip from '@material-ui/core/Tooltip'
import VisibilityIcon from '@material-ui/icons/Visibility'
import DeleteIcon from '@material-ui/icons/Delete'
import EditIcon from '@material-ui/icons/Edit'

import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import Avatar from '@material-ui/core/Avatar'
import ImageIcon from '@material-ui/icons/Image'
import PeopleIcon from '@material-ui/icons/People'
import Person from '@material-ui/icons/Person'
import Button from '@material-ui/core/Button'
import { makeStyles } from '@material-ui/styles'

import Locationview from './Locationview'

import { database } from '../Firebase/index'

import { Search as SearchIcon } from 'react-feather'
import { addForm, getForm, delForm } from '../store/actions/UserFormAction'

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

  const [open, setOpen] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [designation, setDesignation] = useState('')
  const [salary, setSalary] = useState('')

  const handleClickOpen = () => {
    setOpen(true)
  }
  const handleClose = () => {
    setOpen(false)
  }

  const handleListItemClick = (event, index) => {
    setSelectedIndex(index)
  }

  const userInfo = sessionStorage.getItem('userInfo')
    ? JSON.parse(sessionStorage.getItem('userInfo'))
    : null

  const dispatch = useDispatch()
  const forms = useSelector((state) => state.forms)
  const { userForms } = forms

  let i = 0

  useEffect(() => {
    dispatch(getForm(userInfo.email))
  }, [])

  const submitHandler = async () => {
    if (phoneNumber !== '' && phoneNumber.length === 10) {
      const requestRef = database.ref(
        `trackerapp/trackingRequested/${phoneNumber}`
      )
      const acceptRef = database.ref(
        `trackerapp/trackingAccepted/${phoneNumber}`
      )
      const requestId = requestRef.push().key
      await requestRef
        .child(requestId)
        .set({
          companyName: userInfo.companyName,
          requestPending: true,
        })
        .then(() => {
          console.log(fullName, email, phoneNumber)
          dispatch(
            addForm(
              fullName,
              email,
              phoneNumber,
              designation,
              salary,
              userInfo.email,
              requestId
            )
          )
        })
        .then(() => {
          handleClose()
          setFullName('')
          setDesignation('')
          setEmail('')
          setPhoneNumber('')
          setSalary('')
        })
        .then(() => alert('Tracking request sent'))
        .catch((error) => console.log(error))

      await acceptRef
        .child(requestId)
        .set({
          requestAccepted: false,
        })
        .catch((error) => console.log(error))
    } else {
      alert('10 digit phone number is required')
    }
  }

  const handleUserDelete = (id, index) => {
    dispatch(delForm(id))
    setSelectedIndex(selectedIndex - 1)
  }

  console.log(userForms)

  return (
    <Box className={classes.root}>
      <Grid container sx={{ height: 'inherit' }}>
        {/* <Grid item xs={12} sx={{ pl: 2, pt: 2, pb: 2 }}>
          <Typography variant='h1' component='h2'>
            Dashboard
          </Typography>
        </Grid> */}
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
              />
            </Box>
            <List component='nav'>
              <ListItem>
                <ListItemAvatar>
                  <Avatar>
                    <PeopleIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText primary='Overview All Devices' />
              </ListItem>
              {userForms !== undefined &&
                userForms.map((item, index) => (
                  <ListItem
                    key={i++}
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
                          onClick={() => handleUserDelete(item._id, index)}
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
              <Button
                variant='contained'
                sx={{ marginRight: 2 }}
                onClick={handleClickOpen}
              >
                Add User
              </Button>
              <Button variant='outlined'>Logout</Button>
            </Stack>
          </Stack>
          <Box>
            {userForms !== undefined && userForms.length !== 0 && (
              <Locationview userForm={userForms[selectedIndex]} />
            )}
          </Box>
        </Grid>
      </Grid>
      <Dialog
        open={open}
        fullWidth
        maxWidth='sm'
        onClose={handleClose}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogTitle id='alert-dialog-title'>Create a new user</DialogTitle>
        <DialogContent>
          <TextField
            id='outlined-basic'
            fullWidth
            sx={{ mb: 2, mt: 4 }}
            label='Full Name'
            variant='outlined'
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
          <TextField
            id='outlined-basic'
            fullWidth
            sx={{ mb: 2 }}
            label='Email'
            variant='outlined'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            id='outlined-basic'
            fullWidth
            sx={{ mb: 2 }}
            label='Phone Number'
            variant='outlined'
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
          <TextField
            id='outlined-basic'
            fullWidth
            sx={{ mb: 2 }}
            label='Designation'
            variant='outlined'
            value={designation}
            onChange={(e) => setDesignation(e.target.value)}
          />
          <TextField
            id='outlined-basic'
            fullWidth
            sx={{ mb: 2 }}
            label='Salary'
            variant='outlined'
            value={salary}
            onChange={(e) => setSalary(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color='primary'>
            Close
          </Button>
          <Button onClick={submitHandler} color='primary' autoFocus>
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default Dashboard
