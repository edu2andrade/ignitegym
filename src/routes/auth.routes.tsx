import { createNativeStackNavigator, NativeStackNavigationProp } from '@react-navigation/native-stack'

import { SignIn } from '@screens/SignIn'
import { Register } from '@screens/Register'

type AuthRoutes = {
  SignIn: undefined
  Register: undefined
}

export type AuthNavigatorRoutesProps = NativeStackNavigationProp<AuthRoutes>
const { Navigator, Screen } = createNativeStackNavigator<AuthRoutes>();

export function AuthRoutes() {
  return (
    <Navigator screenOptions={{ headerShown: false }}>
      <Screen
        name='SignIn'
        component={SignIn}
      />
      <Screen
        name='Register'
        component={Register}
      />
    </Navigator>
  )
}