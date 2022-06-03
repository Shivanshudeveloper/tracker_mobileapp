import { Link as RouterLink } from 'react-router-dom'
import { AppBar, Toolbar } from '@mui/material'

const MainNavbar = (props) => (
  <AppBar elevation={0} {...props}>
    <Toolbar sx={{ height: 64, backgroundColor: '#007bff' }}></Toolbar>
  </AppBar>
)

export default MainNavbar
