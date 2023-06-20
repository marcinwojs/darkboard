export const errorMessages: Record<string, string> = {
  'auth/user-not-found': 'User not found',
  'password-arent-the-same': 'Password arent the same',
  'auth/weak-password': 'Password too weak',
  'auth/email-already-in-use': 'This email is already in use'
}

export const handleError = (errorCode: string) => {
  return errorMessages[`${errorCode}`] || 'Unknown Error'
}
