import React, { useEffect, useState } from 'react'
import { Box, Button, Stack } from '@mui/material'
import AdminTable from '../components/admins/AdminTable'
import CreateAdminDialog from '../components/admins/CreateAdminDialog'
import { collection, onSnapshot, where, query } from 'firebase/firestore'
import { db } from '../Firebase/index'

const ManageAdmins = () => {
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [adminList, setAdminList] = useState([])

  const userData = sessionStorage.getItem('userData')
    ? JSON.parse(sessionStorage.getItem('userData'))
    : null

  useEffect(() => {
    const ref = collection(db, 'trackerAdmin')
    const q = query(ref, where('createdBy', '==', userData.uid))

    const unsub = onSnapshot(q, (snapshot) => {
      const adminArr = []
      snapshot.forEach((snap) => {
        adminArr.push({ ...snap.data(), id: snap.id })
      })

      setAdminList(adminArr)
    })

    return () => unsub()
  }, [])

  const handleCreateDialog = () => {
    if (showCreateDialog) {
      setShowCreateDialog(false)
    } else {
      setShowCreateDialog(true)
    }
  }

  return (
    <Box sx={{ p: 4 }}>
      <h2>Manage Admins</h2>

      <Stack direction='row' justifyContent='flex-end'>
        <Button
          variant='contained'
          sx={{ py: 1.2 }}
          onClick={handleCreateDialog}
        >
          Create Admin
        </Button>
      </Stack>

      <Box sx={{ my: 5 }}>
        <AdminTable adminList={adminList} />
      </Box>

      <Box>
        <CreateAdminDialog
          open={showCreateDialog}
          setOpen={setShowCreateDialog}
          createdBy={userData.uid}
        />
      </Box>
    </Box>
  )
}

export default ManageAdmins
