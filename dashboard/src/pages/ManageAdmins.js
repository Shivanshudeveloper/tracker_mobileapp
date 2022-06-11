import React, { useEffect, useState } from 'react'
import { Alert, Box, Button, Snackbar, Stack } from '@mui/material'
import AdminTable from '../components/admins/AdminTable'
import CreateAdminDialog from '../components/admins/CreateAdminDialog'
import {
  collection,
  onSnapshot,
  where,
  query,
  orderBy,
} from 'firebase/firestore'
import { db } from '../Firebase/index'
import EditAdminDialog from '../components/admins/EditAdminDialog'

const ManageAdmins = () => {
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [selectedAdmin, setSelectedAdmin] = useState({})
  const [adminList, setAdminList] = useState([])
  const [snackOpen, setSnackOpen] = useState(false)
  const [success, setSuccess] = useState(null)
  const [error, setError] = useState(null)

  const userData = sessionStorage.getItem('userData')
    ? JSON.parse(sessionStorage.getItem('userData'))
    : null

  useEffect(() => {
    const ref = collection(db, 'trackerAdmin')
    const q = query(
      ref,
      where('createdBy', '==', userData.uid),
      orderBy('createdAt', 'desc')
    )

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

  const handleSnackClose = (event, reason) => {
    if (reason === 'clickaway') {
      return
    }

    setSnackOpen(false)
    setError(null)
    setSuccess(null)
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
        <AdminTable
          adminList={adminList}
          setSelectedAdmin={setSelectedAdmin}
          setShowEditDialog={setShowEditDialog}
        />
      </Box>

      <Box>
        <CreateAdminDialog
          open={showCreateDialog}
          setOpen={setShowCreateDialog}
          createdBy={userData.uid}
          setSnackOpen={setSnackOpen}
          success={setSuccess}
          error={setError}
        />
      </Box>

      <Box>
        <EditAdminDialog
          open={showEditDialog}
          setOpen={setShowEditDialog}
          createdBy={userData.uid}
          setSnackOpen={setSnackOpen}
          selectedAdmin={selectedAdmin}
          success={setSuccess}
          error={setError}
        />
      </Box>

      {success !== null && (
        <Snackbar
          open={snackOpen}
          autoHideDuration={4000}
          onClose={handleSnackClose}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <Alert
            onClose={handleSnackClose}
            severity='success'
            sx={{ width: '100%' }}
            variant='filled'
          >
            {success}
          </Alert>
        </Snackbar>
      )}
      {error !== null && (
        <Snackbar
          open={snackOpen}
          autoHideDuration={4000}
          onClose={handleSnackClose}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <Alert
            onClose={handleSnackClose}
            severity='error'
            sx={{ width: '100%' }}
            variant='filled'
          >
            {error}
          </Alert>
        </Snackbar>
      )}
    </Box>
  )
}

export default ManageAdmins
