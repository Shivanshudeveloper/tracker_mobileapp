import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { useSelector, useDispatch } from 'react-redux'
import { Alert, Box, Button, Snackbar, Stack } from '@mui/material'
import AdminTable from '../components/admins/AdminTable'
import CreateAdminDialog from '../components/admins/CreateAdminDialog'
import EditAdminDialog from '../components/admins/EditAdminDialog'
import { getAdmins } from '../store/actions/admin'
import { useSubscription } from '../hooks/useSubscription'
import { getSubscriptionDetails } from '../utils/getSubscriptionDetails'

const ManageAdmins = () => {
    const [showCreateDialog, setShowCreateDialog] = useState(false)
    const [showEditDialog, setShowEditDialog] = useState(false)
    const [selectedAdmin, setSelectedAdmin] = useState({})
    //const [adminList, setAdminList] = useState([])
    const [snackOpen, setSnackOpen] = useState(false)
    const [successMsg, setSuccess] = useState(null)
    const [errorMsg, setError] = useState(null)
    // subscription state
    const [subscription, setSubscription] = useState(null)

    const authToken = localStorage.getItem('authToken')
    const userData = localStorage.getItem('userData')
        ? JSON.parse(localStorage.getItem('userData'))
        : null

    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { state } = useSubscription()

    const admins = useSelector((state) => state.admins)
    const { adminList, success, error } = admins

    useEffect(() => {
        const fetchSubDetail = async () => {
            const details = await getSubscriptionDetails(state)
            setSubscription(details)
        }

        fetchSubDetail()
    }, [])

    useEffect(() => {
        if (userData !== null) {
            dispatch(getAdmins(userData.uid))
        }
    }, [dispatch])

    const handleCreateDialog = () => {
        if (showCreateDialog) {
            setShowCreateDialog(false)
        } else {
            setShowCreateDialog(true)
        }
    }

    const handleSnackClose = (_, reason) => {
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
                    setSelectedAdmin={setSelectedAdmin}
                    setShowEditDialog={setShowEditDialog}
                />
            </Box>

            <Box>
                <CreateAdminDialog
                    open={showCreateDialog}
                    setOpen={setShowCreateDialog}
                    createdBy={userData?.uid}
                    setSnackOpen={setSnackOpen}
                    success={setSuccess}
                    error={setError}
                    adminList={adminList}
                    subscription={subscription}
                />
            </Box>

            <Box>
                <EditAdminDialog
                    open={showEditDialog}
                    setOpen={setShowEditDialog}
                    createdBy={userData?.uid}
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
                        {successMsg}
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
                        {errorMsg}
                    </Alert>
                </Snackbar>
            )}
        </Box>
    )
}

export default ManageAdmins
