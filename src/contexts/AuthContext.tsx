import { createContext, ReactNode, useEffect, useState } from "react";
import { getUserStorage, saveUserStorage } from '@storage/storageUser'

import { api } from "@services/api";
import { UserDTO } from "@dtos/userDTO";

export type AuthContextDataProps = {
  user: UserDTO
  signIn: (email: string, password: string) => Promise<void>
}
interface AuthContextProviderProps {
  children: ReactNode;
}

export const AuthContext = createContext<AuthContextDataProps>({} as AuthContextDataProps)

export function AuthContextProvider({ children }: AuthContextProviderProps) {
  const [user, setUser] = useState<UserDTO>({} as UserDTO)

  async function signIn(email: string, password: string) {
    try {
      const { data } = await api.post('/sessions', { email, password })
      if (data.user) {
        setUser(data.user)
        saveUserStorage(data.user)
      }
    } catch (error) {
      throw error
    }
  }

  async function loadUserData() {
    const loggedUser = await getUserStorage()
    if (loggedUser) {
      setUser(loggedUser)
    }
  }

  useEffect(() => {
    loadUserData()
  }, [])

  return (
    <AuthContext.Provider value={{ user, signIn }}>
      {children}
    </AuthContext.Provider>
  )
}