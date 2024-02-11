import { useState } from 'react'
import { TouchableOpacity, Text} from 'react-native'
import DateTimePickerModal from "react-native-modal-datetime-picker"

interface Props {
    title: string,
    onDate: Function
}

export function DateTimePicker({title, onDate}: Props) {
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false)
    const [selectedDate, setSelectedDate] = useState('')

    function showDateSelector() {
      setDatePickerVisibility(true)
    }
  
    function hideDateSelector() {
      setDatePickerVisibility(false)
    }
  
    function handleDateSelection(date: Date) {
        const dateISOString = date.toISOString()
        onDate(dateISOString)
        const formattedDate = new Date(dateISOString).toLocaleDateString('pt-BR') 

        setSelectedDate(formattedDate)
        hideDateSelector()
    }

    return(
        <TouchableOpacity 
        className='w-auto h-12 mt-6 border border-primary justify-center rounded-lg'
        activeOpacity={0.7}
        onPress={showDateSelector} >
            <Text className='text-center text-primary text-md font-bold '>
                { selectedDate != "" ?
                `${title}: ${selectedDate}` : title}
            </Text>

            <DateTimePickerModal
                isVisible={isDatePickerVisible}
                mode="date"
                onConfirm={handleDateSelection}
                onCancel={hideDateSelector}
            />
        </TouchableOpacity>
    )}