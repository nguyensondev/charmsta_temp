import { SignUpEmail } from "@models/backend/request/Auth"
import { Payment } from "@models/backend/request/Payment"
import { AppointmentLabelDTO, CalendarDTO, CheckoutDTO } from "@models/backend/response/Appointment"
import { RegisterDTO } from "@models/backend/response/Auth"
import { CustomerDTO } from "@models/backend/response/Customer"
import { DiscountDTO } from "@models/backend/response/Discount"
import { PackageDetailDTO, PackageDTO } from "@models/backend/response/Package"
import { ProductDTO } from "@models/backend/response/Product"
import { CategoryDTO, ServiceDTO } from "@models/backend/response/Service"
import { StaffDTO } from "@models/backend/response/Staff"
import { StoreByIdDTO, StoreDTO, TimeZoneDTO } from "@models/backend/response/Store"
import { TaxDTO } from "@models/backend/response/Tax"
import { AUTH_SCREENS, COMMON_SCREENS, MAIN_SCREENS } from "@models/enum/screensName"
import { SceneMapNameEnum } from "@screens/main/selection"

export type MainNavigatorParamList = {
  [MAIN_SCREENS.empty]: undefined
  [MAIN_SCREENS.home]: { hasFollowedProject: boolean } | { screen: string; params: any }
  [MAIN_SCREENS.serviceList]: undefined
  [MAIN_SCREENS.categoryList]: undefined
  [MAIN_SCREENS.customerList]: undefined
  [MAIN_SCREENS.customerProfile]: { editable?: boolean; customerProfile?: CustomerDTO }
  [MAIN_SCREENS.newService]: { detail?: ServiceDTO }
  [MAIN_SCREENS.serviceDetail]: {
    detail: ServiceDTO
    category: Omit<CategoryDTO, "packages" | "services">
  }
  [MAIN_SCREENS.newCategory]: undefined
  [MAIN_SCREENS.categoryDetail]: { detail: CategoryDTO; editable?: boolean }
  [MAIN_SCREENS.staffList]: undefined
  [MAIN_SCREENS.staffProfile]: { detail?: StaffDTO; editable?: boolean; updated: boolean }
  [MAIN_SCREENS.categoryProfile]: { detail?: CategoryDTO; editable?: boolean }
  [MAIN_SCREENS.newAppointment]: {
    start?: string
    appointmentDetail: CalendarDTO & { packages: PackageDTO[]; services: ServiceDTO[] }
  }
  [MAIN_SCREENS.productList]: undefined
  [MAIN_SCREENS.productDetail]: { detail?: ProductDTO; editable?: boolean }
  [MAIN_SCREENS.workingDays]: { staffDetail: StaffDTO }
  [MAIN_SCREENS.customerImport]: undefined
  [MAIN_SCREENS.catagoryProfile]: { detail?: CategoryDTO; editable?: boolean }
  [MAIN_SCREENS.breaks]: { staffDetail: StaffDTO; editable?: boolean }
  [MAIN_SCREENS.timeOff]: { staffDetail: StaffDTO; editable?: boolean }
  [MAIN_SCREENS.timeOffDetail]: { staffDetail: StaffDTO }
  [MAIN_SCREENS.settings]: undefined
  [MAIN_SCREENS.companyHours]: { storeDetail: StoreDTO; timeZone?: TimeZoneDTO }
  [MAIN_SCREENS.timeZone]: { storeDetail: StoreDTO; timeZone: TimeZoneDTO }
  [MAIN_SCREENS.storeDetail]: { storeDetail: StoreDTO }
  [MAIN_SCREENS.bookingPolicies]: { storeDetail: StoreByIdDTO }
  [MAIN_SCREENS.bookingSlotSize]: { storeDetail: StoreByIdDTO }
  [MAIN_SCREENS.customerNotes]: { storeDetail: StoreByIdDTO }
  [MAIN_SCREENS.cancellationPolicy]: { storeDetail: StoreByIdDTO }
  [MAIN_SCREENS.appointmentSlot]: { storeDetail: StoreByIdDTO }
  [MAIN_SCREENS.weekStartDay]: { storeDetail: StoreByIdDTO }
  [MAIN_SCREENS.labelList]: undefined
  [MAIN_SCREENS.checkout]: { appointment: CalendarDTO }
  [MAIN_SCREENS.newLabel]: { labelDetail: AppointmentLabelDTO } | undefined
  [MAIN_SCREENS.appointmentDetail]: { detail: CalendarDTO }
  [MAIN_SCREENS.editAppointment]: { detail: CalendarDTO; start?: string }
  [MAIN_SCREENS.additionSelect]: {
    prevSelected?: any
    actionName: SceneMapNameEnum
    routeIndex?: number
  }
  [MAIN_SCREENS.packageList]: undefined
  [MAIN_SCREENS.newPackage]: undefined
  [MAIN_SCREENS.packageDetail]: {
    packageId: number
    category: Omit<CategoryDTO, "packages" | "services">
  }
  [MAIN_SCREENS.editPackage]: { packageDetail: PackageDetailDTO }
  [MAIN_SCREENS.privacy]: undefined
  [MAIN_SCREENS.cancelAppointment]: { appointmentId: number }
  [MAIN_SCREENS.storeMenu]: undefined
  [MAIN_SCREENS.editAccount]: { newAddress?: string }
  [MAIN_SCREENS.accountProfile]: undefined
  [MAIN_SCREENS.changePassword]: undefined
  [MAIN_SCREENS.paymentType]: { checkoutInfo: CheckoutDTO }
  [MAIN_SCREENS.cashPayment]: Payment
  [MAIN_SCREENS.cardPayment]: Payment
  [MAIN_SCREENS.otherPayment]: Payment
  [MAIN_SCREENS.editService]: { detail: ServiceDTO }
  [MAIN_SCREENS.taxList]: undefined
  [MAIN_SCREENS.newTax]: undefined
  [MAIN_SCREENS.taxDetail]: { detail: TaxDTO }
  [MAIN_SCREENS.editTax]: { detail: TaxDTO }
  [MAIN_SCREENS.newDiscount]: { detail: DiscountDTO }
  [MAIN_SCREENS.discountList]: undefined
  [MAIN_SCREENS.discountDetail]: { detail: DiscountDTO }
  [MAIN_SCREENS.editDiscount]: { detail: DiscountDTO }
}

export type AuthNavigatorParamList = {
  [AUTH_SCREENS.onboarding]: undefined
  [AUTH_SCREENS.login]: undefined
  [AUTH_SCREENS.test]: undefined
  [AUTH_SCREENS.signIn]: undefined
  [AUTH_SCREENS.signUp]: undefined
  [AUTH_SCREENS.forgotPassword]: undefined
  [AUTH_SCREENS.storeForm]: {
    data: SignUpEmail
    providerName: string
    registerData?: Omit<RegisterDTO, "accessToken">
  }
  [AUTH_SCREENS.global]: undefined
  [AUTH_SCREENS.modal]: undefined
  [AUTH_SCREENS.companyHours]: {
    storeDetail: StoreByIdDTO
    registerData?: Omit<RegisterDTO, "accessToken">
  }
  [AUTH_SCREENS.timeZone]: { storeDetail: StoreByIdDTO }
  [AUTH_SCREENS.empty]: undefined
}

export type CommonNavigatorParamList = {
  [COMMON_SCREENS.searchLocation]: {
    fromScreen: AUTH_SCREENS & COMMON_SCREENS
    type?: "establishment" | "geocode"
  }
}
