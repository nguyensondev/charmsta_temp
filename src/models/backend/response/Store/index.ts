export interface StoreDTO {
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
}

export interface StoreByIdDTO extends StoreDTO {
  appointmentSetting: StoreAppointmentSetting
}

export interface StoreAppointmentSetting {
  id: number
  bookingSlotSize: number
  noteForCustomer: string
  cancellationPolicy: number
  offHoursBooking: boolean
  doubleBooking: boolean
  customServiceDuration: boolean
  customServiceCost: boolean
  appointmentSlots: number
  weekStartDay: number
  reminder: boolean
  bookingReminderMessage: string
  reminderInMinute: number
  rebookingReminder: boolean
  bookingChanges: boolean
  bookingConfirmedMessage: string
  bookingChangedMessage: string
  bookingCancelledMessage: string
  rebookingReminderInDay: number
  rebookingReminderMessage: string
  didNotShow: boolean
  didNotShowAfterMinute: number
  didNotShowMessage: string
  folllowUp: boolean
  folllowUpAfterMinute: number
  folllowUpMessage: string
  storeId: number
}

export interface OpenHoursDTO {
  id: number
  day: number
  fromHour: string
  toHour: string
  open: boolean
  store: object
  storeId: number
}

export interface UpdateStoreDTO {
  generatedMaps: []
  raw: []
  affected: number
}

export interface TimeZoneDTO {
  countryName: string
  rawFormat: string
  rawOffsetInMinutes: string
  abbreviation: string
  alternativeName: string
  continentCode: string
  continentName: string
  countryCode: string

  group: string[]
  mainCities: string[]
  name: string
}
