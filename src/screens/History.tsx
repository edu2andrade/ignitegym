import { useState } from 'react'
import  { Heading, VStack, SectionList, Text } from 'native-base'

import { ScreenHeader } from '@components/ScreenHeader'
import { HistoryCard } from '@components/HistoryCard'

export function History() {
  const [exercises, setExercises] = useState([
    {
      title: "29.11.2022",
      data: ["Leg Press", "Deadlift"],
    },
    {
      title: "30.11.2022",
      data: ["Lat Pull Down", "Pull Ups", "Biceps Curl"],
    },
  ])
  return (
    <VStack flex={1}>
      <ScreenHeader title="Exercise history" />
      <SectionList
        px={8}
        sections={exercises}
        keyExtractor={item => item}
        renderItem={({ item }) => (
          <HistoryCard />
        )}
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