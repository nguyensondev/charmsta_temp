import { UpdateUser } from "@models/backend/request/User"
import { useStores } from "@models/index"
import { User } from "@models/mobx/user/user"
import { deleteUserProfileApi, getUserProfileApi, updateUserProfileApi } from "@services/api/User"
import { AxiosResponse } from "axios"
import { useState } from "react"

interface Output {
  userProfile: User
  updateSuccess: boolean
  deleteSuccess: boolean
  getUserProfile: () => void
  updateUserProfile: (data: UpdateUser) => void
  deleteUserProfile: (id: number) => void
  loading: boolean
  error: AxiosResponse
}

export const useUser = (): Output => {
  const [loading, setLoading] = useState<boolean>(false)
  const [updateSuccess, setUpdateSuccess] = useState(false)
  const [deleteSuccess, setDeleteSuccess] = useState(false)
  const [userProfile, setUserProfile] = useState<User>()
  const [error, setError] = useState<AxiosResponse>()
  const {
    userStore: { saveUser, eraseUser },
    authStore: { resetAuth },
  } = useStores()

  const getUserProfile = async () => {
    try {
      setLoading(true)
      const response = await getUserProfileApi()
      if (response?.data) {
        const { data } = response
        saveUser(data)
        setUserProfile(data)
      }
    } catch (err) {
      setError(err)
    } finally {
      setLoading(false)
    }
  }

  const updateUserProfile = async (data: UpdateUser) => {
    try {
      setLoading(true)
      const response = await updateUserProfileApi(data)
      if (response?.data) {
        saveUser(response.data)
        setUpdateSuccess(true)
      }
    } catch (err) {
      setError(err)
    } finally {
      setLoading(false)
    }
  }

  const deleteUserProfile = async (id: number) => {
    try {
      setLoading(true)
      const response = await deleteUserProfileApi(id)
      if (response?.data) {
        setDeleteSuccess(true)
        eraseUser()
        resetAuth()
      }
    } catch (err) {
      setError(err)
    } finally {
      setLoading(false)
    }
  }

  return {
    userProfile,
    updateSuccess,
    deleteSuccess,
    getUserProfile,
    updateUserProfile,
    deleteUserProfile,
    error,
    loading,
  }
}
