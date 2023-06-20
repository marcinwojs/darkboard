export const errorMessages: Record<string, string> = {
  'auth/user-not-found': 'User not found',
  'password-not-the-same': 'Password not the same',
  'auth/weak-password': 'Password too weak',
  'auth/email-already-in-use': 'This email is already in use',
}

export const handleError = (errorCode: string, error?: Error) => {
  console.error(errorCode, error)
  return errorMessages[`${errorCode}`] || 'Unknown Error'
}
