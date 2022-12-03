import { VStack, Image, Text, Center, Heading, ScrollView, useToast } from "native-base";

import LogoSvg from '@assets/logo.svg';
import BGImg from '@assets/background.png';

import { useNavigation } from "@react-navigation/native";
import { AuthNavigatorRoutesProps } from '@routes/auth.routes'

import { useAuth } from "@hooks/useAuth";

import { useForm, Controller } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'

import { Input } from '@components/Input'
import { Button } from "@components/Button";
import { AppError } from "@utils/AppError";

type FormDataProps = {
  email: string
  password: string
}

const signinSchema = yup.object({
  email: yup.string().required('E-mail is required').email('Invalid email'),
  password: yup.string().required('Password is required').min(6, 'Password must be at least 6 characters'),
})

export function SignIn() {
  const { control, handleSubmit, formState: { errors } } = useForm<FormDataProps>({
    resolver: yupResolver(signinSchema),
  })
  const navigation = useNavigation<AuthNavigatorRoutesProps>()
  const { signIn } = useAuth()
  const toast = useToast()

  function handleNewAccount() {
    navigation.navigate('Register')
  }

  async function onSubmit({ email, password }: FormDataProps) {
    try {
      await signIn(email, password)
    } catch (error) {
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
            Login into your Account
          </Heading>

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
                onSubmitEditing={handleSubmit(onSubmit)}
              />
            )}
          />

          <Button
            title="Access"
            onPress={handleSubmit(onSubmit)}
          />
        
        </Center>

        <Center my={"16"}>
          <Text
            mb={3}
            color="gray.100"
            fontFamily="body"
            fontSize="sm"
          >
            Not registered?
          </Text>

          <Button
            title="Create an account"
            variant="outline"
            onPress={handleNewAccount}
            />
        </Center>
        
      </VStack>
    </ScrollView>
  )
}