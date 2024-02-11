import dayjs from "dayjs"

export function generateDateRangeFromMonthStartToToday() {
    const startDate = dayjs().startOf('month')
    const endDate = new Date()

    const dateRange = []
    let compareDate = startDate

    while(compareDate.isBefore(endDate)) {
        dateRange.push(compareDate.toDate())
        compareDate = compareDate.add(1, 'day')
    }

    return dateRange
}