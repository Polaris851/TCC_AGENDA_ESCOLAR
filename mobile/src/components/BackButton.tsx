import { View, Text, TouchableOpacity} from 'react-native'
import { Feather } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'

interface Props {
    title: string,
}

export function BackButton({title}: Props) {
    const { goBack } = useNavigation()

    return(
        <View className='w-full h-20 bg-primary flex-row justify-center items-center px-5 rounded-b-2xl'>
            <View className='left-5 absolute'>
                <TouchableOpacity
                activeOpacity={0.7}
                onPress={goBack} >
                    <Feather 
                    name="arrow-left" 
                    size={22}
                    color='white' />
                </TouchableOpacity>
            </View>

            <View className='absolute'>
                <Text className='font-bold text-2xl justify-center text-white'>
                    {title}
                </Text>
            </View>
        </View>
    )}