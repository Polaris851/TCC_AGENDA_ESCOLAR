import { Text } from "react-native"

import dayjs from 'dayjs'

export function MonthCurrent() {
    const currentMonth = dayjs().format('MMMM')

  return (
    <Text className='text-lg font-bold pt-6 px-5 uppercase'>{currentMonth}</Text>
  )
}