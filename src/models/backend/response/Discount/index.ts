import { NewDiscount } from "@models/backend/request/Discount"

export interface DiscountDTO extends NewDiscount {
  id: number
  orderby: number
  isActive: boolean
  storeId: number
}
