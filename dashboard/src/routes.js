import { Navigate } from 'react-router-dom'
import DashboardLayout from './components/DashboardLayout'
import MainLayout from './components/MainLayout'
import Dashboard from './pages/Dashboard'
import Login from './pages/Login'
import NotFound from './pages/NotFound'
import Register from './pages/Register'

import Locationview from './pages/Locationview'
import Report from './pages/Report'
import Notification from './pages/Notification'
import ManageMobileDevices from './pages/ManageMobileDevices'
import ManageHotspots from './pages/ManageHotspots'
import Profile from './pages/Profile'
import ManageGroups from './pages/ManageGroups'
import ManageAdmins from './pages/ManageAdmins'
import Pricing from './pages/Pricing'
import Subscribe from './pages/Subscribe'
import ForgotPassword from './pages/ForgotPassword'

const routes = [
    {
        path: 'app',
        element: <DashboardLayout />,
        children: [
            { path: 'dashboard', element: <Dashboard /> },
            { path: 'manage-devices', element: <ManageMobileDevices /> },
            { path: 'manage-hotspots', element: <ManageHotspots /> },
            { path: 'manage-groups', element: <ManageGroups /> },
            { path: 'manage-admins', element: <ManageAdmins /> },
            { path: 'pricing', element: <Pricing /> },
            { path: 'notifications', element: <Notification /> },
            { path: 'reports', element: <Report /> },
            {
                path: 'locationview/:phoneNumber/:requestId',
                element: <Locationview />,
            },
            { path: 'profile', element: <Profile /> },
            { path: '*', element: <Navigate to='/404' /> },
        ],
    },
    {
        path: '',
        element: <MainLayout />,
        children: [
            { path: 'register', element: <Register /> },
            { path: 'login', element: <Login /> },
            { path: 'subscribe', element: <Subscribe /> },
            { path: '/forget-password', element: <ForgotPassword /> },
            { path: '404', element: <NotFound /> },
            { path: '/', element: <Navigate to='/app/dashboard' /> },
            { path: '*', element: <Navigate to='/404' /> },
        ],
    },
]

export default routes
