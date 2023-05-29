import React from 'react'
import './App.css'
import { ErrorBoundary, ErrorFallback } from '@tldraw/tldraw'
import CssBaseline from '@mui/material/CssBaseline'
import { BrowserRouter } from 'react-router-dom'
import Router from './routes'
import FirebaseUserProvider from './providers/firebaseUserProvider'
import '@tldraw/tldraw/editor.css'
import '@tldraw/tldraw/ui.css'
import LayoutWrapper from './layout/layoutWrapper'
import AppThemeProvider from './providers/appThemeProvider'

function App() {
  return (
    <AppThemeProvider>
      <CssBaseline />
      <FirebaseUserProvider>
        <ErrorBoundary
          fallback={(error) => <ErrorFallback error={error} />}
          onError={(error) => console.error(error)}
        >
          <BrowserRouter>
            <LayoutWrapper>
              <Router />
            </LayoutWrapper>
          </BrowserRouter>
        </ErrorBoundary>
      </FirebaseUserProvider>
    </AppThemeProvider>
  )
}

export default App
