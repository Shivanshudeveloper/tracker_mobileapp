import React, { useEffect, useState } from 'react'
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Chip,
  DialogActions,
  DialogContent,
  Dialog,
  DialogTitle,
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import Create from '@mui/icons-material/Create'
import { db } from '../../Firebase/index'
import {
  arrayRemove,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore'
import TimeRangePicker from '@wojtekmaj/react-timerange-picker'
import { useSelector, useDispatch } from 'react-redux'
import { deleteDevice } from '../../store/actions/device'

const DeviceSetting = (props) => {
  const { success, error, open, toggleEditDeviceDialog } = props

  const [deviceData, setDeviceData] = useState([])

  const userData = sessionStorage.getItem('userData')
    ? JSON.parse(sessionStorage.getItem('userData'))
    : null

  const adminData = sessionStorage.getItem('adminData')
    ? JSON.parse(sessionStorage.getItem('adminData'))
    : null

  const devices = useSelector((state) => state.devices)
  const { deviceList } = devices

  const dispatch = useDispatch()

  // useEffect(async () => {
  //   if (userData !== null) {
  //     const deviceRef = collection(db, 'trackingUsers')
  //     let q
  //     if (adminData !== null) {
  //       q = query(
  //         deviceRef,
  //         where('senderId', '==', userData.uid),
  //         where('groupId', 'array-contains-any', adminData.groupId),
  //       )
  //     } else {
  //       q = query(deviceRef, where('senderId', '==', userData.uid))
  //     }

  //     const unsub = onSnapshot(q, (snapshot) => {
  //       const devices = []
  //       snapshot.forEach((snap) => {
  //         devices.push({ ...snap.data(), id: snap.id })
  //       })
  //       setDeviceData(devices)
  //     })

  //     return () => unsub()
  //   }
  // }, [])

  const removeDevice = (data) => {
    dispatch(deleteDevice(data._id))
  }

  // const deleteDevice = async (item) => {
  //   const requestRef = doc(db, 'trackingRequest', item.phoneNumber)
  //   await deleteDoc(requestRef)
  //     .then(() => {
  //       item.deviceGroups.forEach(({ id }) => {
  //         const groupRef = doc(db, 'trackingGroups', id)
  //         updateDoc(groupRef, {
  //           members: arrayRemove(item.phoneNumber),
  //         }).catch((error) => console.log(error))
  //       })
  //     })
  //     .then(async () => {
  //       const deviceRef = doc(db, 'trackingUsers', item.id)
  //       await deleteDoc(deviceRef)
  //         .then(() => {
  //           success('Device Deleted Successfully')
  //           open(true)
  //         })
  //         .catch((err) => {
  //           error(err.message)
  //           open(true)
  //         })
  //     })
  //     .catch((err) => console.log(err.message))
  // }

  return (
    <Box>
      <TableContainer component={Paper} sx={{ boxShadow: 6 }}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell align="center">Mobile Number</TableCell>
              <TableCell align="center">Groups Added</TableCell>
              <TableCell align="center">Tracking Status</TableCell>
              <TableCell align="center">Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {deviceList.map((data) => (
              <TableRow
                key={data._id}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {data.fullName}
                </TableCell>
                <TableCell align="center">+91 {data.phoneNumber}</TableCell>
                {data.groups.length === 0 ? (
                  <TableCell align="center">--</TableCell>
                ) : (
                  <TableCell align="center">
                    {data.groups.map((x, i) => (
                      <>
                        {x.groupName}
                        {i !== data.groups.length - 1 && <>{' ,'}</>}
                      </>
                    ))}
                  </TableCell>
                )}

                <TableCell align="center">
                  {data.trackingStatus === 'accepted' && (
                    <Chip label="Accepted" color="success" />
                  )}
                  {data.trackingStatus === 'rejected' && (
                    <Chip label="Rejected" color="error" />
                  )}
                  {data.trackingStatus === 'pending' && (
                    <Chip label="Pending" color="warning" />
                  )}
                </TableCell>
                <TableCell align="center" sx={{ p: 0 }}>
                  <IconButton
                    edge="end"
                    aria-label="edit"
                    color="primary"
                    onClick={() => toggleEditDeviceDialog(data)}
                  >
                    <Create />
                  </IconButton>
                  <IconButton color="error" onClick={() => removeDevice(data)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  )
}

export default React.memo(DeviceSetting)
