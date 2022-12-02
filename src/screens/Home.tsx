import { useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import { AppNavigatorRoutesProps } from '@routes/app.routes'

import  { VStack, FlatList, HStack, Heading, Text } from 'native-base'

import { HomeHeader } from '@components/HomeHeader'
import { Category } from '@components/Category'
import { ExerciseCard } from '@components/ExerciseCard'

export function Home() {
  const [categories, setCategories] = useState(['back', 'shoulders', 'chest', 'legs', 'biceps', 'triceps', 'abs'])
  const [exercises, setExercises] = useState(['Chest Press', 'Leg Press', 'Lat Pull Down', 'Deadlift'])
  const [categorySelected, setCategorySelected] = useState('back')

  const navigation = useNavigation<AppNavigatorRoutesProps>()

  function handleOpenExerciseDetails() {
    navigation.navigate('exercise')
  }

  return (
    <VStack flex={1}>
      <HomeHeader />
      <FlatList
        data={categories}
        keyExtractor={item => item}
        renderItem={({ item }) => (
          <Category
            name={item}
            isActive={categorySelected === item}
            onPress={() => setCategorySelected(item)}
          />
        )}
        horizontal
        showsHorizontalScrollIndicator={false}
        _contentContainerStyle={{ px: 8 }}
        my={10}
        maxH={10}
        minH={10}
      />
      <VStack flex={1} px={8}>
        <HStack justifyContent="space-between" mb={5}>
          <Heading
            color="gray.200"
            fontSize="md"
            fontFamily="heading"
          >
            Exercises
          </Heading>
          <Text
            color="gray.200"
            fontSize="sm"
          >
            {exercises.length}
          </Text>
        </HStack>
        <FlatList
          data={exercises}
          keyExtractor={item => item}
          renderItem={({ item }) => (
            <ExerciseCard
              name={item}
              onPress={handleOpenExerciseDetails}
            />
          )}
          showsVerticalScrollIndicator={false}
          _contentContainerStyle={{ pb: 20 }}
        />
      </VStack>
    </VStack>
  )
}