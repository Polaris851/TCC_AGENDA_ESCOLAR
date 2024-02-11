import { useState, useCallback } from 'react'
import { View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native'
import { ProgressBar } from 'react-native-paper'
import { useNavigation, useFocusEffect } from '@react-navigation/native'
import { Feather } from '@expo/vector-icons'

import dayjs from 'dayjs'

import { api } from '../lib/axios'
import { Header } from '../components/Header'
import { Checkbox } from '../components/Checkbox'
import { Loading } from '../components/Loading'
import { generateProgressPercentage } from '../utils/generate-progress-percentage'
import { HomeworksEmpty } from '../components/HomeworksEmpty'

export interface HomeworkDto {
    id: string;
    title?: string;
} 

interface DayInfoProps {
    completedHomeworks: HomeworkDto[],
    possibleHomeworks: HomeworkDto[]
}

export function Day() {
    const [ loading, setLoading ] = useState(true)
    const [ dayInfo, setDayInfo ] = useState<DayInfoProps | null>(null)
    const [ completedHomework, setCompletedHomework ] = useState<string[]>([])

    const { navigate } = useNavigation()

    const date = dayjs().format('YYYY-MM-DDTHH:mm:ss.SSS[Z]')
    const dayOfWeek = dayjs().format('dddd')
    const dayAndMonth = dayjs().format('DD/MM')

    const homeworkProgress = dayInfo?.possibleHomeworks.length ? generateProgressPercentage(dayInfo.possibleHomeworks.length, completedHomework.length) : 0

    async function fetchHomeworks() {
        try {
           setLoading(true)

            const response = await api.get<DayInfoProps>("/day", { params: { date }})
            
            setDayInfo(response.data)
            setCompletedHomework(response.data.completedHomeworks.map((homework) => homework?.id));
        } catch (error) {
            console.log(error)
            Alert.alert("Ops", "Não foi possível carregar as informações das tarefas.")
        } finally {
            setLoading(false)
        }
    }

    async function handleToggleHomework(homeworkId: string) {
        try {
            await api.patch(`/homeworks/${homeworkId}/toggle`)

            if (completedHomework?.includes(homeworkId)) {
              setCompletedHomework(prevState => prevState.filter(homework => homework !== homeworkId))
            } else {
                setCompletedHomework(prevState => [...prevState, homeworkId])
            }
          } catch (error) {
            console.log(error)
            Alert.alert('Ops', 'Não foi possível atualizar o status da tarefa.')
          }
    }

    useFocusEffect(useCallback(() => {
        fetchHomeworks()
    }, []))

    if(loading) {
        return(
            <Loading />
        )
    }

    return(
        <View className='flex-1 bg-background pt-6'>
            <Header title='Meu Dia' />

            <ScrollView showsVerticalScrollIndicator={false}>
                <View className='flex-row justify-between items-center px-5 pt-6'>
                    <View>
                        <Text className='text-xs font-semibold uppercase'>{dayOfWeek}</Text>
                        <Text className='text-2xl font-bold'>{dayAndMonth}</Text>
                    </View>
                    
                    <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => navigate('formday')}>
                        <Feather 
                        name="plus-circle" 
                        size={22} 
                        color="black" />
                    </TouchableOpacity>
                </View>

                <ProgressBar 
                progress={homeworkProgress} 
                color='#306D9C'
                className='justify-center h-3 mx-5 my-6 items-center rounded-md'/>

                <View className='mt-6'>
                    {
                        dayInfo?.possibleHomeworks.length  ?
                        dayInfo?.possibleHomeworks.map(homework => (
                            <Checkbox 
                                key={homework.id}
                                title={homework.title ?? ""}
                                checked={completedHomework?.includes(homework.id)}
                                onPress={() => handleToggleHomework(homework.id)}
                             />
                        )) :
                        <HomeworksEmpty />
                    }
                </View>

            </ScrollView>

        </View>
    )}