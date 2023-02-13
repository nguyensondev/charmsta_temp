import { UpdateUser } from "@models/backend/request/User"
import { User } from "@models/mobx/user/user"
import api from "../axios/api-config"

const USER_PROFILE = "/users/me"
const UPDATE_USER_PROFILE = "/users/me"
const DELETE_USER_PROFILE = "/users/"

export const getUserProfileApi = () => api<User>(USER_PROFILE, "GET")
export const updateUserProfileApi = (data: UpdateUser) =>
  api<User>(UPDATE_USER_PROFILE, "PUT", data)
export const deleteUserProfileApi = (userId: number) =>
  api<User>(DELETE_USER_PROFILE + `/${userId}`, "DELETE")
