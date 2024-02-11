import { useContext } from 'react'
import { View } from 'react-native'
import { NavigationContainer } from '@react-navigation/native'

import { AuthRoutes } from './auth.routes'
import { AuthContext } from '../context/Auth'
import { AppRoutes } from './app.routes'

export function Routes() {
    const { signed } = useContext(AuthContext)

    return ( 
         <View className="flex-1 bg-background">
            {   
                signed ? 
                    <AppRoutes />:
                    <AuthRoutes />
            }
        </View> 
    )
}