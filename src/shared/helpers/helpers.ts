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

export const fetchImage = (url: string) => {
  return new Promise((resolve, reject) => {
    const img = new Image()

    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error('Image cannot be downloaded'))

    img.src = url

    return img
  })
}
