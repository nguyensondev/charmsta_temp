import { NewProduct } from "@models/backend/request/Product"
import { PaginationDTO } from "@models/backend/response/Pagination"
import { ProductDTO, ProductPaginationDTO } from "@models/backend/response/Product"
import apiConfig from "../axios/api-config"

const GET_PRODUCTS = "pop/product"
const UPDATE_PRODUCTS = "pop/product"

export const getProductsApi = (params: { search: string } & PaginationDTO) =>
  apiConfig<ProductPaginationDTO>(GET_PRODUCTS, "GET", null, {}, params)

export const updateProductApi = (data: ProductDTO) =>
  apiConfig<ProductDTO>(UPDATE_PRODUCTS + `/${data.id}`, "PUT", data)

export const createProductApi = (data: NewProduct) =>
  apiConfig<ProductDTO>(UPDATE_PRODUCTS, "POST", data)
