import { Heading, Image, VStack, Text, HStack, Icon } from 'native-base'
import { Entypo } from '@expo/vector-icons'
import { TouchableOpacity, TouchableOpacityProps } from 'react-native'

interface ExerciseCardProps extends TouchableOpacityProps {
  name: string
}

export function ExerciseCard({name, ...rest}: ExerciseCardProps) {
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
          source={{ uri: 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse4.mm.bing.net%2Fth%3Fid%3DOIP.Bn17nXnMlADgromKUdtM2QHaHa%26pid%3DApi&f=1&ipt=34cbd0f2b787db8756fc7e08b2858ef5c7ef085acbf011874a6890b467f4575c&ipo=images' }}
          alt="Chest Press exercise"
          w="16"
          h="16"
          mr={4}
          rounded="md"
          resizeMode="cover"
        />
        <VStack flex={1}>
          <Heading color="gray.100" fontSize="sm" fontFamily="heading">
            {name}
          </Heading>
          <Text
            color="gray.200"
            fontSize="xs"
            numberOfLines={2}
          >
            4 x 12 reps @70% RM
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