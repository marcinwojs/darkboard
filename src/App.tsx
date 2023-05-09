import React from 'react'
import './App.css'
import CssBaseline from '@mui/material/CssBaseline'
import { ThemeProvider } from '@mui/material'
import theme from './theme'
import { BrowserRouter } from 'react-router-dom'
import Router from './routes'
import FirebaseUserProvider from './providers/firebaseUserProvider'

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <FirebaseUserProvider>
          <Router />
        </FirebaseUserProvider>
      </ThemeProvider>
    </BrowserRouter>
  )
}

export default App
