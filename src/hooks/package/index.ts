import { CreatePackage } from "@models/backend/request/Package"
import {
  PackageDetailDTO,
  PackageDTO,
  PackageWithCategoryDTO,
} from "@models/backend/response/Package"
import {
  createPackageApi,
  deletePackageByIdApi,
  editPackageByIdApi,
  getPackageByIdApi,
  getPackageListApi,
} from "@services/api/Package"
import { useState } from "react"

interface Output {
  packageCreating: boolean
  newPackage: Partial<PackageDTO>
  createPackageErr: Error
  createPackage: (data: CreatePackage) => void
  packageList: PackageWithCategoryDTO[]
  gettingPackageList: boolean
  gettingPackageListErr: Error
  getPackageList: () => void
  packageDetail: Partial<PackageDetailDTO>
  gettingPackageDetail: boolean
  packageDetailErr: Error
  getPackageDetail: (id: number) => void
  deletePackageStatus: boolean
  deletingPackage: boolean
  deletepackageErr: Error
  deletePackage: (id: number) => void
  editedPackage: Partial<PackageDetailDTO>
  editingPackage: boolean
  editpackageErr: Error
  editPackage: (id: number, data: PackageDetailDTO) => void
}

export const usePackage = (): Output => {
  // new package
  const [packageCreating, setPackageCreating] = useState(false)
  const [newPackage, setNewPackage] = useState<Partial<PackageDTO>>({})
  const [createPackageErr, setCreatePackageErr] = useState<Error>()

  const createPackage = async (data: CreatePackage) => {
    try {
      setPackageCreating(true)
      const response = await createPackageApi(data)
      if (response?.data) {
        setNewPackage(response.data)
      }
    } catch (err) {
      setCreatePackageErr(err)
    } finally {
      setPackageCreating(false)
    }
  }

  // get package list

  const [packageList, setPackageList] = useState<PackageWithCategoryDTO[]>([])
  const [gettingPackageList, setGettingPackageList] = useState(false)
  const [gettingPackageListErr, setGettingPackageListErr] = useState<Error>()

  const getPackageList = async () => {
    try {
      setGettingPackageList(true)
      const response = await getPackageListApi()
      if (response?.data) {
        setPackageList(response.data)
      }
    } catch (err) {
      setGettingPackageListErr(err)
    } finally {
      setGettingPackageList(false)
    }
  }

  // get package detail

  const [packageDetail, setPackageDetail] = useState<Partial<PackageDetailDTO>>({})
  const [gettingPackageDetail, setGettingPackageDetail] = useState(false)
  const [packageDetailErr, setPackageDetailErr] = useState()

  const getPackageDetail = async (id: number) => {
    try {
      setGettingPackageDetail(true)
      setPackageDetail({})
      const response = await getPackageByIdApi(id)
      if (response?.data) {
        setPackageDetail(response.data)
      }
    } catch (err) {
      setPackageDetailErr(err)
    } finally {
      setGettingPackageDetail(false)
    }
  }

  // delete package

  const [deletePackageStatus, setDeletePackageStatus] = useState<boolean>(false)
  const [deletingPackage, setDeletingPackageDetail] = useState(false)
  const [deletepackageErr, setDeletePackageErr] = useState()

  const deletePackage = async (id: number) => {
    try {
      setDeletingPackageDetail(true)
      const response = await deletePackageByIdApi(id)
      if (response?.data) {
        setDeletePackageStatus(true)
      }
    } catch (err) {
      setDeletePackageErr(err)
    } finally {
      setDeletingPackageDetail(false)
    }
  }

  // edit package

  const [editedPackage, setEditedPackage] = useState<Partial<PackageDetailDTO>>({})
  const [editingPackage, setEditingPackageDetail] = useState(false)
  const [editpackageErr, setEditPackageErr] = useState()

  const editPackage = async (id: number, data: PackageDetailDTO) => {
    try {
      setEditingPackageDetail(true)
      const response = await editPackageByIdApi(id, data)
      if (response?.data) {
        setEditedPackage(response.data)
      }
    } catch (err) {
      setEditPackageErr(err)
    } finally {
      setEditingPackageDetail(false)
    }
  }

  return {
    packageCreating,
    newPackage,
    createPackageErr,
    createPackage,
    packageList,
    gettingPackageList,
    gettingPackageListErr,
    getPackageList,
    packageDetail,
    gettingPackageDetail,
    packageDetailErr,
    getPackageDetail,
    deletePackageStatus,
    deletingPackage,
    deletepackageErr,
    deletePackage,
    editedPackage,
    editingPackage,
    editpackageErr,
    editPackage,
  }
}
