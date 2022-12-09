import { useCallback, useState } from 'react'
import  { Heading, VStack, SectionList, Text, useToast, Center } from 'native-base'

import { useFocusEffect } from '@react-navigation/native'
import { useAuth } from '@hooks/useAuth'
import { api } from '@services/api'
import { AppError } from '@utils/AppError'

import { DailyHistoryDTO } from '@dtos/DailyHistoryDTO'

import { ScreenHeader } from '@components/ScreenHeader'
import { HistoryCard } from '@components/HistoryCard'
import { Loading } from '@components/Loading'

export function History() {
  const [isLoading, setIsLoading] = useState(true)
  const [exercises, setExercises] = useState<DailyHistoryDTO[]>([])

  const toast = useToast()
  const { refreshedToken } = useAuth()

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
  }, [refreshedToken]))

  return (
    <VStack flex={1}>
      <ScreenHeader title="Exercise history" />
      {
        isLoading ? <Loading /> : (
          exercises?.length > 0
          ? <SectionList
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
              showsVerticalScrollIndicator={false}
            />
          : <Center flex={1}>
              <Text color="gray.100" textAlign="center">
                There's nothing here yet...
              </Text>
            </Center>

            
        )
      }
    </VStack>
  )
}