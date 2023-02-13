import { LoginEmail, SignUpEmail, UpdateCompany } from "@models/backend/request/Auth"
import { LoginDTO, RegisterDTO, SignUpEmailDTO } from "@models/backend/response/Auth"
import { FirebaseAuthTypes } from "@react-native-firebase/auth/lib"
import api from "../axios/api-config"

const SIGN_UP = "/users/signup"
const REGISTER = "/users/register"
const LOGIN = "/users/login"
const FORGOT = "/users/forgot"
const CONTINUE_WITH_GOOGLE = "/users/gglogin"
const CONTINUE_WITH_FACEBOOK = "/users/fblogin"
const CONTINUE_WITH_APPLE = "/users/applelogin"
const UPDATE_COMPANY = "/users/update-company"

export function signUpEmailApi(data: SignUpEmail) {
  return api<SignUpEmailDTO>(SIGN_UP, "POST", data)
}

export function registerApi(data: SignUpEmail) {
  return api<RegisterDTO>(REGISTER, "POST", data)
}

export function loginApi(auth: LoginEmail) {
  return api<LoginDTO>(LOGIN, "POST", auth)
}

export function forgotPasswordApi(email: string) {
  return api<any>(FORGOT + `?email=${email}`, "GET")
}

export function continueWithGoogleApi(data: FirebaseAuthTypes.User, token: string) {
  return api<RegisterDTO>(CONTINUE_WITH_GOOGLE, "POST", data, { Authorization: "Bearer " + token })
}

export function continueWithFacebookApi(data: FirebaseAuthTypes.User, token: string) {
  return api<RegisterDTO>(CONTINUE_WITH_FACEBOOK, "POST", data, {
    Authorization: "Bearer " + token,
  })
}

export function continueWithAppleApi(data: FirebaseAuthTypes.User, token: string) {
  return api<RegisterDTO>(CONTINUE_WITH_APPLE, "POST", data, { Authorization: "Bearer " + token })
}

export function updateCompanyApi(data: UpdateCompany, id: number, token: string) {
  return api<any>(`${UPDATE_COMPANY}/${id}`, "PUT", data, { Authorization: "Bearer " + token })
}
