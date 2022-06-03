import React, { useEffect, useState } from 'react'
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
import {
  addDoc,
  collection,
  onSnapshot,
  query,
  where,
  doc,
  updateDoc,
  arrayUnion,
} from 'firebase/firestore'
import { db } from '../../Firebase'

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
  const [adminList, setAdminList] = useState([])
  const [selectedAdmins, setSelectedAdmins] = useState([])
  const [admins, setAdmins] = useState([])

  useEffect(() => {
    const ref = collection(db, 'trackerAdmin')
    const q = query(ref, where('createdBy', '==', props.createdBy.id))

    const unsub = onSnapshot(q, (snapshot) => {
      const adminArr = []
      snapshot.forEach((snap) => {
        adminArr.push({ fullName: snap.data().fullName, id: snap.id })
      })
      adminArr.push({
        fullName: props.createdBy.fullName,
        id: props.createdBy.id,
      })

      setAdminList(adminArr)
    })

    return () => unsub()
  }, [])

  const createGroup = async () => {
    if (groupName.length < 3) {
      props.setError('Group Name length must be atleast 3')
      props.setSnackOpen(true)
      return
    } else if (admins.length === 0) {
      props.setError('Select atleast one admin')
      props.setSnackOpen(true)
      return
    }

    const groupRef = collection(db, 'trackingGroups')
    addDoc(groupRef, {
      groupName: groupName,
      createdBy: props.createdBy.id,
      members: [],
      hotspot: [],
      admins: admins,
    })
      .then((res) => {
        const data = { groupName: groupName, id: res.id }
        selectedAdmins.forEach(async (id) => {
          const ref = doc(db, 'trackerAdmin', id)
          await updateDoc(ref, {
            groups: arrayUnion(data),
          }).catch((err) => {
            props.setError(err.message)
            props.setSnackOpen(true)
          })
        })
      })
      .then(() => {
        props.setSuccess('Group Created')
        props.setSnackOpen(true)
      })
      .catch((err) => {
        props.setError(err.message)
        props.setSnackOpen(true)
      })

    props.setOpen(false)
    setGroupName('')
  }

  useEffect(() => {
    const arr = []
    selectedAdmins.forEach((x) => {
      const d = adminList.filter((item) => item.id === x)[0]
      const data = {
        fullName: d.fullName,
        id: d.id,
      }
      arr.push(data)
    })

    setAdmins(arr)
  }, [selectedAdmins])

  const handleChange = (event) => {
    const {
      target: { value },
    } = event
    setSelectedAdmins(typeof value === 'string' ? value.split(',') : value)
  }

  console.log(admins)

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
              <MenuItem key={item.id} value={item.id}>
                <Checkbox checked={selectedAdmins.indexOf(item.id) > -1} />
                <ListItemText primary={item.fullName} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => props.setOpen(false)}>Cancel</Button>
        <Button onClick={() => createGroup()}>Create</Button>
      </DialogActions>
    </Dialog>
  )
}

export default React.memo(CreateGroupDialog)
