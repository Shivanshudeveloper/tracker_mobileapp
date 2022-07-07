import 'react-perfect-scrollbar/dist/css/styles.css'
import { useRoutes, useNavigate } from 'react-router-dom'
import { ThemeProvider, StyledEngineProvider } from '@mui/material'
import GlobalStyles from './components/GlobalStyles'
import theme from './theme'
import routes from './routes'
import './App.css'
import { useEffect } from 'react'
import { getDevices, getAdminDevices } from './store/actions/device'

import axios from 'axios'
import { API_SERVICE } from './URI'
import { getAdminHotspots, getHotspots } from './store/actions/hotspot'
import { getAdmins } from './store/actions/admin'
import { getGroups } from './store/actions/group'
import { useDispatch } from 'react-redux'

const App = () => {
    const content = useRoutes(routes)
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const authToken = sessionStorage.getItem('authToken')
    const userData = sessionStorage.getItem('userData')
        ? JSON.parse(sessionStorage.getItem('userData'))
        : null

    const adminData = sessionStorage.getItem('adminData')
        ? JSON.parse(sessionStorage.getItem('adminData'))
        : null

    useEffect(async () => {
        if (adminData === null && userData !== null) {
            dispatch(getDevices(userData.uid))
            dispatch(getHotspots(userData.uid))
            dispatch(getGroups(userData.uid))
            dispatch(getAdmins(userData.uid))
        }

        if (adminData !== null && userData !== null) {
            const { data } = await axios.get(
                `${API_SERVICE}/get/admin/${adminData.email}`
            )
            dispatch(
                getAdminDevices({
                    createdBy: userData.uid,
                    adminGroups: data.groups,
                })
            )
            dispatch(
                getAdminHotspots({
                    createdBy: userData.uid,
                    adminGroups: data.groups,
                })
            )
        }
    }, [dispatch])

    useEffect(() => {
        if (!authToken) {
            navigate('/login')
        }
    }, [authToken])

    return (
        <StyledEngineProvider injectFirst>
            <ThemeProvider theme={theme}>
                <GlobalStyles />
                {content}
            </ThemeProvider>
        </StyledEngineProvider>
    )
}

export default App
