import { TouchableOpacity } from 'react-native'
import { HStack, Text, Heading, VStack, Icon } from 'native-base'

import { MaterialIcons } from '@expo/vector-icons'
import defaultUserPhotoImg from '@assets/userPhotoDefault.png'

import { UserPhoto } from './UserPhoto'
import { useAuth } from '@hooks/useAuth'

export function HomeHeader() {
  const { user, signOut } = useAuth()
  return (
    <HStack
      bg="gray.600"
      pt={16}
      pb={5}
      px={8}
      alignItems="center"
    >
      <UserPhoto
        source={user.avatar ? { uri: user.avatar } : defaultUserPhotoImg }
        alt="Profile picture of a user smiling"
        size={16}
        mr={4}
      />
      <VStack flex={1}>
        <Text color="gray.100" fontSize="md">
          Hello,
        </Text>
        <Heading color="gray.100" fontSize="lg" fontFamily="heading">
          {user.name}
        </Heading>
      </VStack>
      <TouchableOpacity onPress={signOut}>
        <Icon
          as={MaterialIcons}
          name="logout"
          color="gray.200"
          size={7}
        />
      </TouchableOpacity>
    </HStack>
  )
}