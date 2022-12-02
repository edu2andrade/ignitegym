import { useState } from 'react'
import { TouchableOpacity } from 'react-native'
import  { Center, ScrollView, VStack, Skeleton, Text, Heading, useToast } from 'native-base'

import * as ImagePicker from 'expo-image-picker'
// To manage file sizes in both iOS and Android devices
import * as FileSystem from 'expo-file-system';


import { ScreenHeader } from '@components/ScreenHeader'
import { UserPhoto } from '@components/UserPhoto'
import { Input } from '@components/Input'
import { Button } from '@components/Button'

const PHOTO_SIZE = 32

export function Profile() {
  const [photoIsLoading, setPhotoIsLoading] = useState(false)
  const [userPhoto, setUserPhoto] = useState('https://github.com/edu2andrade.png')

  const toast = useToast()

  async function handleUserPhotoSelect() {
    setPhotoIsLoading(true)
    try {
      const photoSelected = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
        allowsEditing: true,
        aspect: [4, 4],
      })
  
      if (photoSelected.canceled) {
        return
      }
      if (photoSelected.assets[0].uri) {

        // checking if the imagesize aren't too big...
        const photoInfo = await FileSystem.getInfoAsync(photoSelected.assets[0].uri)
        if(photoInfo.size && (photoInfo.size / 1024 /1024) > 5) {
          return toast.show({
            title: 'he selected image is too big, Maximum size permitted is 5MB.',
            placement: 'top',
            bg: 'red.500'
          })
        }
        
        setUserPhoto(photoSelected.assets[0].uri)
      }
      
    } catch (error) {
      console.log(error)
    } finally {
      setPhotoIsLoading(false)
    }
  }

  return (
    <VStack flex={1}>
      <ScreenHeader title='Profile'/>
      <ScrollView contentContainerStyle={{ paddingBottom: 36 }}>
        <Center mt={6} px={10}>
          {photoIsLoading ?
            <Skeleton
              w={PHOTO_SIZE}
              h={PHOTO_SIZE}
              rounded="full"
              startColor="gray.500"
              endColor="gray.400"
            />
            :
            <UserPhoto
              source={{ uri: userPhoto }}
              alt='Profile picture of a user smiling'
              size={PHOTO_SIZE}
            />
          }

          <TouchableOpacity onPress={handleUserPhotoSelect}>
            <Text
              color="green.500"
              fontWeight="bold"
              fontSize="md"
              mt={2}
              mb={8}
            >
              Change photo
            </Text>
          </TouchableOpacity>
          <Input
            bg="gray.600"
            placeholder='Name'
          />
          <Input
            bg="gray.600"
            value='E-mail Address'
            isDisabled
          />
        </Center>
        <VStack px={10} mt={12} mb={9}>
          <Heading
            color="gray.200"
            fontSize="md"
            fontFamily="heading"
            mb={2}
          >
            Change Password
          </Heading>
          <Input
            bg="gray.600"
            placeholder='Old Password...'
            secureTextEntry
          />
          <Input
            bg="gray.600"
            placeholder='New Password...'
            secureTextEntry
          />
          <Input
            bg="gray.600"
            placeholder='Confirm New Password...'
            secureTextEntry
          />
          <Button
            title='Update Profile'
            mt={4}
          />
        </VStack>
      </ScrollView>
    </VStack>
  )
}