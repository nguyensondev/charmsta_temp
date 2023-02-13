import { OpenHoursDTO, StoreAppointmentSetting } from "@models/backend/response/Store"

export interface UpdateStore {
  id: number
  name: string
  bookingPage: string
  categories: string
  phoneNumber: string
  email: string
  address: string
  address2: string
  city: string
  state: string
  zipcode: string
  currency: string
  timezone: string
  icon: string
  image: string
  distance: number
  rate: number
  reviewCount: number
  hasService: boolean
  openHours: OpenHoursDTO[]
  default: boolean
  bookingSlotSize: number
  notes: string
  cancelTime: number
  appointmentSetting: StoreAppointmentSetting
}

export interface CreateStore {
  name: string
  categories: string
  phoneNumber: string
  email?: string
  address: string
  address2?: string
  city: string
  state: string
  zipcode: string
  latitude?: number
  longitude?: number
  icon?: string
  image?: string
}
