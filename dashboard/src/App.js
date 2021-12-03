import 'react-perfect-scrollbar/dist/css/styles.css'
import { useRoutes, useNavigate } from 'react-router-dom'
import { ThemeProvider, StyledEngineProvider } from '@material-ui/core'
import GlobalStyles from './components/GlobalStyles'
import theme from './theme'
import routes from './routes'
import './App.css'
import { useEffect } from 'react'

const App = () => {
  const content = useRoutes(routes)
  const navigate = useNavigate()

  const userInfo = JSON.parse(sessionStorage.getItem('userInfo'))

  useEffect(() => {
    if (!userInfo) {
      navigate('/login')
    }
  }, [userInfo])

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
