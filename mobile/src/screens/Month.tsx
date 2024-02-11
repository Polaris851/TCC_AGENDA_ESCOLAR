import { useState, useCallback } from 'react'
import { View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native'
import { useNavigation, useFocusEffect } from '@react-navigation/native'
import { Feather } from '@expo/vector-icons'

import dayjs from 'dayjs'

import { api } from '../lib/axios'
import { Header } from '../components/Header'
import { SliderButton } from '../components/SliderButton'
import { Calendars } from '../components/Calendars'
import { CardEvent } from '../components/CardEvent'
import { Loading } from '../components/Loading'
import { MonthCurrent } from '../components/MonthCurrent'

interface Event {
  id: string;
  title: string;
  discipline_id: string;
  dueDate: Date;
  disciplineTitle: string;
}

interface EventsMonthProps {
  eventsMonth: Event[];
}

export function Month() {
    const { navigate } = useNavigation()

    const [ loading, setLoading ] = useState(true)
    const [ eventInfo, setEventInfo ] = useState<EventsMonthProps | null>(null)

    async function fetchEvents() {
        try {
           setLoading(true)

            const response = await api.get("/events")
            setEventInfo(response.data)
        } catch (error) {
            console.log(error)
            Alert.alert("Ops", "Não foi possível carregar as informações dos eventos.")
        } finally {
            setLoading(false)
        }
    }

    async function handleDeleteEvent(eventId: string) {
        try {
            await api.delete(`/monthlyevents/${eventId}`)

            fetchEvents()
          } catch (error) {
            console.log(error)
            Alert.alert('Ops', 'Não foi possível excluir o evento.')
          }
    }

    useFocusEffect(useCallback(() => {
        fetchEvents()
    }, []))


    if(loading) {
        return(
            <Loading />
        )
    }

    return (
        <View className='flex-1 bg-background pt-6'>
            <Header title='Caléndario'/>

            <ScrollView 
            showsVerticalScrollIndicator={false}>
                <MonthCurrent />

                <SliderButton />

               <Calendars />

                <View className='bg-secondary px-5 pt-6 pb-36 mt-5'>
                    <View className='flex-row justify-between items-center'>
                        <Text className='text-lg font-bold'>Eventos</Text>

                        <TouchableOpacity
                        activeOpacity={0.7}
                        onPress={() => navigate('formevent')}
                        >
                            <Feather 
                            name="plus-circle" 
                            size={22} 
                            color="black" />
                        </TouchableOpacity>
                    </View>

                    
                {
                    eventInfo?.eventsMonth?.map(event => (
                        <CardEvent 
                        key={event.id}
                        title={event.title}
                        discipline={event.disciplineTitle}
                        dueDate={dayjs(event.dueDate).format('DD/MM')}
                        onPress={() => handleDeleteEvent(event.id)}
                        />
                    ))
                }
                </View> 
            </ScrollView>
        </View>
    )
}