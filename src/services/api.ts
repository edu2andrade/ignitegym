import axios, { AxiosInstance } from 'axios'
import { AppError } from '@utils/AppError'
import { getAuthTokenStorage, saveAuthTokenStorage } from '@storage/storageAuthToken'

// Refresh token

type PromiseType = {
  resolve: (value?: unknown) => void
  reject: (reason?: unknown) => void
}
type ProccessQueueParams = {
  error: Error | null
  token: string | null
}
type RegisterInterceptorTokenManagerProps = {
  signOut: () => void
  refreshTokenUpdated: (newToken: string) => void
}
type APIInstanceProps = AxiosInstance & {
  registerInterceptTokenManager: ({}: RegisterInterceptorTokenManagerProps) => () => void
}

const api = axios.create({
  baseURL: 'http://192.168.1.17:3333'
}) as APIInstanceProps

// Refresh token manager = verify if token is valid or not
let isRefreshing = false
let failedQueue: Array<PromiseType> = []

const proccessQueue = ({error, token = null}: ProccessQueueParams): void => {
  failedQueue.forEach((request) => {
    if(error) {
      request.reject(error)
    } else {
      request.resolve(token)
    }
  })
  
  failedQueue = []
} 

api.registerInterceptTokenManager = ({ signOut, refreshTokenUpdated }) => {
  const InterceptTokenManager = api.interceptors.response.use(response => response, async requestError => {

    // Check if request is not authorized
    if (requestError?.response?.status === 401) {
      if (requestError.response.data?.message === 'token.expired' || requestError.response.data?.message === 'token.invalid') {
        const oldToken = await getAuthTokenStorage()

        if(!oldToken) {
          signOut()
          return Promise.reject(requestError)
        }

        const originalRequest = requestError.config

        if(isRefreshing) {
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject })
          })
          .then((token) => { 
            originalRequest.headers['Authorization'] = `Bearer ${token}`
            return axios(originalRequest)
          })
          .catch((error) => {
            throw error
          })
        }

        isRefreshing = true

        return new Promise( async (resolve, reject) => {
          try {
            const {data} = await api.post('/sessions/refresh-token', { token: oldToken })

            await saveAuthTokenStorage(data.token)

            api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`
            originalRequest.headers['Authorization'] = `Bearer ${data.token}`

            refreshTokenUpdated(data.token)

            proccessQueue({ error: null, token: data.token })

            resolve(originalRequest)

          } catch (error: any) {
            proccessQueue({ error, token: null })
            signOut()
            reject(error)
          } finally {
            isRefreshing = false
          }
        })
      }
      signOut()
    }

    if(requestError.response && requestError.response.data) {
      return Promise.reject(new AppError(requestError.response.data.message))
    } else {
      return Promise.reject(requestError)
    }
  })

  return () => {
    api.interceptors.response.eject(InterceptTokenManager)
  }
}



export { api }