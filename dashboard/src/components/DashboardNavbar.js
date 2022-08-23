import { useState, useEffect } from 'react'
import {
    Link,
    Link as RouterLink,
    Navigate,
    useNavigate,
} from 'react-router-dom'
import PropTypes from 'prop-types'
import {
    AppBar,
    Avatar,
    Box,
    Divider,
    IconButton,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Popover,
    Toolbar,
} from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import NotificationsIcon from '@mui/icons-material/Notifications'
import Account from '@mui/icons-material/AccountCircle'
import { auth, db } from '../Firebase/index'
import {
    onSnapshot,
    doc,
    query,
    orderBy,
    collection,
    limit,
} from 'firebase/firestore'
import moment from 'moment'
import { Image } from '@mui/icons-material'
import { signOut } from 'firebase/auth'
import LogoutIcon from '@mui/icons-material/Logout'

const DashboardNavbar = ({ onMobileNavOpen, ...rest }) => {
    const [notifications, setNotifications] = useState([])
    const [anchorEl, setAnchorEl] = useState(null)
    const [open, setOpen] = useState(false)

    const accept =
        'https://firebasestorage.googleapis.com/v0/b/mobiletracking-cd8f2.appspot.com/o/accept.png?alt=media&token=83902429-f4af-40b8-852c-faca1e144a92'
    const pending =
        'https://firebasestorage.googleapis.com/v0/b/mobiletracking-cd8f2.appspot.com/o/pending.png?alt=media&token=20afc88a-6914-4657-962e-ba9d5e684ae5'
    const reject =
        'https://firebasestorage.googleapis.com/v0/b/mobiletracking-cd8f2.appspot.com/o/reject.png?alt=media&token=25da312f-2ec2-492d-97d9-1d47ecd1afd5'

    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget)
    }

    const handleClose = () => {
        setAnchorEl(null)
        setOpen(false)
    }

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget)
        setOpen(true)
    }

    const navigate = useNavigate()

    const userData = localStorage.getItem('userData')
        ? JSON.parse(localStorage.getItem('userData'))
        : null

    useEffect(() => {
        if (userData !== null) {
            const notificationRef = collection(
                db,
                'trackingWebNotification',
                userData?.uid,
                'notifications'
            )
            const q = query(
                notificationRef,
                orderBy('createdAt', 'desc'),
                limit(100)
            )

            const unsub = onSnapshot(q, (snapshots) => {
                const list = []
                snapshots.forEach((snap) => {
                    list.push(snap.data())
                })

                setNotifications(list)
            })

            return () => unsub()
        }
    }, [])

    const getTime = (sec) => {
        const str = moment(new Date(sec * 1000)).fromNow()

        switch (str) {
            case 'in a few seconds':
                return 'few sec'
            case 'a few seconds ago':
                return 'few sec'
            case 'a minute ago':
                return '1m'
            case 'an hour ago':
                return '1h'
            case 'a day ago':
                return '1day'
            default:
                const first = str.split(' ')[0]
                let mid = str.split(' ')[1]
                if (mid === 'minutes' || mid === 'minute') {
                    mid = 'm'
                }
                if (mid === 'hours' || mid === 'hour') {
                    mid = 'h'
                }
                if (mid === 'days' || mid === 'day') {
                    mid = 'd'
                }
                return first + mid
        }
    }

    const logout = () => {
        localStorage.removeItem('userData')
        localStorage.removeItem('authToken')
        signOut(auth)
            .then(() => navigate('/login', { replace: true }))
            .catch((error) => console.log(error))
    }

    return (
        <AppBar elevation={0} {...rest}>
            <Toolbar
                sx={{
                    backgroundColor: '#007bff',
                    display: 'flex',
                    justifyContent: 'flex-end',
                    gap: 1,
                }}
            >
                <IconButton onClick={handleClick}>
                    <NotificationsIcon sx={{ color: 'white' }} />
                </IconButton>
                <Popover
                    id='notification'
                    open={open}
                    anchorEl={anchorEl}
                    onClose={handleClose}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left',
                    }}
                    className='notification'
                >
                    <List sx={{ padding: 2 }}>
                        {notifications.map((x, i) => (
                            <Box key={++i} style={{ padding: 2 }}>
                                <ListItem sx={{ mt: 1.5 }}>
                                    <ListItemAvatar>
                                        {x.requestStatus === 'pending' && (
                                            <Avatar src={pending} />
                                        )}
                                        {x.requestStatus === 'accepted' && (
                                            <Avatar src={accept} />
                                        )}
                                        {x.requestStatus === 'rejected' && (
                                            <Avatar src={reject} />
                                        )}
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary={x.message}
                                        secondary={
                                            getTime(x.createdAt.seconds) +
                                            ' ago'
                                        }
                                    />
                                </ListItem>
                                <Divider />
                            </Box>
                        ))}
                    </List>
                </Popover>

                <Link to='/app/profile'>
                    <IconButton onClick={handleMenu}>
                        <Account sx={{ color: 'white' }} />
                    </IconButton>
                </Link>

                <IconButton onClick={logout}>
                    <LogoutIcon sx={{ color: 'white' }} />
                </IconButton>
            </Toolbar>
        </AppBar>
    )
}

DashboardNavbar.propTypes = {
    onMobileNavOpen: PropTypes.func,
}

export default DashboardNavbar
