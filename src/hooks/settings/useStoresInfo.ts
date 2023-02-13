import { CreateStore, UpdateStore } from "@models/backend/request/Store"
import { StoreByIdDTO, StoreDTO } from "@models/backend/response/Store"
import { useStores } from "@models/index"
import { createStoreApi, getStoreByIdApi, getStoresApi, updateStoreApi } from "@services/api/Store"
import { consoleLog } from "@utils/debug"
import { useState } from "react"

type Output = {
  // list store
  loadingStores: boolean
  stores: StoreDTO[]
  errStores: Error
  errUpdateStore: Error
  updating: boolean
  updateSuccess: boolean
  getStores: () => void
  updateStore: (id: number, data: UpdateStore) => void
  // update company hour
  loadingCompanyHour: boolean
  companyHour: { affected: number }
  errCompanyHour: Error
  updateCompanyHour: (id: number, data: UpdateStore) => void
  // get stire by id
  gettingStoreData: boolean
  storeData: StoreByIdDTO
  getStoreById: (id: number) => void
  createStore: (data: CreateStore) => void
}

export const useStoresInfo = (): Output => {
  const { currentStoreStore } = useStores()
  const { saveCurrentStore, CurrentStore } = currentStoreStore
  // list store
  const [loadingStores, setLoadingStores] = useState<boolean>(false)
  const [stores, setStores] = useState<StoreDTO[]>([])
  const [errStores, setErrStores] = useState<Error>(null)
  // update company hour
  const [loadingCompanyHour, setLoadingCompanyHour] = useState<boolean>(false)
  const [companyHour, setCompanyHour] = useState<any>()
  const [errCompanyHour, setErrCompanyHour] = useState<Error>(null)

  const updateCompanyHour = async (id: number, data: UpdateStore) => {
    try {
      setLoadingCompanyHour(true)
      const result = await updateStoreApi(id, data)
      if (result?.data) {
        saveCurrentStore(result?.data)
        setLoadingCompanyHour(false)
        setCompanyHour(result?.data)
        setErrCompanyHour(null)
      } else {
        const newErr = new Error("Data is empty!")
        setLoadingCompanyHour(false)
        setCompanyHour(null)
        setErrCompanyHour(newErr)
      }
    } catch (err) {
      setLoadingCompanyHour(false)
      setErrCompanyHour(err)
    }
  }

  const getStores = async () => {
    try {
      setLoadingStores(true)
      const result = await getStoresApi()

      if (result && result.data && result.data.length > 0) {
        setLoadingStores(false)
        setStores(result.data)
        setErrStores(null)
      } else {
        const newErr = new Error("Data is empty!")
        setLoadingStores(false)
        setStores([])
        setErrStores(newErr)
      }
    } catch (err) {
      setErrStores(err)
      setLoadingStores(false)
    }
  }

  // update store
  const [updating, setUpdating] = useState(false)
  const [updateSuccess, setUpdateSuccess] = useState(false)
  const [errUpdateStore, setErrUpdateStore] = useState<Error>(null)

  const updateStore = async (id: number, data: UpdateStore) => {
    try {
      setUpdating(true)
      const result = await updateStoreApi(id, data)

      if (result?.data && result.data?.id) {
        saveCurrentStore(result.data)
        setUpdateSuccess(true)
        setErrUpdateStore(null)
        setUpdating(false)
      } else {
        const newErr = new Error("Store data upadte not successful")
        setErrUpdateStore(newErr)
        setUpdating(false)
      }
    } catch (err) {
      setErrUpdateStore(err)
      setUpdating(false)
    }
    setUpdateSuccess(false)
  }

  // get store by id
  const [storeData, setStoreData] = useState<StoreByIdDTO>()
  const [gettingStoreData, setGettingStoreData] = useState<boolean>()

  const getStoreById = async (id: number) => {
    try {
      setGettingStoreData(true)
      const response = await getStoreByIdApi(id)
      if (response.data && response.data.id) {
        setStoreData(response.data)
      }
      setGettingStoreData(false)
    } catch (err) {
      setGettingStoreData(false)
    }
  }

  const createStore = async (data: CreateStore) => {
    try {
      const response = await createStoreApi(data)
      if (response.data && response.data.id) {
        setStoreData(response.data)
      }
    } catch (err) {
      consoleLog("createStore err: ", err)
    }
  }

  return {
    gettingStoreData,
    loadingStores,
    stores,
    errStores,
    updating,
    updateSuccess,
    errUpdateStore,
    getStores,
    updateStore,
    loadingCompanyHour,
    companyHour,
    errCompanyHour,
    storeData,
    updateCompanyHour,
    getStoreById,
    createStore,
  }
}
