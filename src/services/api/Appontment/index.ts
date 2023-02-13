import {
  CancelAppointment,
  Checkout,
  CreateAppointment,
  CreateLabel,
} from "@models/backend/request/Appointment"
import {
  AppointmentDTO,
  AppointmentLabelDTO,
  CheckoutDTO,
} from "@models/backend/response/Appointment"
import api from "../axios/api-config"

const NEW_APPOINTMENT = "/appointment/booking"
const APPOINTMENT_LABEL = "/appointment/label"
const EDIT_APPOINTMENT = "/appointment/booking"
const DELETE_APPOINTMENT = "/appointment/booking/"
const APPOINTMENT_BY_ID = "/appointment/booking"
const CANCEL_APPOINTMENT = "/appointment/booking"
const CHECKOUT = "/checkin/checkout"

export function addNewAppointmentApi(data: CreateAppointment) {
  return api<AppointmentDTO>(NEW_APPOINTMENT, "POST", data)
}

export function editAppointmentApi(id: number, data: AppointmentDTO) {
  return api<AppointmentDTO>(`${EDIT_APPOINTMENT}/${id}`, "PUT", data)
}

export function listAppointmentApi() {
  return api<AppointmentDTO[]>(NEW_APPOINTMENT, "GET")
}

export function addNewLabelAppointmentApi(data: CreateLabel) {
  return api<AppointmentLabelDTO>(APPOINTMENT_LABEL, "POST", data)
}

export function listLabelAppointmentApi() {
  return api<AppointmentLabelDTO[]>(APPOINTMENT_LABEL, "GET")
}

export function editLabelAppointmentApi(data: CreateLabel, id: number) {
  return api<AppointmentLabelDTO>(APPOINTMENT_LABEL + "/" + id, "PUT", data)
}

export function delLabelAppointmentApi(id: number) {
  return api<boolean>(APPOINTMENT_LABEL + "/" + id, "DELETE")
}

export const deleteAppointmentApi = (id: number) =>
  api<any>(`${DELETE_APPOINTMENT}/${id}`, "DELETE")

export const getAppointmentByIdApi = (id: number) =>
  api<AppointmentDTO>(`${APPOINTMENT_BY_ID}/${id}`, "GET")

export const cancelAppointmentByIdApi = (id: number, data: CancelAppointment) =>
  api<any>(`${CANCEL_APPOINTMENT}/${id}`, "PATCH", data)

export const checkoutApi = (data: Checkout) => api<CheckoutDTO>(CHECKOUT, "POST", data)
