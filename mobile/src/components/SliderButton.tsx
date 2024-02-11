import { Text, TouchableOpacity, View} from 'react-native'
import { useNavigation, useRoute } from '@react-navigation/native'

import clsx from "clsx"

export function SliderButton() {
    const { navigate } = useNavigation()

    const route = useRoute()
    
    return(
        <View
        className='flex-row my-2 items-center justify-center mx-5 bg-sky-100 h-16 w-auto rounded-2xl'
        >
            <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => navigate('month')}
            >
                <View className={clsx('w-40 mx-2 justify-center',
                                { ['h-12 bg-primary rounded-2xl'] : route.name == 'month'})}>
                    <Text className={clsx('text-xl font-bold text-center',
                                { ['text-white'] : route.name == 'month'})}>Mês</Text>
                </View>
            </TouchableOpacity>
            <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => navigate('week')}
            >
                <View className={clsx('w-40 mx-2 justify-center',
                                { ['h-12 bg-primary rounded-2xl'] : route.name == 'week'})}>
                    <Text className={clsx('text-xl font-bold text-center',
                                { ['text-white'] : route.name == 'week'})}>Semana</Text>
                </View>
            </TouchableOpacity>
        </View>
    )}
