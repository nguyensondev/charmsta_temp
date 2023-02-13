import { PackageDTO } from "../Package"
import { PaginationDTO } from "../Pagination"
import { StaffDTO } from "../Staff"
import { TaxDTO } from "../Tax"

export interface ServicePaginationDTO extends PaginationDTO {
  content: ServiceDTO[]
}
export interface ServiceDTO {
  id: number
  name: string
  cost: number
  price: number
  stocks: number
  description?: string
  photo?: string
  thumb?: string
  color?: string
  orderBy: number
  serviceDuration: number
  SKU?: string
  storeId: number
  suppilerId?: number
  categoryId?: number
  staffId: number
  staffs: StaffDTO[]
  staff: StaffDTO
  isActive: boolean
  tax?: TaxDTO
}

export interface CategoryPaginationDTO extends PaginationDTO {
  content: CategoryDTO[]
}

export interface CategoryDTO {
  id: number
  name: string
  orderBy: number
  storeId: number
  isActive: boolean
  products?: Array<any>
  packages: Omit<PackageDTO, "services">[]
  services: ServiceDTO[]
}

export interface ServiceInCategoryDTO {
  service_id: number
  category_id: number
  name: string
  selected: boolean
  addNew: boolean
}

export interface CategoryByIdDTO extends ServiceInCategoryDTO {
  products: {
    id: number
    name: string
    cost: string
    price: string
    stocks: number
    description?: string
    photo?: string
    thumb?: string
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
  }[]
}

export interface UpdateServiceInCategoryDTO {
  generatedMaps: Array<any>
  raw: Array<any>
  affected: number
}
