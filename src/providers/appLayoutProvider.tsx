import { createContext, FC, ReactNode, useContext, useEffect, useState } from 'react'
import { PaletteMode, ThemeProvider } from '@mui/material'
import theme from '../theme'
import Cookies from 'js-cookie'

export enum HeaderMode {
  'fullscreen' = 'fullscreen',
  'focus' = 'focus',
  'regular' = 'regular',
}

export type AppLayoutContextType = {
  headerMode: HeaderMode
  mode: PaletteMode
  changeHeaderMode: (mode: HeaderMode) => void
  changeThemeMode: (mode: PaletteMode) => void
}

export const AppThemeContext = createContext<AppLayoutContextType>({
  headerMode: HeaderMode.regular,
  mode: 'dark',
  changeHeaderMode: () => null,
  changeThemeMode: () => null,
})

export const useAppLayoutContext = () => useContext<AppLayoutContextType>(AppThemeContext)

const AppLayoutProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [headerMode, setHeaderMode] = useState<HeaderMode>(HeaderMode.regular)
  const [mode, setMode] = useState<PaletteMode>((Cookies.get('appTheme') as PaletteMode) || 'dark')

  useEffect(() => {
    if (Cookies.get('appTheme') === undefined) {
      Cookies.set('appTheme', 'dark', { expires: 30 })
    }
  }, [])

  const changeThemeMode = (mode: PaletteMode) => {
    setMode(mode)
    Cookies.set('appTheme', mode, { expires: 30 })
  }

  const changeHeaderMode = (mode: HeaderMode) => {
    setHeaderMode(mode)
  }

  return (
    <AppThemeContext.Provider value={{ headerMode, mode, changeHeaderMode, changeThemeMode }}>
      <ThemeProvider theme={theme(mode)}>{children}</ThemeProvider>
    </AppThemeContext.Provider>
  )
}

export default AppLayoutProvider
