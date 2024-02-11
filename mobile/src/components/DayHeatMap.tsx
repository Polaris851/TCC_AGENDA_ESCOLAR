import { TouchableOpacity, Dimensions, TouchableOpacityProps} from 'react-native'

import dayjs from "dayjs"
import clsx from "clsx"

import { generateProgressPercentage } from "../utils/generate-progress-percentage"

const WEEK_DAYS = 7
const SCREEN_HORIZONTAL_PADDING = (32 * 2) / 5
export const DAY_MARGIN_BETWEEN = 7
export const DAY_SIZE = (Dimensions.get('screen').width / WEEK_DAYS) - (SCREEN_HORIZONTAL_PADDING + 2)


interface Props extends TouchableOpacityProps {
    amountOfHabits?: number,
    amountCompleted?: number,
    date: Date,
  }

export function DayHeatMap({ amountOfHabits = 0, amountCompleted = 0, date, ...rest }: Props) {
    const amountAccomplished = amountOfHabits > 0 ? generateProgressPercentage(amountOfHabits, amountCompleted) : 0
    const amountAccomplishedPercentage = Math.round(amountAccomplished * 100)
    
    const today = dayjs().startOf('day').toDate()
    const isCurrentDay = dayjs(date).isSame(today)

    return(
        <TouchableOpacity 
        className={clsx(
          "rounded-lg border-2 m-1", {
            ["bg-white-900 border-secondary"] : amountAccomplishedPercentage === 0,
            ["bg-sky-200 border-sky-300"] : amountAccomplishedPercentage > 0 && amountAccomplishedPercentage < 20,
            ["bg-sky-300 border-sky-400"] : amountAccomplishedPercentage >= 20 && amountAccomplishedPercentage < 40,
            ["bg-sky-400 border-sky-500"] : amountAccomplishedPercentage >= 40 && amountAccomplishedPercentage < 60,
            ["bg-sky-500 border-sky-600"] : amountAccomplishedPercentage >= 60 && amountAccomplishedPercentage < 80,
            ["bg-sky-600 border-sky-700"] : amountAccomplishedPercentage >= 80,
            ["border-primary border-4"] : isCurrentDay,
          } 
        )}
        style={{ width: DAY_SIZE, height: DAY_SIZE }}
        activeOpacity={0.7}
        {...rest}
      />
    )}