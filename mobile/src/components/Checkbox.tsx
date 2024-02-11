import { Text, TouchableOpacity, View, TouchableOpacityProps } from 'react-native'
import { Feather } from '@expo/vector-icons'
import Animated, { ZoomIn, ZoomOut} from "react-native-reanimated"

interface Props extends TouchableOpacityProps {
    title: string,
    checked?: boolean,
}

export function Checkbox({ title, checked = false, ...rest }: Props) {

return(
    <TouchableOpacity
    activeOpacity={0.7}
    className='flex-row items-center mx-5 mb-2'
    {...rest} >
        {
            checked ?
            <Animated.View 
                className='w-8 h-8 bg-primary items-center justify-center rounded-lg'
                entering={ZoomIn}
                exiting={ZoomOut}
            >
                <Feather 
                name="check" 
                size={20} 
                color='white'/>
            </Animated.View>:
            <View className='w-8 h-8 border-2 border-primary items-center justify-center rounded-lg'/>
        }

        <Text className='text-lg font-semibold ml-3'>
            {title}
        </Text>
    </TouchableOpacity>
)}