import { View, Text, TouchableOpacityProps} from 'react-native'

import { DeleteModal } from './DeleteModal'

interface Props extends TouchableOpacityProps {
    title: string,
    discipline: string,
    dueDate: string,
}

export function CardEvent({ title, discipline, dueDate, ...rest  }: Props) {
    return(
        <View className='w-auto h-16 mt-6 bg-primary flex-row justify-between items-center px-6 rounded-2xl'>
           <Text className='text-white capitalize'>
                <Text className='font-bold text-lg'>{title}</Text> - <Text className='text-base '>{discipline}</Text>
            </Text> 
            
            <View className='flex-row items-center'>
                <Text className='text-white mr-1 font-bold text-lg'>{dueDate}</Text>
                <DeleteModal title="esse evento" color="white" {...rest} />
            </View>
        </View>
    )}