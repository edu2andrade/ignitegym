import { useCallback, useState } from 'react'
import  { Heading, VStack, SectionList, Text, useToast } from 'native-base'

import { useFocusEffect } from '@react-navigation/native'

import { ScreenHeader } from '@components/ScreenHeader'
import { HistoryCard } from '@components/HistoryCard'
import { AppError } from '@utils/AppError'
import { api } from '@services/api'
import { DailyHistoryDTO } from '@dtos/DailyHistoryDTO'

export function History() {
  const [isLoading, setIsLoading] = useState(true)
  const [exercises, setExercises] = useState<DailyHistoryDTO[]>([])

  const toast = useToast()

  async function fetchHistory() {
    try {
      setIsLoading(true)

      const response = await api.get('/history')
      setExercises(response.data)
      
    } catch (error) {
      const isAppError = error instanceof AppError
      const title = isAppError 
        ? error.message
        : `We can't load your history now. Please try again later` 
        
      toast.show({
        title,
        placement: 'top',
        bg:'red.500'
      })
    } finally {
      setIsLoading(false)
    }
  }

  useFocusEffect(useCallback(() => {
    fetchHistory()
  }, []))

  return (
    <VStack flex={1}>
      <ScreenHeader title="Exercise history" />
      <SectionList
        px={8}
        sections={exercises}
        keyExtractor={item => item.id}
        renderItem={({ item }) => <HistoryCard data={item} />}
        renderSectionHeader={({ section }) => (
          <Heading color="gray.200" fontSize="md" mt={10} mb={3} fontFamily="heading">
            {section.title}
          </Heading>
        )}
        contentContainerStyle={exercises.length === 0 && { flex: 1, justifyContent: 'center' }}
        ListEmptyComponent={() => (
          <Text color="gray.100" textAlign="center">
            There's nothing here yet...
          </Text>
        )}
      />
    </VStack>
  )
}