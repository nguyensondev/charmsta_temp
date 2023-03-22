import { Dispatch, SetStateAction, useEffect, useState } from "react"

import { translate } from "@i18n/translate"
import { Customer, ImportCustomer } from "@models/backend/request/Customer"
import { CustomerDTO } from "@models/backend/response/Customer"
import {
  createCustomerApi,
  getCustomersApi,
  importCustomersApi,
  updateCustomersApi
} from "@services/api/Customer"
import { AxiosResponse } from "axios"
import { isEmpty } from "lodash"
import { Alert } from "react-native"

interface Output {
  loading: boolean
  error: AxiosResponse
  createStatus: boolean
  updateStatus: boolean
  importStatus: boolean
  customers: Array<CustomerDTO>
  take: number
  getCustomers: (take: number, search?: string) => void
  setTake: Dispatch<SetStateAction<number>>
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
  const [take, setTake] = useState<number>(0)

  useEffect(() => {
    if (!isEmpty(error)) {
      Alert.alert("Error", translate("errors.unexpected"))
    }
  }, [error])

  const getCustomers = async (take: number, search = "") => {
    try {
      const { data } = await getCustomersApi(take, search)
      // if (skip > 0) {
      // setCustomers([...customers, ...data])
      // } else {
      setCustomers(data)
      // }
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
      setLoading(false)
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
    take,
    createStatus,
    updateStatus,
    importStatus,
    setTake,
    getCustomers,
    updateCustomer,
    createCustomer,
    importCustomers,
  }
}
