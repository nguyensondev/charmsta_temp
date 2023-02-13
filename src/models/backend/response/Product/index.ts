import { PaginationDTO } from "../Pagination"
import { TaxDTO } from "../Tax"

export interface ProductPaginationDTO extends PaginationDTO {
  content: ProductDTO[]
}
export interface ProductDTO {
  id: number
  name: string
  cost: number
  price: number
  stocks: number
  description: string
  photo: string
  thumb: string
  color: string
  orderBy: number
  isActive: boolean
  isPrivate: boolean
  isService: boolean
  serviceDuration: number
  SKU: string
  storeId: number
  suppilerId: number
  categoryId: number
  quantity: number
  tax?: TaxDTO
}

export interface ProductOption {
  id: number
  name: string
  price: number
  orderBy: number
}
