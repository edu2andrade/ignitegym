import { VStack, Image, Text, Center, Heading, ScrollView, useToast } from "native-base";

import { useNavigation } from "@react-navigation/native";
import { AuthNavigatorRoutesProps } from '@routes/auth.routes'

import { api } from '@services/api'

import { useForm, Controller } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'

import LogoSvg from '@assets/logo.svg';
import BGImg from '@assets/background.png';

import { Input } from '@components/Input'
import { Button } from "@components/Button";
import { AppError } from "@utils/AppError";
import { useState } from "react";
import { useAuth } from "@hooks/useAuth";

type FormDataProps = {
  name: string
  email: string
  password: string
  confirm_password: string
}

const registerSchema = yup.object({
  name: yup.string().required('Name is required'),
  email: yup.string().required('E-mail is required').email('Invalid email'),
  password: yup.string().required('Password is required').min(6, 'Password must be at least 6 characters'),
  confirm_password: yup.string().required('Confirm your Password').oneOf([yup.ref('password'), null], 'Passwords does not macth')
})

export function Register() {
  const [isLoading, setIsLoading] = useState(false)

  const { control, handleSubmit, formState: { errors } } = useForm<FormDataProps>({
    resolver: yupResolver(registerSchema)
  })

  const toast = useToast()
  const { signIn } = useAuth()

  async function onSubmit({ name, email, password }: FormDataProps) {
    // using axios:
    try {
      setIsLoading(true)
      await api.post('/users', { name, email, password })
      await signIn(email, password)
      
    } catch (error) {
      setIsLoading(false)
      const isAppError = error instanceof AppError
      const title = isAppError 
        ? error.message
        : `We can't create your account now. Please try again later` 
        
      toast.show({
        title,
        placement: 'top',
        bg:'red.500'
      })
    }

    /* --> using fetch async/await:
    const response = await fetch('http://192.168.1.17:3333/users', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name, email, password })
    })
      const data = await response.json()
      console.log(data)
    */

    /*
      --> using fetch "then" (async is not required):

      fetch('http://192.168.1.17:3333/users', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, email, password })
      })
        .then(res => res.json())
        .then(data => console.log(data))
     */
  }

  const navigation = useNavigation<AuthNavigatorRoutesProps>()

  function handleBackToLogin() {
    navigation.navigate('SignIn')
  }
  return (
    <ScrollView 
      contentContainerStyle={{ flexGrow: 1 }}
      showsVerticalScrollIndicator={false}
    >
      <VStack flex={1} px={10}>
        <Image
          source={BGImg}
          defaultSource={BGImg}
          alt="People cycling on stationary bikes"
          resizeMode="contain"
          position="absolute"
        />
        <Center mt={24} mb={"16"}>
          <LogoSvg />
          <Text color="gray.100" fontSize="sm">
            Mind and Body Workout
          </Text>
        </Center>

        <Center flex={1} justifyContent="flex-start">
          <Heading color="gray.100" fontSize="xl" mb={6} fontFamily="heading">
            Create your Account
          </Heading>
          <Controller
            control={control}
            name='name'
            render={({ field: { onChange, value } }) => (
              <Input
                placeholder="Name"
                onChangeText={onChange}
                value={value}
                errorMessage={errors.name?.message}
              />
            )}
          />
          <Controller
            control={control}
            name='email'
            render={({ field: { onChange, value } }) => (
              <Input
                placeholder="E-mail"
                keyboardType="email-address"
                autoCapitalize="none"
                onChangeText={onChange}
                value={value}
                errorMessage={errors.email?.message}
              />
            )}
          />
          <Controller
            control={control}
            name='password'
            render={({ field: { onChange, value } }) => (
              <Input
                placeholder="Password"
                secureTextEntry
                onChangeText={onChange}
                value={value}
                errorMessage={errors.password?.message}
              />
            )}
          />
          <Controller
            control={control}
            name='confirm_password'
            render={({ field: { onChange, value } }) => (
              <Input
                placeholder="Confirm Password"
                secureTextEntry
                onChangeText={onChange}
                value={value}
                errorMessage={errors.confirm_password?.message}
                onSubmitEditing={handleSubmit(onSubmit)}
              />
            )}
          />
          <Button
            title="Create & Access"
            onPress={handleSubmit(onSubmit)}
            isLoading={isLoading}
          />
        </Center>
        <Button
          my={"16"}
          title="Back to Login"
          variant="outline"
          onPress={handleBackToLogin}
        />
      </VStack>
    </ScrollView>
  )
}