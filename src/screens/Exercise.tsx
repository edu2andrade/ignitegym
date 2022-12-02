import { TouchableOpacity } from 'react-native'
import  { VStack, Icon, HStack, Heading, Text, Image, Box, ScrollView } from 'native-base'

import { useNavigation } from '@react-navigation/native'
import { AppNavigatorRoutesProps } from '@routes/app.routes'

import { Feather } from '@expo/vector-icons'
import BodySvg from '@assets/body.svg'
import SeriesSvg from '@assets/series.svg'
import RepetitionsSvg from '@assets/repetitions.svg'
import { Button } from '@components/Button'

export function Exercise() {
  const navigation = useNavigation<AppNavigatorRoutesProps>()

  function handleGoBack() {
    navigation.goBack()
  }
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
              Lat Pull Down
            </Heading>
            <HStack alignItems="center">
              <BodySvg />
              <Text
                color="gray.200"
                ml={1}
                textTransform="capitalize"
                fontSize="sm"
              >
                Back
              </Text>
            </HStack>
          </HStack>
      </VStack>
      <ScrollView>
        <VStack p={8}>
            <Image
              source={{ uri: 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse4.mm.bing.net%2Fth%3Fid%3DOIP.Bn17nXnMlADgromKUdtM2QHaHa%26pid%3DApi&f=1&ipt=34cbd0f2b787db8756fc7e08b2858ef5c7ef085acbf011874a6890b467f4575c&ipo=images' }}
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
                    3 sets
                  </Text>
                </HStack>
                <HStack>
                  <RepetitionsSvg />
                  <Text color="gray.200" ml={2}>
                    12 Reps
                  </Text>
                </HStack>
              </HStack>
              <Button
                title='Mark as done'
              />
            </Box>
        </VStack>
      </ScrollView>
    </VStack>
  )
}