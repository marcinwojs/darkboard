import Header from './header'
import { useEffect, useRef } from 'react'
import { HeaderMode, useAppLayoutContext } from '../../providers/appLayoutProvider'

const DynamicHeader = () => {
  const { headerMode, changeHeaderMode } = useAppLayoutContext()
  const lastNonFullscreen = useRef<HeaderMode>(HeaderMode.regular)

  useEffect(() => {
    if (headerMode !== 'fullscreen') {
      lastNonFullscreen.current = headerMode

      if (document.fullscreenElement) {
        document.exitFullscreen()
      }
    }
  }, [headerMode])

  const handleFullscreenChange = () => {
    if (document.fullscreenElement) {
      changeHeaderMode(HeaderMode.fullscreen)
    } else {
      lastNonFullscreen.current && changeHeaderMode(lastNonFullscreen.current)
    }
  }

  function handleKeyDown(event: KeyboardEvent) {
    if (event.key === 'F11') {
      event.preventDefault()
      if (document.fullscreenElement) {
        document.exitFullscreen()
      } else {
        document.getElementById('fullscreenBtn')?.click()
      }
    }
  }

  useEffect(() => {
    window.addEventListener('fullscreenchange', handleFullscreenChange)
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('fullscreenchange', handleFullscreenChange)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [headerMode])

  if (headerMode === 'regular') {
    return <Header />
  }

  return null
}

export default DynamicHeader
