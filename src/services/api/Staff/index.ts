import { Staff } from "@models/backend/request/Staff"
import { ServiceDTO } from "@models/backend/response/Service"
import { PaginationStaffDTO, StaffByServiceDTO, StaffDTO } from "@models/backend/response/Staff"
import api from "../axios/api-config"

const GET_STAFF = "/appointment/staff"
const EDIT_STAFF = "/appointment/staff"
const CREATE_STAFF = "/appointment/staff"
const DELETE_STAFF = "/appointment/staff"
const GET_STAFF_BY_SERVICE = (serviceId: number) => `/appointment/service/${serviceId}/staffs`
const GET_STAFF_BY_SERVICES_AND_PACKAGES = "/appointment/staff/staffs/services"
const UPDATE_STAFF_SERVICES = (staffId: number) => `/appointment/staff/${staffId}/services`

export const getStaffApi = (params: { page: number; size: number }) =>
  api<PaginationStaffDTO>(GET_STAFF, "GET", null, null, params)
export const editStaffProfileApi = (data: StaffDTO) => api<StaffDTO>(EDIT_STAFF, "PATCH", data)
export const createStaffProfileApi = (data: Staff) => api<StaffDTO>(CREATE_STAFF, "POST", data)
export const deleteStaffProfileApi = (id: number) =>
  api<StaffDTO>(DELETE_STAFF + "/" + id, "DELETE")

export const getStaffByServiceApi = (serviceId: number, searchText = "") =>
  api<StaffByServiceDTO[]>(GET_STAFF_BY_SERVICE(serviceId), "GET", null, null, {
    search: searchText,
  })

export const getStaffByServicesAndPackagesApi = (params: {
  packageIds: string
  serviceIds: string
}) => api<any>(GET_STAFF_BY_SERVICES_AND_PACKAGES, "GET", undefined, {}, params)

export const updateStaffServicesApi = (staffId: number, services: ServiceDTO[]) =>
  api<StaffDTO>(UPDATE_STAFF_SERVICES(staffId), "PUT", { services })
