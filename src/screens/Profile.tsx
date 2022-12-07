import { useState } from 'react'
import { TouchableOpacity } from 'react-native'
import  { Center, ScrollView, VStack, Skeleton, Text, Heading, useToast } from 'native-base'

import * as ImagePicker from 'expo-image-picker'
// To manage file sizes in both iOS and Android devices
import * as FileSystem from 'expo-file-system';

import { Controller, useForm } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'

import { ScreenHeader } from '@components/ScreenHeader'
import { UserPhoto } from '@components/UserPhoto'
import { Input } from '@components/Input'
import { Button } from '@components/Button'
import { useAuth } from '@hooks/useAuth';
import { api } from '@services/api';
import { AppError } from '@utils/AppError';

const PHOTO_SIZE = 32

type FormDataProps = {
  name: string
  email: string
  password: string
  old_password: string
  password_confirm:string
}

const profileSchema = yup.object({
  name: yup.string().required('Name is required.'),
  password: 
    yup
      .string()
      .min(6, 'Password must be at least 6 characters.')
      .nullable()
      // if there is a value in the field leave this value, if not pass null.
      .transform((value) => !!value ? value : null),
  password_confirm: 
    yup
      .string()
      .nullable()
      // if there is a value in the field leave this value, if not pass null.
      .transform((value) => !!value ? value : null)
      .oneOf([yup.ref('password'), null], 'Passwords does not macth.')
      // if there is a value in 'password' field, this field will be required.
      .when('password', {
        is: (Field: any) => Field,
        then: yup
          .string().nullable()
          .required('Confirm new password.')
          .transform((value) => !!value ? value : null)
      })
})

export function Profile() {
  const [isUpdating, setIsUpdating] = useState(false)
  const [photoIsLoading, setPhotoIsLoading] = useState(false)
  const [userPhoto, setUserPhoto] = useState('https://github.com/edu2andrade.png')

  const toast = useToast()
  const { user, updateUserProfile } = useAuth()
  const { control, handleSubmit, formState: { errors } } = useForm<FormDataProps>({
    defaultValues: {
      name: user.name,
      email:user.email 
    },
    resolver: yupResolver(profileSchema)
  })

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
            title: 'The selected image is too big, Maximum size permitted is 5MB.',
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

  async function onChangeProfileUpdate(data: FormDataProps) {
    try {
      setIsUpdating(true)

      const userUpdated = user
      userUpdated.name = data.name

      await api.put('/users', {
        // In this case, we can simple pass 'data' too. The props names are the same...
        name: data.name,
        password: data.password,
        old_password: data.old_password
      })

      await updateUserProfile(userUpdated)

      toast.show({
        title: 'Profile updated',
        placement: 'top',
        bg: 'green.500'
      })

    } catch (error) {
      // the AppError messages exists in backend...
      const isAppError = error instanceof AppError
      const title = isAppError
        ? error.message
        : `We can't update your profile. Please try again later`

      toast.show({
        title,
        placement: 'top',
        bg:'red.500'
      })
    } finally {
      setIsUpdating(false)
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

          <Controller
            control={control}
            name="name"
            render={({ field: { value, onChange } }) => (
              <Input
                bg="gray.600"
                placeholder='Name'
                onChangeText={onChange}
                value={value}
                errorMessage={errors.name?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="email"
            render={({ field: { value, onChange } }) => (
              <Input
                bg="gray.600"
                placeholder='E-mail Address'
                onChangeText={onChange}
                value={value}
                isDisabled
              />
            )}
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

          <Controller
            control={control}
            name="old_password"
            render={({ field: { onChange } }) => (
              <Input
                bg="gray.600"
                placeholder='Old Password...'
                onChangeText={onChange}
                secureTextEntry
              />
            )}
          />

          <Controller
            control={control}
            name="password"
            render={({ field: { onChange } }) => (
              <Input
                bg="gray.600"
                placeholder='New Password...'
                onChangeText={onChange}
                errorMessage={errors.password?.message}
                secureTextEntry
              />
            )}
          />

          <Controller
            control={control}
            name="password_confirm"
            render={({ field: { onChange } }) => (
              <Input
                bg="gray.600"
                placeholder='Confirm New Password...'
                onChangeText={onChange}
                errorMessage={errors.password_confirm?.message}
                secureTextEntry
              />
            )}
          />
          
          <Button
            title='Update Profile'
            mt={4}
            onPress={handleSubmit(onChangeProfileUpdate)}
            isLoading={isUpdating}
          />
        </VStack>
      </ScrollView>
    </VStack>
  )
}