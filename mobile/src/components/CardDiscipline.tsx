import { useState, useCallback } from 'react'
import { useFocusEffect } from '@react-navigation/native'
import { View, Text, TouchableOpacity, Alert } from 'react-native'

import clsx from "clsx"

import { api } from '../lib/axios'
import { Loading } from '../components/Loading'

interface Props {
    field: string,
    FieldEnum: string,
}

type DisciplineInfoProps = Array<{
    id: string,
    discipline: string,
    field: string,
}>

export function CardDiscipline({ field, FieldEnum }: Props) {
    const [ disciplineInfo, setDisciplineInfo ] = useState<DisciplineInfoProps | null>(null)
    const [ loading, setLoading ] = useState(true)
    const [ isVisible, setIsVisible ] = useState(false)

    function toggleVisibility() {
      setIsVisible(!isVisible)
    }

    async function fetchDisciplines() {
        try {
           setLoading(true)

            const response = await api.get("/discipline")
            setDisciplineInfo(response.data)
        } catch (error) {
            console.log(error)
            Alert.alert("Ops", "Não foi possível carregar as informações dos eventos.")
        } finally {
            setLoading(false)
        }
    }

    useFocusEffect(useCallback(() => {
        fetchDisciplines()
    }, []))

    if(loading) {
        return(
            <Loading />
        )
    }

    return(
        <View className={clsx('w-auto h-auto mt-6 justify-center', { ['rounded-t-2xl bg-secondary']: isVisible && disciplineInfo != null})}>
            <TouchableOpacity 
            className='w-auto h-16 bg-primary flex-row justify-center items-center rounded-2xl' 
            activeOpacity={0.7} 
            onPress={toggleVisibility}>
                <Text className='text-white capitalize font-bold text-lg'>{field}</Text>
            </TouchableOpacity>
            { isVisible && disciplineInfo?.map(value => (
                value.field == FieldEnum && 
                <Text className='text-center m-2 capitalize font-bold text-base' key={value.id}>{value.discipline}</Text>
            ))}
        </View>
    )}