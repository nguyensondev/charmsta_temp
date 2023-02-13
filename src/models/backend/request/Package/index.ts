import { ServiceDTO } from "@models/backend/response/Service"

export interface CreatePackage {
  name: string
  categoryId: number
  services: ServiceDTO[]
  cost: number
  price: number
}
