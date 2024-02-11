import { useState } from 'react'
import { View, ScrollView, Alert } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { TextInput, Button } from 'react-native-paper'

import { api } from '../lib/axios'
import { BackButton } from '../components/BackButton'

export function FormDay() {
    const { navigate } = useNavigation()
    
    const [title, setTitle] = useState("")

    async function handleCreateNewHomework() {
        try {
            if(!title.trim()) {
                Alert.alert("Meu Dia", "Informe a tarefa que será realizada hoje.")
                return
            }
            
            await api.post("/homeworks", {title})
            setTitle("")

            Alert.alert("Meu Dia", "Tarefa criada com sucesso!", [{ text: "OK", onPress: () => { navigate('day')} }])
        } catch (error) {
            console.log(error)
            Alert.alert("Ops", "Não foi possível criar a tarefa.")
        }
    }

    return(
        <View className='flex-1 bg-background pt-6'>
            <BackButton title='Meu Dia' />

            <ScrollView 
            className='mx-5 space-y-4 mt-6'
            showsVerticalScrollIndicator={false}>
                <TextInput
                label="Título"
                placeholder='O que você vai fazer hoje...'
                value={title}
                onChangeText={setTitle}
                className='w-auto bg-background'
                mode='outlined'
                outlineColor='#306D9C'
                activeOutlineColor='#306D9C'
                />

                <Button 
                onPress={handleCreateNewHomework}
                mode="contained" 
                className='w-auto h-12 bg-primary justify-center rounded-lg'>
                    Salvar
                </Button>
            </ScrollView>
        </View>
    )}