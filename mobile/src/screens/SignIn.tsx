import { useState } from 'react'
import { View, Text} from 'react-native'
import { TextInput, Button } from 'react-native-paper'
import { useNavigation } from "@react-navigation/native"
import { useAuth } from '../context/Auth'
import { Feather } from '@expo/vector-icons'

export function SignIn() {
    const { navigate } = useNavigation()
    const { signIn, signed } = useAuth()

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [ isVisible, setIsVisible ] = useState(true)

    function toggleVisibility() {
      setIsVisible(!isVisible)
    }

    async function handleSignIn() {
        await signIn({ email, password})
    }

    if(signed) {
        navigate('month')
    } else {
        return(
            <View className="flex-1 bg-background justify-center px-8">
                <View className="items-center m-8 space-y-2">
                    <Text className="font-bold text-primary text-2xl">Agenda Escolar</Text>
                    <Text className="font-regular text-primary text-xl">Boas vindas!</Text>
                </View>

                <TextInput
                label="Email"
                value={email}
                onChangeText={email => setEmail(email)}
                className='w-auto bg-background my-2'
                mode='outlined'
                outlineColor='#306D9C'
                activeOutlineColor='#306D9C'
                />

                <TextInput
                label="Senha"
                value={password}
                onChangeText={password => setPassword(password)}
                className='w-auto bg-background my-2'
                mode='outlined'
                outlineColor='#306D9C'
                activeOutlineColor='#306D9C'
                secureTextEntry={ isVisible }
                right={
                    <TextInput.Icon 
                        icon={() => <Feather name={isVisible ? "eye-off" : "eye"} size={20} color='black' />} 
                        onPress={toggleVisibility}             
                    />
                } />

                    <Button 
                        onPress={handleSignIn}
                        mode="contained" 
                        className='w-auto h-12 my-2 bg-primary justify-center rounded-lg'
                    >
                        Entrar
                    </Button>

                    <Text className="font-regular text-sm">Não tem uma conta? {' '}
                        <Text
                        className="text-primary text-base underline active:text-secondary"
                        onPress={() => navigate('register')}>
                            Cadastre-se    
                        </Text>
                    </Text>

            </View>
        )
    }    
}