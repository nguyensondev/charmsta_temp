import { INewTax } from "@models/backend/request/Tax"
import { TaxDTO } from "@models/backend/response/Tax"
import api from "../axios/api-config"

const CREATE_TAX = "/pop/tax"
const GET_TAX_LIST = "/pop/tax"
const UPDATE_TAX = "/pop/tax"
const DELETE_TAX = "/pop/tax"

export const getTaxListApi = () => api<TaxDTO[]>(GET_TAX_LIST, "GET")
export const createTaxApi = (data: INewTax) => api<TaxDTO>(CREATE_TAX, "POST", data)
export const updateTaxApi = (data: INewTax) => api<TaxDTO>(UPDATE_TAX, "PUT", data)
export const deleteTaxApi = (id: number) => api<TaxDTO>(DELETE_TAX + `/${id}`, "DELETE")
