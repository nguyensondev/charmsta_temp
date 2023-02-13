import { INewTax } from "@models/backend/request/Tax"
import { TaxDTO } from "@models/backend/response/Tax"
import { createTaxApi, deleteTaxApi, getTaxListApi, updateTaxApi } from "@services/api/Tax"
import { AxiosResponse } from "axios"
import { useState } from "react"

interface Output {
  loading: boolean
  error: AxiosResponse
  createTax: (data: INewTax) => void
  updateTax: (data: INewTax) => void
  deleteTax: (id: number) => void
  newTax: TaxDTO
  taxList: TaxDTO[]
  getTaxList: () => void
  isDeleted: boolean
}

export const useTax = (): Output => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<AxiosResponse>()
  const [newTax, setNewTax] = useState<TaxDTO>()
  const [taxList, setTaxList] = useState<TaxDTO[]>([])
  const [isDeleted, setIsDeleted] = useState<boolean>(false)

  const getTaxList = async () => {
    try {
      setLoading(true)
      const response = await getTaxListApi()
      if (response?.data) {
        setTaxList(response?.data)
      }
    } catch (err) {
      setError(err)
    } finally {
      setLoading(false)
    }
  }

  const createTax = async (data: INewTax) => {
    try {
      setLoading(true)
      const response = await createTaxApi(data)
      if (response?.data) {
        setNewTax(response?.data)
      }
    } catch (err) {
      setError(err)
    } finally {
      setLoading(false)
    }
  }

  const updateTax = async (data: INewTax) => {
    try {
      setLoading(true)
      const response = await updateTaxApi(data)
      if (response?.data) {
        setNewTax(response?.data)
      }
    } catch (err) {
      setError(err)
    } finally {
      setLoading(false)
    }
  }

  const deleteTax = async (id: number) => {
    try {
      setLoading(true)
      const response = await deleteTaxApi(id)
      if (response?.data) {
        setIsDeleted(true)
      }
    } catch (err) {
      setError(err)
    } finally {
      setLoading(false)
    }
  }

  return { loading, error, createTax, newTax, taxList, getTaxList, updateTax, deleteTax, isDeleted }
}
