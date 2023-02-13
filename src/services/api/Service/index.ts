import {
  CategorySearch,
  EditCategory,
  EditListServiceInCategory,
  ListSearch,
  ListServiceInCategory,
  NewCategory,
  NewService,
} from "@models/backend/request/Service"
import { PaginationDTO } from "@models/backend/response/Pagination"
import {
  CategoryByIdDTO,
  CategoryDTO,
  ServiceDTO,
  ServiceInCategoryDTO,
  ServicePaginationDTO,
  UpdateServiceInCategoryDTO,
} from "@models/backend/response/Service"
import api from "../axios/api-config"

const SERVICE_LIST = "/appointment/service"
const SERVICE_ADD = "/appointment/service"
const EDIT_SERVICE = "/appointment/service"
const CATEGORY_LIST = "/pop/category"
const CATEGORY_ADD = "/pop/category"
const GET_CATEGORY_BY_ID = "/pop/category"
const SERVICE_LIST_IN_CATEGORY = "/pop/category"
const UPDATE_SERVICE_LIST_IN_CATEGORY = "/pop/category"
const DELETE_CATEGORY = "/pop/category"

export function getServiceListApi(data: ListSearch & PaginationDTO) {
  return api<ServicePaginationDTO>(SERVICE_LIST, "GET", undefined, {}, data)
}

export function editServiceApi(data: ServiceDTO) {
  return api<ServiceDTO>(EDIT_SERVICE + `/${data.id}`, "PUT", data)
}

export function addNewServiceApi(data: NewService) {
  return api<ServiceDTO>(SERVICE_ADD, "POST", data)
}

export function getCatListApi(data: CategorySearch) {
  return api<CategoryDTO[]>(CATEGORY_LIST, "GET", undefined, {}, data)
}

export function addNewCategoryApi(data: NewCategory) {
  return api<CategoryDTO>(CATEGORY_ADD, "POST", data)
}

export function editCategoryApi(data: EditCategory) {
  return api<CategoryDTO>(CATEGORY_ADD + "/" + data.id, "PUT", data)
}

export function getListServiceInCategoryAPI(data: ListServiceInCategory) {
  return api<ServiceInCategoryDTO[]>(
    SERVICE_LIST_IN_CATEGORY + "/" + data.id + "/services",
    "GET",
    undefined,
    {},
    data,
  )
}

export function updateListServiceInCategoryAPI(data: EditListServiceInCategory, id: number) {
  return api<UpdateServiceInCategoryDTO>(
    UPDATE_SERVICE_LIST_IN_CATEGORY + "/" + id + "/services",
    "PUT",
    data,
  )
}

export function getCategoryByIdApi(id: number) {
  return api<CategoryByIdDTO>(`${GET_CATEGORY_BY_ID}/${id}`, "GET")
}

export function deleteCategoryApi(id: number) {
  return api<any>(`${GET_CATEGORY_BY_ID}/${id}`, "DELETE")
}
