import { useState } from 'react'
import { View, TouchableOpacity, ScrollView, Alert } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { TextInput, Button } from 'react-native-paper'
import { Picker } from '@react-native-picker/picker'

import { api } from '../lib/axios'
import { BackButton } from '../components/BackButton'
import { InputDayTime, InputDayTimeData } from '../components/InputDayTime'

export const FieldEnum: { [key: string]: string } =  {
    Matematica: 'Matemática',
    Naturezas: 'Ciências da Natureza',
    Humanas: 'Ciências Humanas',
    Linguagens: 'Linguagens',
    Tecnico: 'Técnico',
}

export function FormClass() {
    const { navigate } = useNavigation()

    const [discipline, setDiscipline] = useState("")
    const [disciplineTimes, setDisciplineTimes] = useState<InputDayTimeData[]>([])
    const [field, setField] = useState('Matematica')

    async function handleCreateNewDiscipline() {
        try {
            if(!discipline.trim()) {
                Alert.alert("Matérias", "Informe os dados das matérias.")
                return
            }
            await api.post("/disciplines", {
                discipline,
                field,
                disciplineTimes
            })
            
            setDiscipline("")
            setField('Matematica')

            Alert.alert("Matérias", "Matéria criada com sucesso!", [{ text: "OK", onPress: () => { navigate('week')} }])
        } catch (error) {
            console.log(error)
            Alert.alert("Ops", "Não foi possível criar a matéria.")
        }
    }

    return(
        <View className='flex-1 bg-background pt-6'>
            <BackButton title='Matérias' />

            <ScrollView 
                className='mx-5 space-y-4 mt-6'
                showsVerticalScrollIndicator={false}
            >
                <TextInput
                    label="Matéria"
                    value={discipline}
                    placeholder='Coloque o nome da máteria...'
                    onChangeText={discipline => setDiscipline(discipline)}
                    className='w-auto bg-background'
                    mode='outlined'
                    outlineColor='#306D9C'
                    activeOutlineColor='#306D9C'
                />

                <TouchableOpacity 
                    className='w-auto h-12 mt-6 border border-primary justify-center rounded-lg'
                    activeOpacity={0.7}
                >
                    <Picker
                        selectedValue={field}
                        onValueChange={itemValue => setField(itemValue)}
                    >
                        {Object.keys(FieldEnum).map((key) => (
                        <Picker.Item key={key} label={FieldEnum[key]} value={key} />
                        ))}
                    </Picker>
                </TouchableOpacity>
                
                <InputDayTime
                    onChange={setDisciplineTimes}
                />

                <Button 
                    onPress={handleCreateNewDiscipline}
                    mode="contained" 
                    className='w-auto h-12 bg-primary justify-center rounded-lg'
                >
                    Salvar
                </Button>
            </ScrollView>
        </View>
    )}