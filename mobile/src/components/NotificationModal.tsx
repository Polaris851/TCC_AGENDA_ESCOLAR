import { useState, useEffect } from 'react'
import { Modal, Text, View, TouchableOpacity, Alert } from 'react-native'
import { Feather } from '@expo/vector-icons'

import dayjs from 'dayjs'

import { api } from '../lib/axios'
import { Loading } from './Loading'

type NotificationsProps = Array<{
  id: string,
  title: string,
  discipline: {
    discipline: string;
    id: string;
    field: string;
    student_id: string;
  },
  dueDate: string,
}>

export function NotificationModal() {
  const [loading, setLoading] = useState(true)
  const [notification, setNotification] = useState<NotificationsProps | null>(null)
  const [modalVisible, setModalVisible] = useState(false)

  async function fetchData() {
    try {
        setLoading(true)
        const response = await api.get('/notifications')
        setNotification(response.data)
      } catch (error) {
        Alert.alert('Ops', 'Não foi possível carregar as notificações.')
        console.log(error)
      } finally {
        setLoading(false)
      }
  }

  useEffect(() => {
      fetchData()
  }, [])

  if (loading) {
      return (
        <Loading />
      )
    }

    return(
    <View>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(!modalVisible)
          }}>
          <View className='align-center justify-center flex-1'>
            <View className='bg-white border-2 border-primary rounded-xl m-10 p-10 shadow-xl'>
              <TouchableOpacity
              className='right-2 mt-2 absolute'
                  onPress={() => setModalVisible(!modalVisible)} 
                  activeOpacity={0.7}>
                    <Feather 
                    name="x" 
                    size={22} 
                    color="black" />
              </TouchableOpacity>
                {
                  notification?.map(value => (
                    <View key={value.id} className='w-auto my-2 flex-row justify-between'>
                        <Text className='capitalize'>
                          <Text className='font-bold text-lg'>{value.title}</Text> - <Text className='text-base'>{value.discipline.discipline}</Text>
                        </Text> 
                        
                        <Text className='font-bold text-lg'>{dayjs(value.dueDate).format('DD/MM')}</Text>
                    </View>
                  ))
                }
            </View>
          </View>
        </Modal>
        <TouchableOpacity
          onPress={() => setModalVisible(true)}
          activeOpacity={0.7}>
           <Feather 
              name="bell" 
              size={22} 
              color="white" />
        </TouchableOpacity>
      </View>
    )}
