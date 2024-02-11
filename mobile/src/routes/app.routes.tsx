import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { MaterialIcons } from '@expo/vector-icons'

const Tab = createBottomTabNavigator()
const Stack = createNativeStackNavigator()

import { Profile } from '../screens/Profile'

import { Day } from '../screens/Day'
import { FormDay } from '../screens/FormDay'

import { Month } from '../screens/Month'
import { Week } from '../screens/Week'
import { FormWeek } from '../screens/FormWeek'
import { FormEvent } from '../screens/FormEvent'
import { FormClass } from '../screens/FormClass'

export function DayStack() {
    return(
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen
            name='day'
            component={Day}
            />
            <Stack.Screen
            name='formday'
            component={FormDay}
            />
        </Stack.Navigator>
    )
}

export function MonthStack() {
    return(
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen
            name='month'
            component={Month}
            />
            <Stack.Screen
            name='week'
            component={Week}
            />
            <Stack.Screen
            name='formweek'
            component={FormWeek}
            />
            <Stack.Screen
            name='formevent'
            component={FormEvent}
            />
            <Stack.Screen
            name='formclass'
            component={FormClass}
            />
        </Stack.Navigator>
    )
}

export function ProfileStack() {
    return(
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen
            name='profile'
            component={Profile}
            />
        </Stack.Navigator>
    )
}

export function AppRoutes() {
    return(
        <Tab.Navigator screenOptions={{ headerShown: false }}>
             <Tab.Screen
            name='monthweek'
            component={MonthStack}
            options={{
                tabBarLabel: 'Meu Mês',
                tabBarIcon: ({ color, size }) => (
                    <MaterialIcons 
                    name="calendar-today" 
                    size={size} 
                    color={color} />
                ),
            }}
            />
            <Tab.Screen
            name='myday'
            component={DayStack}
            options={{
                tabBarLabel: 'Meu Dia',
                tabBarIcon: ({ color, size }) => (
                    <MaterialIcons 
                    name="add-task" 
                    size={size} 
                    color={color} />
                ),
            }}
            />
            <Tab.Screen
            name='profilestudent'
            component={ProfileStack}
            options={{
                tabBarLabel: 'Perfil',
                tabBarIcon: ({ color, size }) => (
                    <MaterialIcons 
                    name="person" 
                    size={size} 
                    color={color} />
                ),
            }}
            />

        </Tab.Navigator>
    )
}