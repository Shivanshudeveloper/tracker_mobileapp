import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  ListItemText,
  Checkbox,
} from '@mui/material'
import ScheduleForm from './ScheduleForm'
import { createGroup } from '../../store/actions/group'

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

const CreateGroupDialog = (props) => {
  const [groupName, setGroupName] = useState('')
  //const [adminList, setAdminList] = useState([])
  const [selectedAdmins, setSelectedAdmins] = useState([])
  const [selectedAdminsNames, setSelectedAdminsNames] = useState([])

  const [startDay, setStartDay] = useState('Sunday')
  const [endDay, setEndDay] = useState('Sunday')
  const [time, setTime] = useState({
    startTime: new Date(),
    endTime: new Date(),
  })

  const dispatch = useDispatch()
  const admins = useSelector((state) => state.admins)
  const adminList = admins.adminList

  const saveGroup = () => {
    if (props.subscription === null) {
      props.setError('You do not have any subscription. Please choose a plan')
      props.setSnackOpen(true)
      return
    } else if (props.groupList.length === props.subscription.groupCount) {
      props.setError(
        'You have used your groups quota. Please upgrade your subscription',
      )
      props.setSnackOpen(true)
      return
    } else if (groupName.length < 4) {
      props.setError('Group name must be atleast 4 characters')
      props.setSnackOpen(true)
      return
    }

    const body = {
      groupName: groupName,
      createdBy: props.createdBy.id,
      members: [],
      hotspot: [],
      admins: selectedAdmins,
      schedule: {
        startDay,
        endDay,
        time: time,
      },
    }
    dispatch(createGroup(body))
    props.setOpen(false)
    setSelectedAdmins([])
    setGroupName('')
    setStartDay('')
    setEndDay('')
    setTime({ startTime: new Date(), endTime: new Date() })
  }

  const handleChange = (event) => {
    const {
      target: { value },
    } = event
    setSelectedAdmins(typeof value === 'string' ? value.split(',') : value)

    const arr = adminList.filter((x) => value.includes(x._id))
    setSelectedAdminsNames(arr.map((x) => x.fullName))
  }

  const handleClose = () => {
    setSelectedAdmins([])
    setGroupName('')
    setStartDay('')
    setEndDay('')
    setTime({ startTime: new Date(), endTime: new Date() })
    props.setOpen(false)
  }

  return (
    <Dialog open={props.open} onClose={() => props.setOpen(false)}>
      <DialogTitle sx={{ fontSize: 22 }}>Add New Group</DialogTitle>
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
        {props.subscription !== null &&
          props.subscription.groupCount === Number.MAX_VALUE && (
            <FormControl margin="normal" fullWidth variant="outlined">
              <InputLabel id="admin">Select Admin</InputLabel>
              <Select
                labelId="admin"
                label="Select Admin"
                value={selectedAdmins}
                onChange={handleChange}
                multiple
                renderValue={() => selectedAdminsNames.join(', ')}
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
          )}

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
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={() => saveGroup()}>Create</Button>
      </DialogActions>
    </Dialog>
  )
}

export default React.memo(CreateGroupDialog)
