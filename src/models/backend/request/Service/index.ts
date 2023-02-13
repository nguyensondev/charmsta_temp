import { ServiceInCategoryDTO } from "@models/backend/response/Service"
import { StaffDTO } from "@models/backend/response/Staff"
import { TaxDTO } from "@models/backend/response/Tax"

export interface NewService {
  name: string | ""
  cost: number | 0
  price: number | 0
  stocks: number | 0
  description?: string
  photo?: string
  thumb?: string
  color?: string
  orderBy?: number
  serviceDuration?: number
  SKU?: string
  storeId?: number
  suppilerId?: number
  categoryId?: number
  staffs?: StaffDTO[]
  tax?: TaxDTO
}

export interface ListSearch {
  search: string | ""
}

export interface NewCategory {
  name: string | ""
  orderBy?: number
}

export interface CategorySearch {
  search: string | ""
}

export interface EditCategory {
  id: number
  name: string | ""
  orderBy?: number
}

export interface ListServiceInCategory {
  id: number
}

export interface EditListServiceInCategory {
  categories: Array<ServiceInCategoryDTO>
}
