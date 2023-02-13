import { PackageDTO } from "@models/backend/response/Package"
import { ProductDTO } from "@models/backend/response/Product"
import { ServiceDTO } from "@models/backend/response/Service"
import { AppointmentStatusEnum } from "@models/enum/appointment"

export interface CreateAppointment {
  customerId?: number
  serviceId?: number
  // staffId?: number
  lastDate: Date
  date: Date
  status?: string
  color?: string | "#EEEEEE"
  note?: string
  storeId?: number
  isCheckIn?: boolean | false
  labelId?: number
  remiderSent?: boolean | false
  followUpSent?: boolean | false
  didNotShow: boolean | false
  didNotShowSent: boolean | false
  duration?: number
  services: (Pick<ServiceDTO, "id" | "price" | "categoryId"> & { staffId: number })[]
  packages: (Pick<PackageDTO, "id" | "price"> & { staffId: number })[]
}

export interface CreateLabel {
  color: string
  name: string
  isEditable: boolean
}

export interface CancelAppointment {
  reason: string
  status: AppointmentStatusEnum.Canceled
}

export interface Checkout {
  startTime: string
  bookingId: number
  products: Array<Pick<ProductDTO, "id" | "price" | "quantity">>
  services: Array<Pick<ServiceDTO, "id" | "price" | "categoryId" | "staffId">>
  packages: Array<Pick<PackageDTO, "id" | "price" | "staffId">>
  discount: number
  coupon: number
  note: string
  total: number
  labelId: number
  date: string
}
