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
} from '@material-ui/core'
import DeleteIcon from '@material-ui/icons/Delete'
import Create from '@material-ui/icons/Create'
import { db } from '../../Firebase/index'
import {
  arrayRemove,
  collection,
  deleteDoc,
  doc,
  getDoc,
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
  const [schedule, setSchedule] = useState({})
  const [startDay, setStartDay] = useState('Sunday')
  const [endDay, setEndDay] = useState('Saturday')
  const [time, setTime] = useState(['10:00', '11:00'])
  const [trackingStatus, setTrackingStatus] = useState([])

  const week = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ]

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
        const statusArr = []
        devices.forEach(async (device) => {
          await getStatus(device)
            .then((data) => {
              statusArr.push(data)
            })
            .then(() => {
              setTrackingStatus([...statusArr])
            })
        })
      })

      return () => unsub()
    }
  }, [])

  useEffect(() => {
    const ref = doc(db, 'trackingSchedule', userData.uid)
    const unsub = onSnapshot(ref, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data()
        setSchedule(data)
        setStartDay(data.startDay)
        setEndDay(data.endDay)
        setTime([data.time.startTime, data.time.endTime])
      }
    })

    return () => unsub()
  }, [])

  const getStatus = (device) => {
    return new Promise(async (resolve) => {
      const ref = doc(db, 'trackingRequest', device.data.phoneNumber)
      const snap = await getDoc(ref)
      if (snap.exists()) {
        const list = snap.data().requestList
        const data = list.filter((x) => x.senderId === userData.uid)
        if (data.length !== 0) {
          const status = data[0].requestStatus
          resolve({ status, phoneNumber: device.data.phoneNumber })
        } else {
          resolve({ status: '---', phoneNumber: device.data.phoneNumber })
        }
      } else {
        resolve({ status: '---', phoneNumber: device.data.phoneNumber })
      }
    })
  }

  const saveSchedule = () => {
    console.log(startDay, endDay, time)
    const ref = doc(db, 'trackingSchedule', userData.uid)

    setDoc(
      ref,
      {
        startDay,
        endDay,
        time: {
          startTime: time[0],
          endTime: time[1],
        },
      },
      { merge: true }
    )
      .then(() => {
        success('Scheduled Saved Successfully')
        open(true)
      })
      .catch((err) => {
        error(err.message)
        open(true)
      })
  }

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

  const fetchStatus = (phoneNumber) => {
    let res = ''

    const arr = trackingStatus.filter((x) => x.phoneNumber === phoneNumber)

    if (arr[0] !== undefined) {
      res = arr[0].status
    } else {
      res = '---'
    }

    return res
  }

  return (
    <Box>
      <Box
        sx={{
          mb: 3,
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'flex-end',
          flexWrap: 'wrap',
        }}
      >
        <Box
          sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}
        >
          <FormControl variant='outlined' sx={{ m: 1, minWidth: 200 }}>
            <InputLabel id='Start Day'>Start Day</InputLabel>
            <Select
              labelId='Start Day'
              value={startDay}
              onChange={(e) => setStartDay(e.target.value)}
              label='Start Day'
            >
              {week.map((day, i) => (
                <MenuItem key={i} value={day} sx={{ p: 1.2 }}>
                  {day}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl variant='outlined' sx={{ m: 1, minWidth: 200 }}>
            <InputLabel id='End Day'>End Day</InputLabel>
            <Select
              labelId='Emd Day'
              value={endDay}
              onChange={(e) => setEndDay(e.target.value)}
              label='End Day'
            >
              {week.slice(week.indexOf(startDay)).map((day, i) => (
                <MenuItem key={i} value={day} sx={{ p: 1.2 }}>
                  {day}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Box sx={{ height: '58px', display: 'flex', ml: 1, mr: 2 }}>
            <TimeRangePicker
              disableClock={true}
              onChange={setTime}
              value={time}
              rangeDivider='-- to --'
            />
          </Box>

          <Button
            onClick={saveSchedule}
            variant='contained'
            sx={{ py: 1.8, px: 5, fontSize: 16 }}
          >
            Save
          </Button>
        </Box>
      </Box>
      <TableContainer component={Paper} sx={{ boxShadow: 6 }}>
        <Table sx={{ minWidth: 650 }} aria-label='simple table'>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell align='center'>Mobile Number</TableCell>
              <TableCell align='center'>Groups Added</TableCell>
              <TableCell align='center'>Tracking Schedule</TableCell>
              <TableCell align='center'>Tracking Status</TableCell>
              <TableCell align='center'>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {deviceData.map(({ data, id }) => (
              <TableRow
                key={id}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell>{data.fullName}</TableCell>
                <TableCell align='center'>{data.phoneNumber}</TableCell>
                <TableCell align='center'>
                  {data.deviceGroups.length === 0 && <>---</>}
                  {data.deviceGroups.map((x, i) => (
                    <div key={i}>
                      <Typography variant='p' component='p'>
                        {x.groupName}
                        {i !== data.deviceGroups.length - 1 && <>{' , '}</>}
                      </Typography>
                    </div>
                  ))}
                </TableCell>
                {Object.entries(schedule).length !== 0 ? (
                  <TableCell align='center'>
                    {`${schedule.startDay} to ${schedule.endDay} , ${schedule.time.startTime} to ${schedule.time.endTime}`}
                  </TableCell>
                ) : (
                  <TableCell align='center'>---</TableCell>
                )}

                <TableCell align='center'>
                  {fetchStatus(data.phoneNumber) === 'accepted' && (
                    <Chip label='Accepted' color='success' />
                  )}
                  {fetchStatus(data.phoneNumber) === 'rejected' && (
                    <Chip label='Rejected' color='error' />
                  )}
                  {fetchStatus(data.phoneNumber) === 'pending' && (
                    <Chip label='Pending' color='warning' />
                  )}
                </TableCell>
                <TableCell align='center' sx={{ p: 0 }}>
                  <IconButton
                    edge='end'
                    aria-label='edit'
                    color='primary'
                    onClick={() => toggleEditDeviceDialog(data)}
                  >
                    <Create />
                  </IconButton>
                  <IconButton
                    color='error'
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

export default DeviceSetting
