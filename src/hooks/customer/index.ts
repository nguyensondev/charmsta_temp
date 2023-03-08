import { Dispatch, SetStateAction, useState } from "react"

import { Customer, ImportCustomer } from "@models/backend/request/Customer"
import { CustomerDTO } from "@models/backend/response/Customer"
import {
  createCustomerApi,
  getCustomersApi,
  importCustomersApi,
  updateCustomersApi
} from "@services/api/Customer"
import { AxiosResponse } from "axios"

interface Output {
  loading: boolean
  error: AxiosResponse
  createStatus: boolean
  updateStatus: boolean
  importStatus: boolean
  customers: Array<CustomerDTO>
  skip: number
  getCustomers: (skip: number, search?: string) => void
  setSkip: Dispatch<SetStateAction<number>>
  updateCustomer: (data: Customer) => void
  createCustomer: (data: Customer) => void
  importCustomers: (data: ImportCustomer[]) => void
}

export const useCustomer = (): Output => {
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<AxiosResponse>()
  const [customers, setCustomers] = useState<Array<CustomerDTO>>([])
  const [createStatus, setCreateStatus] = useState(false)
  const [updateStatus, setUpdateStatus] = useState(false)
  const [importStatus, setImportStatus] = useState(false)
  const [skip, setSkip] = useState<number>(0)

  const getCustomers = async (skip: number, search?: string) => {
    try {
      const { data } = await getCustomersApi(skip, search)
      if (skip > 0) {
        setCustomers([...customers, ...data])
      } else {
        setCustomers(data)
      }
    } catch (err) {
      setError(err)
    }
  }

  const updateCustomer = async (profile: Customer) => {
    try {
      setLoading(true)
      await updateCustomersApi(profile)
      setUpdateStatus(true)
      setLoading(false)
    } catch (err) {
      setError(err)
    }
  }

  const createCustomer = async (profile: Customer) => {
    try {
      setLoading(true)
      await createCustomerApi({ customer: profile })
      setCreateStatus(true)
    } catch (err) {
      setLoading(false)
      setError(err)
    }
  }

  const importCustomers = async (data: ImportCustomer[]) => {
    try {
      setLoading(true)
      const res = await importCustomersApi(data)
      if (res.data.status === "ok") {
        setImportStatus(true)
      }
      setLoading(false)
    } catch (err) {
      setLoading(false)
      setError(err)
    }
  }

  return {
    error,
    loading,
    customers,
    skip,
    createStatus,
    updateStatus,
    importStatus,
    setSkip,
    getCustomers,
    updateCustomer,
    createCustomer,
    importCustomers,
  }
}
