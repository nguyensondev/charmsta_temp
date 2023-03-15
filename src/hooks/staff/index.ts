import { Staff } from "@models/backend/request/Staff"
import { PackageDTO } from "@models/backend/response/Package"
import { PaginationDTO } from "@models/backend/response/Pagination"
import { ServiceDTO } from "@models/backend/response/Service"
import { StaffByServiceDTO, StaffDTO } from "@models/backend/response/Staff"
import {
  createStaffProfileApi,
  deleteStaffProfileApi,
  editStaffProfileApi,
  getStaffApi,
  getStaffByServiceApi,
  getStaffByServicesAndPackagesApi,
  updateStaffServicesApi,
} from "@services/api/Staff"
import { consoleLog } from "@utils/debug"
import { AxiosResponse } from "axios"
import { useState } from "react"

interface Output {
  loading: boolean
  error: AxiosResponse
  loadingDelete: boolean
  editStaffStatus: boolean
  createStaffStatus: boolean
  deleteStaffStatus: boolean
  staffs: StaffDTO[]
  totalPages: number
  totalElements: number
  page: number
  size: number
  staffsByService: StaffByServiceDTO[]
  getStaff: (page?: number, size?: number) => void
  getStaffForCalendar: (page?: number, size?: number) => void
  editStaffProfile: (data: StaffDTO) => void
  createStaffProfile: (data: Staff) => void
  deleteStaffProfile: (id: number) => void
  getStaffByService: (serviceId: number, searchText?: string) => void
  getStaffByServicesAndPackages: (packages: PackageDTO[], services: ServiceDTO[]) => void
  updateStaffServices: (staffId: number, services: ServiceDTO[]) => void
}

export const useStaff = (): Output => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<AxiosResponse>()
  const [loadingDelete, setLoadingDelete] = useState(false)
  const [staffs, setStaffs] = useState<Array<StaffDTO>>([])
  const [totalPages, setTotalPages] = useState<number>(0)
  const [totalElements, setTotalElements] = useState<number>(0)
  const [page, setPage] = useState<number>(0)
  const [size, setSize] = useState<number>(20)
  const [staffsByService, setStaffsBySerice] = useState<Array<StaffByServiceDTO>>([])
  const [editStaffStatus, setEditStaffStatus] = useState(false)
  const [createStaffStatus, setCreateStaffStatus] = useState(false)
  const [deleteStaffStatus, setDeleteStaffStatus] = useState(false)

  const setPagination = (data: PaginationDTO) => {
    setTotalPages(data.totalPages)
    setTotalElements(data.totalElements)
    setPage(data.page)
    setSize(data.size)
  }

  const getStaff = async (page = 0) => {
    try {
      setLoading(true)
      const {
        data: { content, ...rest },
      } = await getStaffApi({ page, size })
      setStaffs((prev) => (rest.page === 0 ? content : [...prev, ...content]))
      setPagination(rest)
      setLoading(false)
    } catch (err) {
      consoleLog("get staff error: ", err)
      setError(err)
      setLoading(false)
    }
  }

  const getStaffForCalendar = async (page = 0, size = 3) => {
    try {
      setLoading(true)
      const { data } = await getStaffApi({ page, size })
      setStaffs(data.content)
      setPagination(data)
      setLoading(false)
    } catch (err) {
      consoleLog("get staff error: ", err)
      setLoading(false)
    }
  }

  const getStaffByService = async (serviceId: number, searchText?: string) => {
    try {
      setLoading(true)
      const { data } = await getStaffByServiceApi(serviceId, searchText)
      setStaffsBySerice(data)
      setLoading(false)
    } catch (err) {
      consoleLog("get staff by service error: ", err)
      setLoading(false)
    }
  }

  const editStaffProfile = async (profile: StaffDTO) => {
    try {
      setLoading(true)
      const { data } = await editStaffProfileApi(profile)
      if (data?.id) {
        setEditStaffStatus(true)
      } else {
        setLoading(false)
        setEditStaffStatus(false)
      }
    } catch (err) {
      setLoading(false)
      setError(err)
      setEditStaffStatus(false)
    }
  }

  const createStaffProfile = async (profile: Staff) => {
    try {
      setLoading(true)
      const { data } = await createStaffProfileApi(profile)
      if (data?.id) {
        setCreateStaffStatus(true)
      }
      setLoading(false)
    } catch (err) {
      setLoading(false)
      setError(err)
    }
  }

  const deleteStaffProfile = async (id: number) => {
    try {
      setLoadingDelete(true)
      const { data } = await deleteStaffProfileApi(id)
      if (data?.id) {
        setDeleteStaffStatus(true)
      }
      setLoadingDelete(false)
    } catch (err) {
      setError(err)
      setLoadingDelete(false)
    }
  }

  const getStaffByServicesAndPackages = async (
    packages: PackageDTO[] = [],
    services: ServiceDTO[] = [],
  ) => {
    try {
      setLoading(true)
      const packageIds = packages.map((pack) => pack.id).join(",")
      const serviceIds = services.map((service) => service.id).join(",")
      const response = await getStaffByServicesAndPackagesApi({ packageIds, serviceIds })
      if (response?.data) {
        setStaffsBySerice(response.data)
      }
    } catch (err) {
      consoleLog("getStaffByServicesAndPackages error: ", err)
    } finally {
      setLoading(false)
    }
  }

  const updateStaffServices = async (staffId: number, services: ServiceDTO[]) => {
    try {
      setLoading(true)
      await updateStaffServicesApi(staffId, services)
    } catch (err) {
      consoleLog("updateStaffServices error: ", err)
    } finally {
      setLoading(false)
    }
  }

  return {
    loading,
    error,
    loadingDelete,
    staffs,
    totalPages,
    totalElements,
    page,
    size,
    editStaffStatus,
    createStaffStatus,
    deleteStaffStatus,
    getStaff,
    getStaffForCalendar,
    editStaffProfile,
    createStaffProfile,
    deleteStaffProfile,
    getStaffByService,
    getStaffByServicesAndPackages,
    updateStaffServices,
    staffsByService,
  }
}
