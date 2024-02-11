import { useState } from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { Feather } from '@expo/vector-icons'
import { Picker } from '@react-native-picker/picker'

import { InputTimePicker } from './InputTimePicker'

export const DayWeekEnum: { [key: string]: string } =  {
    Segunda: 'Segunda-Feira',
    Terca: 'Terça-Feira',
    Quarta: 'Quarta-Feira',
    Quinta: 'Quinta-Feira',
    Sexta: 'Sexta-Feira',
}

export interface InputDayTimeData {
    dayOfWeek: string,
    startTime: string,
    endTime: string,
}

interface Props {
    onChange?: (inputDayTimeData: InputDayTimeData[]) => void,
}

export function InputDayTime({onChange}: Props) {
    const [datesAndTimes, setDatesAndTimes] = useState<InputDayTimeData[]>([{ dayOfWeek: 'Segunda', startTime: '', endTime: '' },])

    const addDateAndTime = () => {
        setDatesAndTimes([...datesAndTimes, { dayOfWeek: 'Segunda', startTime: '', endTime: '' }])
    }

    const updateDate = (date: string, index: number) => {
        const updatedDatesAndTimes = [...datesAndTimes]
        updatedDatesAndTimes[index].dayOfWeek = date
        setDatesAndTimes(updatedDatesAndTimes)
        onChange?.(datesAndTimes)
      }
    
      const updateTimeStart = (time: string, index: number) => {
        const updatedDatesAndTimes = [...datesAndTimes]
        updatedDatesAndTimes[index].startTime = time
        setDatesAndTimes(updatedDatesAndTimes)
        onChange?.(datesAndTimes)
      }
    
      const updateTimeFinish = (time: string, index: number) => {
        const updatedDatesAndTimes = [...datesAndTimes]
        updatedDatesAndTimes[index].endTime = time
        setDatesAndTimes(updatedDatesAndTimes)
        onChange?.(datesAndTimes)
      }

    return(
        <View>
            <View className='flex-row mt-6 justify-between items-center'>
                <Text className='text-lg font-bold'>Dia e Horario</Text>

                <TouchableOpacity
                activeOpacity={0.7}
                onPress={addDateAndTime}>
                    <Feather 
                    name="plus-circle" 
                    size={22} 
                    color="black" />
                </TouchableOpacity>
            </View>

            {datesAndTimes.map((dateAndTime, index) => (
                <View className='flex-row my-3' key={index}>
                    <TouchableOpacity 
                    className='w-32 h-16 m-1 border border-primary justify-center rounded-lg'
                    activeOpacity={0.7} >
                        <Picker 
                        selectedValue={dateAndTime.dayOfWeek} 
                        onValueChange={itemValue => updateDate(itemValue, index)}>
                        {Object.keys(DayWeekEnum).map((key) => (
                            <Picker.Item key={key} label={DayWeekEnum[key]} value={key} />
                        ))}
                        </Picker>
                    </TouchableOpacity>

                    <InputTimePicker
                        title='Começa'
                        onTime={(time: string) => {
                            updateTimeStart(time, index)
                        }}
                    />

                    <InputTimePicker
                        title='Termina'
                        onTime={(time: string) => {
                            updateTimeFinish(time, index)
                        }}
                    />

                </View>
            ))}
        </View>
    )}
