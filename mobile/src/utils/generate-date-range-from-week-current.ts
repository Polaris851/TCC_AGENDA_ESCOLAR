import dayjs from "dayjs"

export function generateDateRangeFromWeekCurrent() {
    const lastSunday = dayjs().day(0)
    const startDate = lastSunday

    const daysOfWeek = []

    for (let i = 0; i < 7; i++) {
        const day = startDate.add(i, 'day')
        daysOfWeek.push(day.format('DD ddd'))
    }

    return daysOfWeek
}