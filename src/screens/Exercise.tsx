import { useEffect, useState } from 'react'
import { TouchableOpacity } from 'react-native'
import  { VStack, Icon, HStack, Heading, Text, Image, Box, ScrollView, useToast } from 'native-base'

import { useNavigation, useRoute } from '@react-navigation/native'
import { AppNavigatorRoutesProps } from '@routes/app.routes'

import { AppError } from '@utils/AppError'
import { api } from '@services/api'

import { Feather } from '@expo/vector-icons'
import BodySvg from '@assets/body.svg'
import SeriesSvg from '@assets/series.svg'
import RepetitionsSvg from '@assets/repetitions.svg'
import { Button } from '@components/Button'

import { ExerciseDTO } from '@dtos/ExercisesDTO'
import { Loading } from '@components/Loading'

type RouteParamsProps = {
  exerciseId: string
}

export function Exercise() {
  const [submittingRegister, setSubmittingRegister] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [exercise, setExercise] = useState<ExerciseDTO>({} as ExerciseDTO)
  const navigation = useNavigation<AppNavigatorRoutesProps>()

  const route = useRoute()
  const toast = useToast()

  const { exerciseId } = route.params as RouteParamsProps


  async function fetchExerciseDetails() {
    try {
      setIsLoading(true)
      
      const response = await api.get(`/exercises/${exerciseId}`)
      setExercise(response.data)
      
    } catch (error) {
      const isAppError = error instanceof AppError
      const title = isAppError 
        ? error.message
        : `We can't load the exercise details now. Please try again later` 
        
      toast.show({
        title,
        placement: 'top',
        bg:'red.500'
      })
    } finally {
      setIsLoading(false)
    }
  }

  async function handleExerciseHistoryRegister() {
    try {
      setSubmittingRegister(true)
      await api.post('/history', { exercise_id: exerciseId })

      toast.show({
        title: 'Well done! Keep going!',
        placement: 'top',
        bg:'green.700'
      })

      navigation.navigate('home')
      
    } catch (error) {
      const isAppError = error instanceof AppError
      const title = isAppError 
        ? error.message
        : `We can't register your exercise now. Please try again later` 
        
      toast.show({
        title,
        placement: 'top',
        bg:'red.500'
      })
    } finally {
      setSubmittingRegister(false)
    }
  }

  function handleGoBack() {
    navigation.goBack()
  }

  useEffect(() => {
    fetchExerciseDetails()
  }, [exerciseId])

  return (
    <VStack flex={1}>
      <VStack bg="gray.600" pt={12} px={8}>
          <TouchableOpacity onPress={handleGoBack}>
            <Icon
              as={Feather}
              name="arrow-left"
              color="green.500"
              size={6}
            />
          </TouchableOpacity>
          <HStack 
            justifyContent="space-between"
            alignItems="center"
            mt={4}
            mb={8}
          >
            <Heading
              color="gray.100"
              fontSize="lg"
              fontFamily="heading"
              flexShrink={1}
            >
              {exercise.name}
            </Heading>
            <HStack alignItems="center">
              <BodySvg />
              <Text
                color="gray.200"
                ml={1}
                textTransform="capitalize"
                fontSize="sm"
              >
                {exercise.group}
              </Text>
            </HStack>
          </HStack>
      </VStack>
      {isLoading
        ? <Loading />
        : <ScrollView>
            <VStack p={8}>
                <Image
                  source={{ uri: `${api.defaults.baseURL}/exercise/demo/${exercise.demo}` }}
                  alt="Exercise Name"
                  w="full"
                  h="80"
                  resizeMode='cover'
                  mb={3}
                  rounded="lg"
                />
                <Box
                  bg="gray.600"
                  pb={4}
                  px={4}
                  rounded="md"
                >
                  <HStack
                    alignItems="center"
                    justifyContent="space-around"
                    mb={6}
                    mt={5}
                  >
                    <HStack>
                      <SeriesSvg />
                      <Text color="gray.200" ml={2}>
                        {exercise.series} sets
                      </Text>
                    </HStack>
                    <HStack>
                      <RepetitionsSvg />
                      <Text color="gray.200" ml={2}>
                        {exercise.repetitions} Reps
                      </Text>
                    </HStack>
                  </HStack>
                  <Button
                    title='Mark as done'
                    isLoading={submittingRegister}
                    onPress={handleExerciseHistoryRegister}
                  />
                </Box>
            </VStack>
          </ScrollView>
      }
    </VStack>
  )
}