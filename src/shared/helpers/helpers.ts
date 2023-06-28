import { flushSync } from 'react-dom'

export const setWithTransition = (set: () => void) => {
  if ('startViewTransition' in document) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    document.startViewTransition(() => {
      flushSync(() => {
        set()
      })
    })
  } else {
    set()
  }
}
