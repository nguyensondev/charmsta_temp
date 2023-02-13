import { PaginationDTO } from "../Pagination"
import { ServiceDTO } from "../Service"

export interface PaginationStaffDTO extends PaginationDTO {
  content: Array<StaffDTO>
}

export interface StaffDTO {
  id: number
  name: string
  email: string
  phoneNumber: string
  avatar: string
  services: Array<ServiceDTO>
  directLink: string
  description: string
  workingHours: Array<IStaffWorkingHour>
  breakTimes: Array<IStaffBreakTime>
  timeOffs: Array<IStaffTimeOff>
  storeId: number
  isActive: boolean
}

export interface StaffByServiceDTO {
  avatar?: string
  description?: string
  directLink?: string
  email?: string
  id: number
  isActive: boolean
  name: string
  phoneNumber?: string
  storeId: number
  workingHours: Array<IStaffWorkingHour>
  breakTimes: Array<IStaffBreakTime>
  timeOffs: Array<IStaffTimeOff>
}
export interface IStaffTimeOff {
  id: number
  allDay: boolean
  staffId: number
  note: string
  repeat: string
  repeatEvery: number
  repeatOn: number[]
  startDate: string
  endDate: string
  duration: number
}

export interface IStaffBreakTime {
  id: number
  day: number
  fromHour: string
  toHour: string
  staffId: number
}

export interface IStaffService {
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
}

export interface IStaffWorkingHour {
  id: number
  day: number
  fromHour: string
  toHour: string
  open: boolean
  staffId: number
}
