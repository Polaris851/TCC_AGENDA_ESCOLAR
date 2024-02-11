
import dayjs from "dayjs"

export function generateDateRangeFromStartWeek() {
    const startDate = dayjs().startOf('month')
    const week = startDate.format('d')
    const numberWeek = Number(week)

    const mappedDates = []
    for (let i = 0; i < numberWeek; i++) {
        mappedDates.push(i)
    }

    return mappedDates
}