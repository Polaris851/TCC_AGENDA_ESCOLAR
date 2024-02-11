import { useState } from 'react'
import { View, Text, TouchableOpacity, Alert } from 'react-native'
import { TextInput, Button } from 'react-native-paper'
import { Picker } from '@react-native-picker/picker'
import { useNavigation } from "@react-navigation/native"
import { Feather } from '@expo/vector-icons'

import { api } from '../lib/axios'

const CourseEnum: { [key: string]: string } =  {
    Quimica: 'Química',
    Mecatronica: 'Mecatrônica',
    Redes: 'Redes',
}

export function Register() {
  const { navigate } = useNavigation()

    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [course, setCourse] = useState(CourseEnum.Redes)
    const [ isVisible, setIsVisible ] = useState(true)

    function toggleVisibility() {
      setIsVisible(!isVisible)
    }
    async function handleSaveUser() {
        try {
            if(!name.trim() || !email.trim() || !password.trim()) {
                Alert.alert("Login", "Informe os seus dados para concluir o cadastro.")
                return
            }
            
            await api.post("/create", {
                name, 
                email, 
                password,
                course
            })

            setName("")
            setEmail("")
            setPassword("")

            Alert.alert("Login", "Seu cadastro foi realizado!", [{ 
                text: "OK", 
                onPress: () => { navigate('login')} 
            }])
            
        } catch (error) {
            console.log(error)
            Alert.alert("Ops", "Não foi possível criar seu cadastro.")
        }
    }

    return(
        <View className="flex-1 bg-background justify-center px-8">
            <View className="items-center mb-8 space-y-2">
                <Text className="font-bold text-primary text-2xl">Agenda Escolar</Text>
                <Text className="font-regular text-primary text-xl">Faça parte da nossa comunidade!</Text>
            </View>

            <TextInput
                label="Nome"
                value={name}
                onChangeText={name => setName(name)}
                className='w-auto bg-background my-2'
                mode='outlined'
                outlineColor='#306D9C'
                activeOutlineColor='#306D9C'
            />

            <TouchableOpacity 
                    className='w-auto h-12 my-2 border border-primary justify-center rounded-lg'
                    activeOpacity={0.7}
                >
                    <Picker
                        selectedValue={course}
                        onValueChange={itemValue => setCourse(itemValue)}
                    >
                        {Object.keys(CourseEnum).map((key) => (
                        <Picker.Item key={key} label={CourseEnum[key]} value={key} />
                        ))}
                    </Picker>
                </TouchableOpacity>


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
                    />} 
            />

            <Button 
                onPress={handleSaveUser}
                mode="contained" 
                className='w-auto h-12 my-2 bg-primary justify-center rounded-lg'
            >
                Cadastre-se
            </Button>

            <Text className="font-regular text-sm">Já possui uma conta? {' '}
                <Text
                    className="text-primary text-base underline active:text-secondary"
                    onPress={() => navigate('login')}>
                    Clique aqui
                </Text> 
            </Text>
            
        </View>
    )
}