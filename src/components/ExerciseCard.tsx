import { Heading, Image, VStack, Text, HStack, Icon } from 'native-base'
import { TouchableOpacity, TouchableOpacityProps } from 'react-native'
import { Entypo } from '@expo/vector-icons'
import { ExerciseDTO } from '@dtos/ExercisesDTO'

import { api } from '@services/api'

interface ExerciseCardProps extends TouchableOpacityProps {
  data: ExerciseDTO
}

export function ExerciseCard({data, ...rest}: ExerciseCardProps) {
  return (
    <TouchableOpacity
      {...rest}
    >
      <HStack
        bg="gray.500"
        p={2}
        pr={4}
        mb={3}
        alignItems="center"
        rounded="md"
      >
        <Image
          source={{ uri: `${api.defaults.baseURL}/exercise/thumb/${data.thumb}` }}
          alt="Exercise image"
          w="16"
          h="16"
          mr={4}
          rounded="md"
          resizeMode="cover"
        />
        <VStack flex={1}>
          <Heading color="gray.100" fontSize="sm" fontFamily="heading">
            {data.name}
          </Heading>
          <Text
            color="gray.200"
            fontSize="xs"
            numberOfLines={2}
          >
            {data.series} x {data.repetitions} reps @70% RM
          </Text>
        </VStack>
        <Icon
          as={Entypo}
          name="chevron-thin-right"
          color="gray.300"
        />
      </HStack>
    </TouchableOpacity>
  )
}