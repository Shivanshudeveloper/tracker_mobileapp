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

const DeviceSetting = (props) => {
  const { success, error, open, toggleEditDeviceDialog } = props

  const [deviceData, setDeviceData] = useState([])

  const userData = sessionStorage.getItem('userData')
    ? JSON.parse(sessionStorage.getItem('userData'))
    : null

  useEffect(async () => {
    if (userData !== null) {
      const deviceRef = collection(db, 'trackingUsers')
      const q = query(deviceRef, where('senderId', '==', userData.uid))

      const unsub = onSnapshot(q, (snapshot) => {
        const devices = []
        snapshot.forEach((snap) => {
          devices.push({ data: snap.data(), id: snap.id })
        })
        setDeviceData(devices)
      })

      return () => unsub()
    }
  }, [])

  // useEffect(() => {
  //   const ref = doc(db, 'trackingSchedule', userData.uid)
  //   const unsub = onSnapshot(ref, (snapshot) => {
  //     if (snapshot.exists()) {
  //       const data = snapshot.data()
  //       setSchedule(data)
  //       setStartDay(data.startDay)
  //       setEndDay(data.endDay)
  //       setTime([data.time.startTime, data.time.endTime])
  //     }
  //   })

  //   return () => unsub()
  // }, [])

  const deleteDevice = async (item, deviceId) => {
    const requestRef = doc(db, 'trackingRequest', item.phoneNumber)
    await deleteDoc(requestRef)
      .then(() => {
        item.deviceGroups.forEach(({ id }) => {
          const groupRef = doc(db, 'trackingGroups', id)
          updateDoc(groupRef, {
            members: arrayRemove(item.phoneNumber),
          }).catch((error) => console.log(error))
        })
      })
      .then(async () => {
        const deviceRef = doc(db, 'trackingUsers', deviceId)
        await deleteDoc(deviceRef)
          .then(() => {
            success('Device Deleted Successfully')
            open(true)
          })
          .catch((err) => {
            error(err.message)
            open(true)
          })
      })
      .catch((err) => console.log(err.message))
  }

  return (
    <Box>
      <TableContainer component={Paper} sx={{ boxShadow: 6 }}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
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
            {deviceData.map(({ data, id }) => (
              <TableRow
                key={id}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell>{data.fullName}</TableCell>
                <TableCell align="center">+91 {data.phoneNumber}</TableCell>
                <TableCell align="center">
                  {data.deviceGroups.length === 0 && <>---</>}
                  {data.deviceGroups.map((x, i) => (
                    <div key={i}>
                      <Typography variant="p" component="p">
                        {x.groupName}
                        {i !== data.deviceGroups.length - 1 && <>{' , '}</>}
                      </Typography>
                    </div>
                  ))}
                </TableCell>

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
                  <IconButton
                    color="error"
                    onClick={() => deleteDevice(data, id)}
                  >
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
