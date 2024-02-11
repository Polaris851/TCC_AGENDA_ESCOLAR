import { useState } from 'react'
import { Text, TouchableOpacity } from 'react-native'
import DateTimePickerModal from "react-native-modal-datetime-picker"

interface Props {
    title: string,
    onTime: Function
}

export function InputTimePicker({ title, onTime}: Props) {
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false)
    const [selectedTime, setSelectedTime] = useState('')

    function showTimeSelector() {
      setDatePickerVisibility(true)
    }
  
    function hideTimeSelector() {
      setDatePickerVisibility(false)
    }
  
    function handleTimeSelection(time: Date) {
        const timeISOString = time.toISOString()

        const formattedTime = new Date(timeISOString)

        const hours = formattedTime.getHours()
        const minutes = formattedTime.getMinutes()
        const formattedTimeStr = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`
    
        onTime(formattedTimeStr)
        setSelectedTime(formattedTimeStr)
        hideTimeSelector()
    }


    return(
        <TouchableOpacity 
        className='w-24 h-16 m-1 border border-primary justify-center rounded-lg'
        activeOpacity={0.7}
        onPress={showTimeSelector}>
            <Text className='text-center text-primary text-md font-bold '>
                { selectedTime != "" ?
                `${title}: ${selectedTime}` : title}
            </Text>

            <DateTimePickerModal
                isVisible={isDatePickerVisible}
                mode="time"
                onConfirm={handleTimeSelection}
                onCancel={hideTimeSelector}
            />
        </TouchableOpacity>
    )}
