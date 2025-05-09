import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { Provider } from 'react-redux'
import { store } from './store/index.js'
import { createTheme, CssBaseline, ThemeProvider } from '@mui/material'
import ToastContainer from './components/Toasts/ToastComponent.jsx'
import './index.css' // Import global CSS for theme consistency

const theme = createTheme({
  typography: {
    button: {
      textTransform: 'none'
    }
  },
  palette: {
    primary: {
      main: '#0099ff'
    },
    background: {
      default: '#eef2f6'
    }
  }
})

createRoot(document.getElementById('root')).render(
  // <StrictMode>
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <ToastContainer />
        <App />
      </ThemeProvider>
    </Provider>
  // </StrictMode>,
)
