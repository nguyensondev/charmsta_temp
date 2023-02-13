import { LoginEmail, SignUpEmail, UpdateCompany } from "@models/backend/request/Auth"
import { RegisterDTO, SignUpEmailDTO } from "@models/backend/response/Auth"
import { FirebaseCode } from "@models/enum/firebase"
import { useStores } from "@models/root-store"
import auth, { FirebaseAuthTypes } from "@react-native-firebase/auth"
import {
  continueWithAppleApi,
  continueWithFacebookApi,
  continueWithGoogleApi,
  forgotPasswordApi,
  loginApi,
  registerApi,
  signUpEmailApi,
  updateCompanyApi,
} from "@services/api/Auth"
import { getDeviceInfo } from "@utils/deviceInfo"
import { AxiosResponse } from "axios"
import { useState } from "react"

interface IErrors {
  signInErr: Partial<AxiosResponse>
}

type Output = {
  loading: boolean
  userProfile: SignUpEmailDTO
  registerErrorCode: null | number
  forgotPasswordStatus: null | boolean
  registerStatus: boolean
  socialContinueStatusCode: null | number
  registerData: Partial<Omit<RegisterDTO, "accessToken">>
  signUpEmailInvoke: (params: SignUpEmail) => void
  register: (params: SignUpEmail) => void
  login: (params: Omit<LoginEmail, "deviceToken">) => void
  forgotPassword: (params: string) => void
  continueWithSocial: (
    name: "google" | "apple" | "facebook",
    user: FirebaseAuthTypes.User,
    token: string,
  ) => void
  // continueWithGoogle: (data: FirebaseAuthTypes.User, token: string) => void
  // continueWithFacebook: (data: FirebaseAuthTypes.User, token: string) => void
  // continueWithApple: (data: FirebaseAuthTypes.User, token: string) => void
  updateCompany: (data: UpdateCompany, id: number, token: string) => void
  logout: () => void
  setLoading: (status: boolean) => void
  errors: IErrors
}

export const useAuth = (): Output => {
  const [loading, setLoading] = useState<boolean>(false)
  const [userProfile, setUserProfile] = useState<SignUpEmailDTO>(null)
  const [registerStatus, setRegisterStatus] = useState<boolean>(false)
  const [registerData, setRegisterData] = useState<Partial<Omit<RegisterDTO, "accessToken">>>({})
  const [registerErrorCode, setRegisterErrorCode] = useState<null | number>(null)
  const [socialContinueStatusCode, setSocialContinueStatusCode] = useState<null | number>(null)
  const [forgotPasswordStatus, setForgotPasswordStatus] = useState<null | boolean>(null)
  const [errors, setErrors] = useState<IErrors>({ signInErr: {} })
  const { userStore, authStore, currentStoreStore } = useStores()
  const { saveUser, saveUserId } = userStore
  const { saveCurrentStore } = currentStoreStore
  const { saveAuth } = authStore

  const signUpEmailInvoke = async (params: SignUpEmail) => {
    try {
      setLoading(true)
      const response = await signUpEmailApi(params)
      setUserProfile(response.data)
    } catch (err) {
      setLoading(false)
    } finally {
      setLoading(false)
    }
  }

  const register = async (params: SignUpEmail) => {
    try {
      setLoading(true)
      const { data } = await registerApi(params)
      const { accessToken, userInfo } = data
      setRegisterStatus(true)
      setLoading(false)
      // setTimeout(() => {
      saveAuth(accessToken.token, accessToken.refreshToken)
      setRegisterData({ userInfo })
      // }, 200)
    } catch (err) {
      setRegisterErrorCode(err.statusCode)
    }
  }

  const login = async (params: LoginEmail) => {
    let loginStt = false
    try {
      setErrors({ ...errors, signInErr: {} })
      setLoading(true)
      const { deviceToken } = await getDeviceInfo()
      const response = await loginApi({ ...params, deviceToken })
      const { accessToken, id } = response.data
      saveUserId(id)
      saveAuth(accessToken.token, accessToken.refreshToken)
      loginStt = true
    } catch (err) {
      setErrors({ ...errors, signInErr: err })
    } finally {
      if (loginStt) {
        auth()
          .createUserWithEmailAndPassword(params.email, params.password)
          .catch((err) => {
            switch (err.code as FirebaseCode) {
              case FirebaseCode["auth/email-already-in-use"]:
                auth().signInWithEmailAndPassword(params.email, params.password)
                break
            }
          })
      }
      setLoading(false)
    }
  }

  const forgotPassword = async (email: string) => {
    try {
      setLoading(true)
      const response = await forgotPasswordApi(email)
      setForgotPasswordStatus(response.data.status)
      setLoading(false)
    } catch (err) {
      console.log("error", err)
    }
  }

  const continueWithSocial = async (
    name: "google" | "apple" | "facebook",
    user: FirebaseAuthTypes.User, // { displayname: " abc"}
    token: string,
  ) => {
    try {
      setLoading(true)
      const { deviceToken } = await getDeviceInfo()

      const userData = { ...user, deviceToken }

      let response: { data: RegisterDTO; code?: number }
      switch (name) {
        case "apple":
          response = await continueWithAppleApi(userData, token)
          break
        case "facebook":
          response = await continueWithFacebookApi(userData, token)
          break
        case "google":
          response = await continueWithGoogleApi(userData, token)
          break
      }
      const { data, code } = response
      const { userInfo, accessToken } = data
      // saveUser(userInfo)
      setRegisterData({ userInfo })
      saveAuth(accessToken.token, accessToken.refreshToken)
      setSocialContinueStatusCode(code)
      setLoading(false)
    } catch (err) {
      setSocialContinueStatusCode(err.statusCode)
      setLoading(false)
    }
  }

  const updateCompany = async (data: UpdateCompany, id: number, token: string) => {
    try {
      setLoading(true)
      await updateCompanyApi(data, id, token)
      setRegisterStatus(true)
      setLoading(false)
    } catch (err) {
      setRegisterErrorCode(err.statusCode)
    }
  }

  const logout = () => {
    authStore.resetAuth()
    currentStoreStore.clearCurrentStore()
    userStore.eraseUser()
    auth().signOut()
  }

  return {
    errors,
    registerData,
    loading,
    userProfile,
    registerErrorCode,
    forgotPasswordStatus,
    registerStatus,
    socialContinueStatusCode,
    logout,
    signUpEmailInvoke,
    register,
    login,
    forgotPassword,
    continueWithSocial,
    updateCompany,
    setLoading,
  }
}
