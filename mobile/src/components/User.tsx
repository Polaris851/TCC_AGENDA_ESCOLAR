import { View, Text, TouchableOpacity} from 'react-native'
import { Feather } from '@expo/vector-icons'

import { useAuth } from '../context/Auth'

export function User() {
    const { user, signOut } = useAuth()

    return(
        <View className='flex-row items-center justify-between'>
            <View className='pt-6'>
                <Text className='text-lg font-bold'>{user?.name ?? ""}</Text>
                <View className='flex-row space-x-2'>
                    <Text className='text-base font-bold'>Curso:</Text>
                    <Text className='text-base font-regular'>{user?.course ?? ""}</Text>
                </View>
            </View>

            <TouchableOpacity
            className='flex-row items-center pt-6 '
                activeOpacity={0.7}
                onPress={signOut}
            >
                <Feather 
                    name="log-out" 
                    size={22} 
                    color="black"
                />
            </TouchableOpacity>
        </View>
    )}