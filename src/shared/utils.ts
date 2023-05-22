import { Timestamp } from 'firebase/firestore'
const convertFromDateObject = (date: Date) => Timestamp.fromDate(date)

const convertToObjectDate = (timeObject: { seconds: number; nanoseconds: number }) =>
  new Timestamp(timeObject.seconds, timeObject.nanoseconds).toDate()

export { convertToObjectDate, convertFromDateObject }
