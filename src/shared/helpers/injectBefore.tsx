import { ReactNode, ReactPortal, useEffect } from 'react'
import { createPortal } from 'react-dom'

export const InjectBefore = (component: ReactNode, container: Element): ReactPortal => {
  const portalContainer = document.createElement('div')

  useEffect(() => {
    container.prepend(portalContainer)
    return () => {
      container.removeChild(portalContainer)
    }
  }, [container, portalContainer])

  return createPortal(component, portalContainer)
}
export default InjectBefore
