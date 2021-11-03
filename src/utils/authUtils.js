import { GENERAL_ROUTES } from 'routes'
import { LOCAL_STORAGE } from './commonUtils'

export const login = ({ access_token, refresh_token }) => {
  window.localStorage.setItem(LOCAL_STORAGE.ACCESS_TOKEN, access_token)
  window.localStorage.setItem(LOCAL_STORAGE.REFRESH_TOKEN, refresh_token)
}

export const logout = () => {
  window.localStorage.removeItem(LOCAL_STORAGE.ACCESS_TOKEN)
  window.localStorage.removeItem(LOCAL_STORAGE.REFRESH_TOKEN)
  window.localStorage.removeItem(LOCAL_STORAGE.ME)
  // redirect to home page
  window.location = GENERAL_ROUTES.HOME
}

export const getAccessToken = () => {
  return window.localStorage.getItem(LOCAL_STORAGE.ACCESS_TOKEN)
}

export const getRefreshToken = () => {
  return window.localStorage.getItem(LOCAL_STORAGE.REFRESH_TOKEN)
}

export const getMe = () => {
  const me = JSON.parse(window.localStorage.getItem(LOCAL_STORAGE.ME))
  return me
}

export const setMe = (me) => {
  const meInJSON = JSON.stringify(me)
  return window.localStorage.setItem(LOCAL_STORAGE.ME, meInJSON)
}

export const replaceAccountInfoIncorrect = (error) => {
  if (error.code === 401 && error.errors.detail === 'No active account found with the given credentials') {
    return 'Username or password is incorrect.'
  }

  return error.errors.detail
}
