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
    path: '/',
    element: <MainLayout />,
    children: [
      { path: 'login', element: <Login /> },
      { path: 'register', element: <Register /> },
      { path: '404', element: <NotFound /> },
      { path: '/', element: <Navigate to='/app/dashboard' /> },
      { path: '*', element: <Navigate to='/404' /> },
    ],
  },
]

export default routes
