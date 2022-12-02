import React from 'react'
import { Heading, HStack, VStack, Text } from 'native-base'

export function HistoryCard() {
  return (
    <HStack
      w="full"
      px={5}
      py={4}
      mb={3}
      bg="gray.600"
      rounded="md"
      alignItems="center"
      justifyContent="space-between"
    >
      <VStack mr={5} flex={1}>
        <Heading
          color="white"
          fontSize="md"
          fontFamily="heading"
          textTransform="capitalize"
          numberOfLines={1}
        >
          Back
        </Heading>
        <Text
          color="gray.200"
          fontSize="md"
          numberOfLines={1}
        >
          Lat Pull Down
        </Text>
      </VStack>
      <Text color="gray.300" fontSize="md">
        6:53
      </Text>
    </HStack>
  )
}