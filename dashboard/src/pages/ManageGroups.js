import React, { useState } from 'react'
import { Alert, Box, Button, Snackbar, Stack } from '@mui/material'
import CreateGroupDialog from '../components/groups/CreateGroupDialog'
import GroupTable from '../components/groups/GroupTable'
import EditGroupDialog from '../components/groups/EditGroupDialog'

const ManageGroups = () => {
  const [createOpen, setCreateOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [selectedGroup, setSelectedGroup] = useState({})
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

      <Stack direction='row' justifyContent='flex-end' rowGap={2} columnGap={2}>
        <Button
          variant='contained'
          sx={{ py: 1.2 }}
          onClick={() => setCreateOpen(true)}
        >
          Create New Group
        </Button>
      </Stack>

      <Box sx={{ my: 5 }}>
        <GroupTable
          success={setSuccess}
          error={setError}
          open={setSnackOpen}
          setSelectedGroup={setSelectedGroup}
          setEditOpen={setEditOpen}
        />
      </Box>

      <Box>
        <CreateGroupDialog
          open={createOpen}
          setOpen={setCreateOpen}
          createdBy={{
            id: userData.uid,
            fullName: `${userData.firstName} ${userData.lastName}`,
          }}
          setError={setError}
          setSnackOpen={setSnackOpen}
          setSuccess={setSuccess}
        />
      </Box>

      <Box>
        <EditGroupDialog
          open={editOpen}
          setOpen={setEditOpen}
          selectedGroup={selectedGroup}
          setError={setError}
          setSnackOpen={setSnackOpen}
          setSuccess={setSuccess}
          createdBy={{
            id: userData.uid,
            fullName: `${userData.firstName} ${userData.lastName}`,
          }}
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
