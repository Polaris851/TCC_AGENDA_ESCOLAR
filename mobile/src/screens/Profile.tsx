import { useState, useCallback } from 'react'
import { View, Text, ScrollView, Alert} from 'react-native'
import { useFocusEffect } from '@react-navigation/native'

import dayjs from 'dayjs'

import { api } from '../lib/axios'
import { Header } from '../components/Header'
import { User } from '../components/User'
import { DayHeatMap, DAY_SIZE } from '../components/DayHeatMap'
import { generateDateRangeFromMonthStartToToday } from '../utils/generate-date-range-from-month-start-to-today'
import { Loading } from '../components/Loading'
import { MonthCurrent } from '../components/MonthCurrent'
import { generateDateRangeFromStartWeek } from '../utils/generate-date-range-from-start-week'

const weekDays = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S']
const monthToDateRange  = generateDateRangeFromMonthStartToToday()
const mappedDates = generateDateRangeFromStartWeek()

type SummaryProps = Array<{
    id: string,
    date: string,
    amount: number,
    completed: number,
  }>

export function Profile() {
    const [loading, setLoading] = useState(true)
    const [summary, setSummary] = useState<SummaryProps | null>(null)

    async function fetchData() {
        try {
            setLoading(true)
            const response = await api.get('/summary')
            setSummary(response.data)
          } catch (error) {
            Alert.alert('Ops', 'Não foi possível carregar o sumário de hábitos.')
            console.log(error)
          } finally {
            setLoading(false)
          }
    }

    useFocusEffect(useCallback(() => {
        fetchData()
    }, []));

    if (loading) {
        return (
          <Loading />
        )
      }

    return(
        <View className='flex-1 bg-background pt-6'>
            <Header title='Perfil' />

            <ScrollView
            className='px-5'
            showsVerticalScrollIndicator={false}>
                <User />

                <MonthCurrent />
            
                    <View className='flex-row mt-6 mb-2'>
                        {
                            weekDays.map((weekDay, i) => (
                                <Text 
                                    key={`${weekDay}-${i}`}
                                    className='text-base font-semibold text-center m-1'
                                    style={{ width: DAY_SIZE}}
                                >
                                    {weekDay}
                                </Text>
                            ))
                        }
                    </View>

                    {
                        summary && (
                            <View className='flex-row flex-wrap'>
                                {   mappedDates.map((date,i) =>(
                                        <View
                                            key={`${date}-${i}`}
                                            className='m-1'
                                            style={{ width: DAY_SIZE }}
                                        />
                                    ))
                            }
                            {
                                monthToDateRange.map(date => {
                                    const dayWithHabits = summary.find(day => {
                                        return dayjs(date).isSame(day.date, 'day')
                                    })

                                    return (
                                        <DayHeatMap 
                                            key={date.toISOString()}
                                            date={date}
                                            amountOfHabits={dayWithHabits?.amount}
                                            amountCompleted={dayWithHabits?.completed}
                                        />
                                    )
                                })
                            }
                            </View>
                        )
                    }
                
            </ScrollView>
        </View>
    )}
