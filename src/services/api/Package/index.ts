import { CreatePackage } from "@models/backend/request/Package"
import {
  PackageDetailDTO,
  PackageDTO,
  PackageWithCategoryDTO,
} from "@models/backend/response/Package"
import api from "../axios/api-config"

const NEW_PACKAGE = "/package-category"
const GET_PACKAGE = "/package-category"
const DELETE_PACKAGE = "/package-category"
const EDIT_PACKAGE = "/package-category"
const GET_PACAKGE_LIST = "/package-category/packages/categories"

export const createPackageApi = (data: CreatePackage) => api<PackageDTO>(NEW_PACKAGE, "POST", data)

export const getPackageListApi = () => api<PackageWithCategoryDTO[]>(GET_PACAKGE_LIST, "GET")

export const getPackageByIdApi = (id: number) =>
  api<PackageDetailDTO>(`${GET_PACKAGE}/${id}`, "GET")

export const deletePackageByIdApi = (id: number) => api<any>(`${DELETE_PACKAGE}/${id}`, "DELETE")

export const editPackageByIdApi = (id: number, data: PackageDetailDTO) =>
  api<PackageDetailDTO>(`${EDIT_PACKAGE}/${id}`, "PUT", data)
