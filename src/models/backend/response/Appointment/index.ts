import { AppointmentStatusEnum } from "@models/enum/appointment"
import { CustomerDTO } from "../Customer"
import { PackageDTO } from "../Package"
import { ServiceDTO } from "../Service"
import { StaffDTO } from "../Staff"

export interface AppointmentDTO {
  id: number
  customerId?: number
  customer?: CustomerDTO
  serviceId?: number
  staffId?: number
  lastDate: Date
  date: Date
  status?: AppointmentStatusEnum
  color?: string | "#EEEEEE"
  note?: string
  storeId?: number
  isCheckIn?: boolean | false
  labelId?: number
  label?: AppointmentLabelDTO
  remiderSent?: boolean | false
  followUpSent?: boolean | false
  didNotShow: boolean | false
  didNotShowSent: boolean | false
  created: Date
  isActive?: boolean | false
  service: ServiceDTO
  staff: StaffDTO
  duration?: number
  services: ServiceDTO[]
  packages: PackageDTO[]
}

export interface CalendarDTO extends AppointmentDTO {
  start: string
  end: string
  title: string
  summary: string
  duration?: number

  customer?: CustomerDTO
  // staff?: StaffDTOr
}

// export interface CalendarAgenda {
//   title?: string
//   data: CalendarDTO[]
// }

export interface CalendarAgenda {
  [date: string]: {
    data: CalendarDTO[]
    marked?: boolean
  }
}

export interface AppointmentLabelDTO {
  id: number
  color: string
  name: string
  storeId?: number
  isActive?: boolean
  isEditable?: boolean
  created?: Date
}

export enum AppointmentStatus {
  ok = "ok",
  cancel = "cancel",
}

export interface CheckoutDTO {
  coupon: number
  created: string
  customerId: number
  day: string
  discount: number
  extraTime: number
  id: number
  isPaid: boolean
  note: string
  startTime: string
  storeId: number
  total: number
  updated: string
}
