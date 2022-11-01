import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'
import { Alert, Box, Button, Snackbar, Stack } from '@mui/material'
import CreateGroupDialog from '../components/groups/CreateGroupDialog'
import GroupTable from '../components/groups/GroupTable'
import EditGroupDialog from '../components/groups/EditGroupDialog'
import { useSubscription } from '../hooks/useSubscription'
import { getSubscriptionDetails } from '../utils/getSubscriptionDetails'
import { useSelector } from 'react-redux'

const ManageGroups = () => {
    const [createOpen, setCreateOpen] = useState(false)
    const [editOpen, setEditOpen] = useState(false)
    const [selectedGroup, setSelectedGroup] = useState({})
    const [snackOpen, setSnackOpen] = useState(false)
    const [successMsg, setSuccessMsg] = useState(null)
    const [errorMsg, setErrorMsg] = useState(null)

    // subscription state
    const [subscription, setSubscription] = useState(null)

    const userData = localStorage.getItem('userData')
        ? JSON.parse(localStorage.getItem('userData'))
        : null

    const groups = useSelector((state) => state.groups)
    const { groupList } = groups
    let { success, error } = groups

    const { state } = useSubscription()

    useEffect(() => {
        const fetchSubDetail = async () => {
            const details = await getSubscriptionDetails(state)
            setSubscription(details)
        }

        fetchSubDetail()
    }, [])

    useEffect(() => {
        success = null
        error = null
    }, [])

    useEffect(() => {
        if (success) {
            setSuccessMsg(success)
            setSnackOpen(true)
        } else if (error) {
            setErrorMsg(error)
            setSnackOpen(true)
        }
    }, [success, error])

    const handleSnackClose = () => {
        setSnackOpen(false)
        success = null
        error = null
        setSuccessMsg(null)
        setErrorMsg(null)
    }

    return (
        <Box sx={{ p: 4 }}>
            <h2>Manage Groups</h2>

            <Stack
                direction='row'
                justifyContent='flex-end'
                rowGap={2}
                columnGap={2}
            >
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
                    success={setSuccessMsg}
                    error={setErrorMsg}
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
                        id: userData?.uid,
                        fullName: `${userData?.firstName} ${userData?.lastName}`,
                    }}
                    subscription={subscription}
                    setError={setErrorMsg}
                    setSnackOpen={setSnackOpen}
                    setSuccess={setSuccessMsg}
                    groupList={groupList}
                />
            </Box>

            <Box>
                <EditGroupDialog
                    open={editOpen}
                    setOpen={setEditOpen}
                    selectedGroup={selectedGroup}
                    setError={setErrorMsg}
                    setSnackOpen={setSnackOpen}
                    setSuccess={setSuccessMsg}
                    createdBy={{
                        id: userData?.uid,
                        fullName: `${userData?.firstName} ${userData?.lastName}`,
                    }}
                    subscription={subscription}
                />
            </Box>

            {successMsg && (
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
                        {successMsg}
                    </Alert>
                </Snackbar>
            )}
            {errorMsg && (
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
                        {errorMsg}
                    </Alert>
                </Snackbar>
            )}
        </Box>
    )
}

export default ManageGroups
