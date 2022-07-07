import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  Select,
  TextField,
  Checkbox,
  ListItemText,
  MenuItem,
} from '@mui/material'
import {
  addDoc,
  collection,
  onSnapshot,
  query,
  where,
  doc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  Timestamp,
} from 'firebase/firestore'
import { db } from '../../Firebase'
import ScheduleForm from './ScheduleForm'
import { updateGroup } from '../../store/actions/group'

const ITEM_HEIGHT = 48
const ITEM_PADDING_TOP = 8
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
}

const EditGroupDialog = (props) => {
  const [groupName, setGroupName] = useState('')
  // const [adminList, setAdminList] = useState([])
  const [selectedAdmins, setSelectedAdmins] = useState([])
  // const [admins, setAdmins] = useState([])

  const [startDay, setStartDay] = useState('Sunday')
  const [endDay, setEndDay] = useState('Saturday')
  const [time, setTime] = useState(['10:00', '11:00'])

  const admins = useSelector((state) => state.admins)
  const { adminList } = admins

  const dispatch = useDispatch()

  // useEffect(() => {
  //   const ref = collection(db, 'trackerAdmin')
  //   const q = query(ref, where('createdBy', '==', props.createdBy.id))

  //   const unsub = onSnapshot(q, (snapshot) => {
  //     const adminArr = []
  //     snapshot.forEach((snap) => {
  //       adminArr.push({ fullName: snap.data().fullName, id: snap.id })
  //     })

  //     setAdminList(adminArr)
  //   })

  //   return () => unsub()
  // }, [])

  useEffect(() => {
    if (Object.keys(props.selectedGroup).length !== 0) {
      setGroupName(props.selectedGroup.groupName)
      setStartDay(props.selectedGroup.schedule.startDay)
      setEndDay(props.selectedGroup.schedule.endDay)
      setTime([
        props.selectedGroup.schedule.time.startTime,
        props.selectedGroup.schedule.time.endTime,
      ])

      const arr = props.selectedGroup.admins.map((x) => x._id)
      setSelectedAdmins(arr)
    }
  }, [props.selectedGroup])

  // useEffect(() => {
  //   const arr = []
  //   selectedAdmins.forEach((x) => {
  //     const d = adminList.filter((item) => item.id === x)[0]

  //     const data = {
  //       fullName: d.fullName,
  //       id: d.id,
  //     }
  //     arr.push(data)
  //   })

  //   setAdmins(arr)
  // }, [selectedAdmins])

  const handleChange = (event) => {
    const {
      target: { value },
    } = event
    setSelectedAdmins(typeof value === 'string' ? value.split(',') : value)
  }

  const updateDetails = () => {
    if (groupName.length < 3) {
      props.setError('Group Name length must be atleast 3')
      props.setSnackOpen(true)
      return
    } else if (admins.length === 0) {
      props.setError('Select atleast one admin')
      props.setSnackOpen(true)
      return
    }

    const body = {
      _id: props.selectedGroup._id,
      groupName,
      admins: selectedAdmins,
      schedule: {
        startDay,
        endDay,
        time: {
          startTime: time[0],
          endTime: time[1],
        },
      },
    }

    dispatch(updateGroup(body))
    props.setOpen(false)
    setGroupName('')
    setSelectedAdmins([])
    setStartDay('Sunday')
    setEndDay('Sunday')
    setTime(['10:00', '11:00'])
  }

  // const updateGroup = async () => {
  //   if (groupName.length < 3) {
  //     props.setError('Group Name length must be atleast 3')
  //     props.setSnackOpen(true)
  //     return
  //   } else if (admins.length === 0) {
  //     props.setError('Select atleast one admin')
  //     props.setSnackOpen(true)
  //     return
  //   }

  //   const groupRef = doc(db, 'trackingGroups', props.selectedGroup.id)
  //   await updateDoc(groupRef, {
  //     groupName: groupName,
  //     admins: admins,
  //     schedule: {
  //       startDay,
  //       endDay,
  //       time: {
  //         startTime: time[0],
  //         endTime: time[1],
  //       },
  //     },
  //     modifiedAt: Timestamp.now(),
  //   })
  //     .then(() => {
  //       const oldAdmins = props.selectedGroup.admins

  //       oldAdmins.forEach(async ({ id }) => {
  //         const adminRef = doc(db, 'trackerAdmin', id)
  //         await updateDoc(adminRef, {
  //           groups: arrayRemove({
  //             groupName: props.selectedGroup.groupName,
  //             id: props.selectedGroup.id,
  //           }),
  //           groupId: arrayRemove(props.selectedGroup.id),
  //         }).catch((error) => console.log(error))
  //       })

  //       selectedAdmins.forEach(async (id) => {
  //         const ref = doc(db, 'trackerAdmin', id)
  //         await updateDoc(ref, {
  //           groups: arrayUnion({
  //             groupName,
  //             id: props.selectedGroup.id,
  //           }),
  //           groupId: arrayUnion(props.selectedGroup.id),
  //         }).catch((err) => {
  //           props.setError(err.message)
  //           props.setSnackOpen(true)
  //         })
  //       })
  //     })
  //     .then(() => {
  //       setSelectedAdmins([])
  //       props.setSuccess('Group Updated')
  //       props.setSnackOpen(true)
  //     })
  //     .catch((err) => {
  //       props.setError(err.message)
  //       props.setSnackOpen(true)
  //     })

  //   props.setOpen(false)
  //   setGroupName('')
  //   setStartDay('Sunday')
  //   setEndDay('Sunday')
  //   setTime(['10:00', '11:00'])
  // }

  return (
    <Dialog open={props.open} onClose={() => props.setOpen(false)}>
      <DialogTitle sx={{ fontSize: 22 }}>Edit Group Details</DialogTitle>
      <DialogContent sx={{ width: 500 }}>
        <TextField
          autoFocus
          margin="normal"
          id="groupName"
          label="Group Name"
          type="text"
          fullWidth
          variant="outlined"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
        />

        <FormControl margin="normal" fullWidth variant="outlined">
          <InputLabel id="admin">Select Admin</InputLabel>
          <Select
            labelId="admin"
            label="Select Admin"
            value={selectedAdmins}
            onChange={handleChange}
            multiple
            renderValue={(selected) => selected.join(', ')}
            MenuProps={MenuProps}
          >
            {adminList.map((item) => (
              <MenuItem key={item._id} value={item._id}>
                <Checkbox checked={selectedAdmins.indexOf(item._id) > -1} />
                <ListItemText primary={item.fullName} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <ScheduleForm
          startDay={startDay}
          endDay={endDay}
          setStartDay={setStartDay}
          setEndDay={setEndDay}
          time={time}
          setTime={setTime}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={() => props.setOpen(false)}>Cancel</Button>
        <Button onClick={() => updateDetails()}>Update</Button>
      </DialogActions>
    </Dialog>
  )
}

export default React.memo(EditGroupDialog)
