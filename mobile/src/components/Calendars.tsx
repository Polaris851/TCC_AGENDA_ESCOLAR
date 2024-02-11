import React, {useState} from 'react'
import {Calendar, LocaleConfig} from 'react-native-calendars'

LocaleConfig.locales['fr'] = {
  monthNames: [
    'Janeiro',
    'Fevereiro',
    'Março',
    'Abril',
    'Maio',
    'Junho',
    'Julho',
    'Agosto',
    'Setembro',
    'Outubro',
    'Novembro',
    'Dezembro'
  ],
  monthNamesShort: ['Jan.', 'Fev.', 'Mar.', 'Abr.', 'Mai', 'Jun', 'Jul.', 'Ago', 'Set.', 'Out.', 'Nov.', 'Dez.'],
  dayNames: ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'],
  dayNamesShort: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'],
  today: "Hoje"
}

LocaleConfig.defaultLocale = 'fr'

export function  Calendars() {
  const [selected, setSelected] = useState('')

  return (
    <Calendar
      onDayPress={day => {
        setSelected(day.dateString)
      }}
      markedDates={{
        [selected]: {selected: true, disableTouchEvent: true}
      }}
    />
  )
}