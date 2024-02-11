import { useNavigation } from "@react-navigation/native"
import { Text } from "react-native"

export function HomeworksEmpty() {
  const { navigate } = useNavigation()

  return (
    <Text className="text-base justify-center text-center mx-5">
      Você ainda não tem nenhuma tarefa {' '}
      <Text
        className="text-primary text-base underline active:text-secondary"
        onPress={() => navigate('formday')}>
        comece cadastrando uma.
      </Text>
    </Text>
  )
}