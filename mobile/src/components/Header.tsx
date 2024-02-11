import { View, Text } from 'react-native'

import { NotificationModal } from './NotificationModal'

interface Props {
    title: string,
}

export function Header({title}: Props) {
    return(
        <View className='w-full h-20 bg-primary flex-row justify-center items-center px-5 rounded-b-2xl'>
            <View className='absolute'>
                <Text className='font-bold text-2xl justify-center text-white'>
                    {title}
                </Text>
            </View>

            <View className='right-5 absolute'>
                <NotificationModal />
            </View>
        
        </View>
    )}