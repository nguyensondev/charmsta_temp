import { CreateStore } from "@models/backend/request/Store"
import { StoreByIdDTO, StoreDTO } from "@models/backend/response/Store"
import api from "../axios/api-config"

const GET_STORES = "/stores"
const UPDATE_STORE = "/stores"
const GET_STORE_BY_ID = "/stores"
const CREATE_STORE = "/stores"

export const getStoresApi = () => api<StoreDTO[]>(GET_STORES, "GET")
export const updateStoreApi = (id: number, payload: StoreDTO) =>
  api<any>(`${UPDATE_STORE}/${id}`, "PUT", payload)
export const getStoreByIdApi = (id: number) => api<StoreByIdDTO>(`${GET_STORE_BY_ID}/${id}`, "GET")

export function createStoreApi(data: CreateStore) {
  return api<any>(`${CREATE_STORE}`, "POST", data)
}
