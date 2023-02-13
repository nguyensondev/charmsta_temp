import { CategoryDTO, ServiceDTO } from "@models/backend/response/Service"
import { StaffDTO } from "../Staff"

export interface PackageDTO {
  id: number
  name: string
  categoryId: number
  services: ServiceDTO[]
  cost: number
  price: number
  duration?: number
  staffId: number
  staff: StaffDTO
}

export interface PackageWithCategoryDTO extends Omit<PackageDTO, "services"> {
  id: number
  services: number
  category: CategoryDTO
}

export interface PackageDetailDTO extends PackageDTO {
  category: CategoryDTO
}
