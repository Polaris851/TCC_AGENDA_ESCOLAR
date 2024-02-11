import { createNativeStackNavigator } from '@react-navigation/native-stack'

import { SignIn } from '../screens/SignIn'
import { Register } from '../screens/Register'

const AuthStack = createNativeStackNavigator()

export function AuthRoutes() {
    return(
        <AuthStack.Navigator screenOptions={{ headerShown: false }}>
            <AuthStack.Screen
            name='login'
            component={SignIn}
            />
            <AuthStack.Screen
            name='register'
            component={Register}
            />
        </AuthStack.Navigator>
    )
}
