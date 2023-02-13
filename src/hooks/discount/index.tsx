import { NewDiscount } from "@models/backend/request/Discount"
import { DiscountDTO } from "@models/backend/response/Discount"
import {
  createDiscountApi,
  deleteDiscountsApi,
  editDiscountApi,
  getDiscountsApi,
} from "@services/api/Discount"
import { AxiosResponse } from "axios"
import { isEmpty, omit } from "lodash"
import { useState } from "react"

interface Output {
  loading: boolean
  error: AxiosResponse
  createDiscount: (data: NewDiscount) => void
  newDiscount: DiscountDTO
  getDiscounts: () => void
  discounts: DiscountDTO[]
  deleteDiscount: (id: number) => void
  isDeleted: boolean
  editDiscount: (data: DiscountDTO) => void
}
export const useDiscount = (): Output => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<AxiosResponse>()
  const [discounts, setDiscounts] = useState<DiscountDTO[]>([])
  const [newDiscount, setNewDiscount] = useState<DiscountDTO>()
  const [isDeleted, setDeleted] = useState(false)

  const createDiscount = async (data: NewDiscount) => {
    try {
      setLoading(true)
      const response = await createDiscountApi(data)
      if (response?.data && response?.data.id) {
        setNewDiscount(response.data)
      }
    } catch (err) {
      setError(err)
    } finally {
      setLoading(false)
    }
  }

  const getDiscounts = async () => {
    try {
      setLoading(true)
      const response = await getDiscountsApi()
      if (response?.data && !isEmpty(response?.data)) {
        setDiscounts(response.data)
      }
    } catch (err) {
      setError(err)
    } finally {
      setLoading(false)
    }
  }

  const deleteDiscount = async (id: number) => {
    try {
      setLoading(true)
      const response = await deleteDiscountsApi(id)
      if (response?.data) {
        setDeleted(true)
      }
    } catch (err) {
      setError(err)
    } finally {
      setLoading(false)
    }
  }

  const editDiscount = async (data: DiscountDTO) => {
    try {
      setLoading(true)
      const response = await editDiscountApi(data.id, omit(data, "id"))
      if (response?.data) {
        setNewDiscount(response.data)
      }
    } catch (err) {
      setError(err)
    } finally {
      setLoading(false)
    }
  }

  return {
    isDeleted,
    loading,
    error,
    createDiscount,
    newDiscount,
    getDiscounts,
    discounts,
    deleteDiscount,
    editDiscount,
  }
}
