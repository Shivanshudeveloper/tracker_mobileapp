import 'react-perfect-scrollbar/dist/css/styles.css'
import { useRoutes, useNavigate } from 'react-router-dom'
import { ThemeProvider, StyledEngineProvider } from '@mui/material'
import GlobalStyles from './components/GlobalStyles'
import theme from './theme'
import routes from './routes'
import './App.css'
import { useEffect } from 'react'

const App = () => {
  const content = useRoutes(routes)
  const navigate = useNavigate()

  const userData = JSON.parse(sessionStorage.getItem('userData'))

  useEffect(() => {
    if (!userData) {
      navigate('/login')
    }
  }, [userData])

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
