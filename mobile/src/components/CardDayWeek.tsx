import { useState, useCallback } from 'react'
import { useFocusEffect } from '@react-navigation/native'
import { View, Text, TouchableOpacity, Alert } from 'react-native'
import { Feather } from '@expo/vector-icons'
import Animated, { ZoomIn} from "react-native-reanimated"

import dayjs from 'dayjs'

import { api } from '../lib/axios'
import { Loading } from './Loading'
import { DeleteModal } from './DeleteModal'

interface Props  {
    title: string,
    titleEnum: string,
}
  
interface WeekProps {
    weekActivity: WeekActivity[];
    discipline: Discipline[];
}

type Time = {
    dayOfWeek: string,
    startTime: string,
    endTime: string,
}
  
type WeekActivity = {
    id: string,
    title: string,
    times: Time[],
}
  
type Discipline = {
    id: string,
    discipline: string,
    times: Time[],
}

export function CardDayWeek({ title, titleEnum,  ...rest}: Props) {
    const [ week, setWeek] = useState<WeekProps | null>(null)
    const [ loading, setLoading ] = useState(true)
    const [ isVisible, setIsVisible ] = useState(false);

    function toggleVisibility() {
      setIsVisible(!isVisible)
    }

    async function fetchWeek() {
        try {
           setLoading(true)

            const response = await api.get("/week")
            setWeek(response.data)
        } catch (error) {
            console.log(error)
            Alert.alert("Ops", "Não foi possível carregar as informações dos eventos.")
        } finally {
            setLoading(false)
        }
    }

    async function handleDeleteDiscipline(disciplineId: string) {
        try {
            await api.delete(`/disciplines/${disciplineId}`)

            fetchWeek()
          } catch (error) {
            console.log(error)
            Alert.alert('Ops', 'Não foi possível excluir a disciplina.')
          }
    }

    async function handleDeleteActivity(activityId: string) {
        try {
            await api.delete(`/weeklyactivities/${activityId}`)

            fetchWeek()
          } catch (error) {
            console.log(error)
            Alert.alert('Ops', 'Não foi possível excluir a atividade.')
          }
    }

    useFocusEffect(useCallback(() => {
        fetchWeek()
    }, []))

    if(loading) {
        return(
            <Loading />
        )
    }

    return(
        <View className='w-auto h-auto mx-5 justify-center'>
            <TouchableOpacity 
            className='flex-row justify-between'
            activeOpacity={0.7} 
            onPress={toggleVisibility}>
                <Text className='text-primary text-lg font-bold m-2 capitalize'>{title}</Text>
                <Feather 
                name={ isVisible ? "chevron-up":"chevron-down"} 
                size={20} 
                color="#306D9C" />
            </TouchableOpacity>

            { isVisible && week?.discipline.map(discipline => (
                discipline.times.some((time) => time.dayOfWeek == titleEnum) &&
                <View 
                className='bg-secondary rounded-2xl py-2 px-5 h-16 m-1 flex-row justify-between items-center' 
                key={discipline.id}>
                    <View>
                        <Text className='capitalize font-bold text-base'>{discipline.discipline}</Text>
                        {discipline.times.map((time, index) => (
                            time.dayOfWeek == titleEnum &&
                            <View className='flex-row space-x-2' key={`${index}-${time}`}>
                                <Feather name="clock" size={20} color="black" />
                                <Text className='capitalize font-bold text-base'>
                                    {dayjs(time.startTime).format('HH:mm')} - {dayjs(time.endTime).format('HH:mm')}
                                </Text>
                            </View>
                        ))}
                    </View>
                    <View>
                        <DeleteModal title="essa disciplina" color="black" onPress={() => handleDeleteDiscipline(discipline.id)} />
                    </View>
                </View>
                ))
            }
            
            { isVisible && week?.weekActivity.map(activity => (
                activity.times.some((time) => time.dayOfWeek == titleEnum) &&
                <View 
                className='bg-secondary rounded-2xl py-2 px-5 h-16 m-1 flex-row justify-between items-center' 
                key={activity.id}>
                    <View>
                        <Text className='capitalize font-bold text-base'>{activity.title}</Text>
                        {activity.times.map((time, index) => (
                            time.dayOfWeek == titleEnum &&
                            <View className='flex-row space-x-2' key={`${index}-${time}`}>
                                <Feather name="clock" size={20} color="black" />
                                <Text className='capitalize font-bold text-base'>
                                    {dayjs(time.startTime).format('HH:mm')} - {dayjs(time.endTime).format('HH:mm')}
                                </Text>
                            </View>
                        ))}
                    </View>
                    <View>
                        <DeleteModal title="essa atividade" color="black" onPress={() => handleDeleteActivity(activity.id)} />
                    </View>
                </View>
                ))
            }

        </View>
    )}