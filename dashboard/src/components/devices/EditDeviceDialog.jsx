import React, { useEffect, useState } from 'react'
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
import { db } from '../../Firebase/index'
import { arrayRemove, arrayUnion, doc, updateDoc } from 'firebase/firestore'

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
    setSuccess,
    setSnackOpen,
    setError,
  } = props

  const [newFullName, setNewFullName] = useState('')
  const [newDeviceGroup, setNewDeviceGroup] = useState([])
  const [selectedGroups, setSelectedGroups] = useState([])

  const handleChange = (event) => {
    const {
      target: { value },
    } = event
    setSelectedGroups(typeof value === 'string' ? value.split(',') : value)
  }

  useEffect(() => {
    if (Object.entries(selectedDevice).length !== 0) {
      setNewFullName(selectedDevice.fullName)
      const groups = selectedDevice.deviceGroups

      const arr = []
      groups.forEach((x) => arr.push(x.id))
      setSelectedGroups(arr)
    }
  }, [selectedDevice])

  useEffect(() => {
    const arr = []
    selectedGroups.forEach((x) => {
      console.log(x)
      const d = trackingGroups.filter((item) => item.id === x)[0]
      const data = {
        groupName: d.groupName,
        id: d.id,
      }
      arr.push(data)
    })

    setNewDeviceGroup(arr)
  }, [selectedGroups])

  const updateDevice = () => {
    const deviceRef = doc(db, 'trackingUsers', selectedDevice.id)
    updateDoc(deviceRef, {
      fullName: newFullName,
      deviceGroups: newDeviceGroup,
    })
      .then(() => {
        selectedDevice.deviceGroups.forEach(({ id }) => {
          const groupRef = doc(db, 'trackingGroups', id)
          updateDoc(groupRef, {
            members: arrayRemove(selectedDevice.phoneNumber),
          }).catch((error) => console.log(error))
        })

        selectedGroups.forEach((id) => {
          const groupRef = doc(db, 'trackingGroups', id)
          updateDoc(groupRef, {
            members: arrayRemove(selectedDevice.phoneNumber),
          }).catch((error) => console.log(error))
          updateDoc(groupRef, {
            members: arrayUnion(selectedDevice.phoneNumber),
          }).catch((error) => console.log(error))
        })
      })
      .then(() => {
        setSuccess('Details Updated Successfully')
        setSnackOpen(true)
        setEditDialogOpen(false)
      })
      .catch((error) => {
        setError(error.message)
        setSnackOpen(true)
      })
  }

  return (
    <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)}>
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
            renderValue={(selected) => selected.join(', ')}
            MenuProps={MenuProps}
          >
            {trackingGroups.map((item) => (
              <MenuItem key={item.id} value={item.id}>
                <Checkbox checked={selectedGroups.indexOf(item.id) > -1} />
                <ListItemText primary={item.groupName} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
        <Button onClick={() => updateDevice()}>Save Changes</Button>
      </DialogActions>
    </Dialog>
  )
}

export default EditDeviceDialog
