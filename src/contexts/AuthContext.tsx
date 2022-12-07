import { createContext, ReactNode, useEffect, useState } from "react";
import {
  saveAuthTokenStorage,
  getAuthTokenStorage,
  removeAuthTokenStorage
} from '@storage/storageAuthToken'
import {
  getUserStorage,
  saveUserStorage,
  removeUserStorage
} from '@storage/storageUser'

import { api } from "@services/api";
import { UserDTO } from "@dtos/userDTO";

export type AuthContextDataProps = {
  user: UserDTO
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
  updateUserProfile: (userUpdated: UserDTO) => Promise<void>
  isLoadingUserStorageData: boolean
}
interface AuthContextProviderProps {
  children: ReactNode;
}
export const AuthContext = createContext<AuthContextDataProps>({} as AuthContextDataProps)

export function AuthContextProvider({ children }: AuthContextProviderProps) {
  const [user, setUser] = useState<UserDTO>({} as UserDTO)
  const [isLoadingUserStorageData, setIsLoadingUserStorageData] = useState(true)

  function userAndTokenUpdate(userData: UserDTO, token: string){
      // Send token info into headers and update user
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`
      setUser(userData)
  }

  async function storageSaveUserAndToken(userData: UserDTO, token: string) {
    try {
      setIsLoadingUserStorageData(true)

      await saveUserStorage(userData)
      await saveAuthTokenStorage(token)

    } catch (error) {
      throw error
    } finally {
      setIsLoadingUserStorageData(false)
    }
  }

  async function signIn(email: string, password: string) {
    try {
      const { data } = await api.post('/sessions', { email, password })
      if (data.user && data.token) {
        userAndTokenUpdate(data.user, data.token)
        await storageSaveUserAndToken(data.user, data.token)
      }
    } catch (error) {
      throw error
    }
  }

  async function signOut() {
    try {
      setIsLoadingUserStorageData(true)
      // clean state and remove user from storage persist
      setUser({} as UserDTO)
      await removeUserStorage()
      await removeAuthTokenStorage()

    } catch (error) {
      throw error
    } finally {
      setIsLoadingUserStorageData(false)
    }
  }

  async function updateUserProfile(userUpdated: UserDTO) {
    try {
      setUser(userUpdated)
      await saveUserStorage(userUpdated)
      
    } catch (error) {
      throw error
    }
  }

  async function loadUserData() {
    try {
      setIsLoadingUserStorageData(true)

      const loggedUser = await getUserStorage()
      const token = await getAuthTokenStorage()

      if (token && loggedUser) {
        userAndTokenUpdate(loggedUser, token)
      }
    } catch (error) {
      throw error
    } finally {
      setIsLoadingUserStorageData(false)
    }
  }

  useEffect(() => {
    loadUserData()
  }, [])

  return (
    <AuthContext.Provider value={{
      user,
      signIn,
      signOut,
      updateUserProfile,
      isLoadingUserStorageData
    }}>
      {children}
    </AuthContext.Provider>
  )
}