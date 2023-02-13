import { NewDiscount } from "@models/backend/request/Discount"
import { DiscountDTO } from "@models/backend/response/Discount"
import api from "../axios/api-config"

const CREATE_DISCOUNT = "/pop/discount"
const GET_DISCOUNT_LIST = "/pop/discount"
const DELETE_DISCOUNT_LIST = "/pop/discount"
const EDIT_DISCOUNT_LIST = "/pop/discount"

export const createDiscountApi = (data: NewDiscount) =>
  api<DiscountDTO>(CREATE_DISCOUNT, "POST", data)

export const getDiscountsApi = () => api<DiscountDTO[]>(GET_DISCOUNT_LIST, "GET")
export const deleteDiscountsApi = (id: number) =>
  api<DiscountDTO[]>(DELETE_DISCOUNT_LIST + `/${id}`, "DELETE")
export const editDiscountApi = (id: number, data: Omit<DiscountDTO, "id">) =>
  api<DiscountDTO>(EDIT_DISCOUNT_LIST + `/${id}`, "PUT", data)
