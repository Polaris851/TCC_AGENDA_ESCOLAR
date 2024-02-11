import { useState, useCallback } from 'react'
import { useFocusEffect } from '@react-navigation/native'
import { View, ScrollView, Alert, TouchableOpacity } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { TextInput, Button } from 'react-native-paper'
import { Picker } from '@react-native-picker/picker'

import { api } from '../lib/axios'
import { BackButton } from '../components/BackButton'
import { DateTimePicker } from '../components/DateTimePicker'
import { Loading } from '../components/Loading'

const TitleEnum: { [key: string]: string } =  {
    Prova: 'Prova',
    Seminario: 'Seminário',
    Tarefa: 'Tarefa',
    Trabalho: 'Trabalho',
}

type DisciplineInfoProps = Array<{
    id: string,
    discipline: string,
    field: string,
}>

export function FormEvent() {
    const { navigate } = useNavigation()

    const [ loading, setLoading ] = useState(true)
    const [ disciplineInfo, setDisciplineInfo ] = useState<DisciplineInfoProps | null>(null)

    const [title, setTitle] = useState(TitleEnum.Prova)
    const [discipline, setDiscipline ] = useState<DisciplineInfoProps>()
    const [dueDate, setDueDate] = useState("")
    const [alertDate, setAlertDate] = useState("")
    const [description, setDescription] = useState("")

    async function handleCreateNewEvent() {
        try {
            if(!title.trim() && !discipline && !dueDate) {
                Alert.alert("Eventos", "Informe os dados do evento.")
                return
            }

            const currentDate = new Date()
            const eventDueDate = new Date(dueDate)

            if (eventDueDate < currentDate) {
                Alert.alert("Eventos", "A data do evento deve ser igual ou maior que a data atual.")
                return
            }

            await api.post("/monthlyevents", { title, discipline_id: discipline, dueDate, alertDate, description })

            setTitle(TitleEnum.Prova)
            setDescription("")

            Alert.alert("Eventos", "Evento criado com sucesso!", [{ text: "OK", onPress: () => { navigate('month')} }])
        } catch (error) {
            console.log(error)
            Alert.alert("Ops", "Não foi possível criar o evento.")
        }
    }

    function handleDateEvent(dateEvent: string) {
        setDueDate(dateEvent)
    }

    function handleDateAlertEvent(dateEvent: string) {
        setAlertDate(dateEvent)
    }

    async function fetchDisciplines() {
        try {
           setLoading(true)

            const response = await api.get("/discipline")
            setDisciplineInfo(response.data)
            setDiscipline(response.data?.[0].id ?? undefined)
        } catch (error) {
            console.log(error)
            Alert.alert("Ops", "Não foi possível carregar as informações dos eventos.")
        } finally {
            setLoading(false)
        }
    }

    useFocusEffect(useCallback(() => {
        fetchDisciplines()
    }, []))

    if(loading) {
        return(
            <Loading />
        )
    }
    
    return(
        <View className='flex-1 bg-background pt-6'>
            <BackButton title='Eventos' />

            <ScrollView 
            className='mx-5 space-y-4 mt-6'
            showsVerticalScrollIndicator={false}>
                <TouchableOpacity 
                className='w-auto h-12 mt-6 border border-primary justify-center rounded-lg'
                activeOpacity={0.7}>
                    <Picker
                    selectedValue={title}
                    onValueChange={itemValue => setTitle(itemValue)}>
                        {Object.keys(TitleEnum).map((key) => (
                        <Picker.Item key={key} label={TitleEnum[key]} value={key} />
                        ))}
                    </Picker>
                </TouchableOpacity>
                
                <TouchableOpacity 
                className='w-auto h-12 border border-primary justify-center rounded-lg'
                activeOpacity={0.7} >
                    <Picker 
                    selectedValue={discipline} 
                    onValueChange={disciplineId => setDiscipline(disciplineId)}>
                    {   disciplineInfo ?
                        disciplineInfo.map((discipline) => (
                            <Picker.Item key={discipline.id} label={discipline.discipline} value={discipline.id} />
                        )) :
                        <Picker.Item label="Nenhuma disciplina disponível" value={null} />
                    }
                    </Picker>
                </TouchableOpacity>

                <DateTimePicker title='Data de Entrega' onDate={handleDateEvent} />
                
                <DateTimePicker title='Data de Alerta' onDate={handleDateAlertEvent}/>

                <TextInput
                label="Descrição"
                value={description}
                onChangeText={description => setDescription(description)}
                className='w-auto bg-background'
                mode='outlined'
                outlineColor='#306D9C'
                activeOutlineColor='#306D9C'
                /> 

                <Button 
                onPress={handleCreateNewEvent}
                mode="contained" 
                className='w-auto h-12 bg-primary justify-center rounded-lg'>
                    Salvar
                </Button>
            </ScrollView>
        </View>
    )}