import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  ListItemText,
  MenuItem,
  Select,
  TextField,
} from '@mui/material'
import { updateDevice } from '../../store/actions/device'

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

const EditDeviceDialog = (props) => {
  const {
    setEditDialogOpen,
    editDialogOpen,
    selectedDevice,
    trackingGroups,
    setSnackOpen,
    setError,
  } = props

  const [newFullName, setNewFullName] = useState('')
  // const [newDeviceGroup, setNewDeviceGroup] = useState([])
  const [selectedGroups, setSelectedGroups] = useState([])
  const [selectedGroupsNames, setSelectedGroupsNames] = useState([])

  const dispatch = useDispatch()

  const handleChange = (event) => {
    const {
      target: { value },
    } = event
    setSelectedGroups(typeof value === 'string' ? value.split(',') : value)

    const arr = trackingGroups.filter((x) => value.includes(x._id))
    setSelectedGroupsNames(arr.map((x) => x.groupName))
  }

  useEffect(() => {
    if (Object.entries(selectedDevice).length !== 0) {
      setNewFullName(selectedDevice.fullName)
      const groups = selectedDevice.groups

      const arr = []
      groups.forEach((x) => arr.push(x._id))
      setSelectedGroups(arr)

      setSelectedGroupsNames(
        groups.filter((x) => arr.includes(x._id)).map((x) => x.groupName),
      )
    }
  }, [selectedDevice])

  const updateDetails = () => {
    if (newFullName.length === 0) {
      setError('Full name is required')
      setSnackOpen(true)
      return
    }
    const body = {
      _id: selectedDevice._id,
      fullName: newFullName,
      groups: selectedGroups,
    }

    dispatch(updateDevice(body))
    setNewFullName('')
    setSelectedGroups([])
    setEditDialogOpen(false)
  }

  return (
    <Dialog
      open={editDialogOpen}
      onClose={() => {
        setEditDialogOpen(false)
      }}
    >
      <DialogTitle sx={{ fontSize: 22 }}>Edit Device</DialogTitle>
      <DialogContent sx={{ width: 500 }}>
        <TextField
          autoFocus
          margin="dense"
          id="name"
          label="Full Name"
          type="text"
          fullWidth
          variant="outlined"
          value={newFullName}
          onChange={(e) => setNewFullName(e.target.value)}
        />
        <FormControl margin="normal" fullWidth variant="outlined">
          <InputLabel id="device-group">Select Group</InputLabel>
          <Select
            labelId="device-group"
            label="Select Group"
            value={selectedGroups}
            onChange={handleChange}
            multiple
            renderValue={() => selectedGroupsNames.join(', ')}
            MenuProps={MenuProps}
          >
            {trackingGroups.map((item) => (
              <MenuItem key={item._id} value={item._id}>
                <Checkbox checked={selectedGroups.indexOf(item._id) > -1} />
                <ListItemText primary={item.groupName} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
        <Button onClick={() => updateDetails()}>Save Changes</Button>
      </DialogActions>
    </Dialog>
  )
}

export default EditDeviceDialog
