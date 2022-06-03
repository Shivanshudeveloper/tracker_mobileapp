import React, { useState } from 'react'
import { Alert, Box, Button, Snackbar, Stack } from '@mui/material'
import CreateGroupDialog from '../components/groups/CreateGroupDialog'
import GroupTable from '../components/groups/GroupTable'

const ManageGroups = () => {
  const [open, setOpen] = useState(false)
  const [snackOpen, setSnackOpen] = useState(false)
  const [success, setSuccess] = useState(null)
  const [error, setError] = useState(null)

  const userData = sessionStorage.getItem('userData')
    ? JSON.parse(sessionStorage.getItem('userData'))
    : null

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
      <h2>Manage Groups</h2>

      <Stack direction='row' justifyContent='flex-end'>
        <Button
          variant='contained'
          sx={{ py: 1.2 }}
          onClick={() => setOpen(true)}
        >
          Create New Group
        </Button>
      </Stack>

      <Box sx={{ my: 5 }}>
        <GroupTable success={setSuccess} error={setError} open={setSnackOpen} />
      </Box>

      <Box>
        <CreateGroupDialog
          open={open}
          setOpen={setOpen}
          createdBy={{
            id: userData.uid,
            fullName: `${userData.firstName} ${userData.lastName}`,
          }}
          setError={setError}
          setSnackOpen={setSnackOpen}
          setSuccess={setSuccess}
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

export default ManageGroups
