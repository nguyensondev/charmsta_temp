import {
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
} from "@models/backend/response/Service"
import {
  addNewCategoryApi,
  addNewServiceApi,
  deleteCategoryApi,
  editCategoryApi,
  editServiceApi,
  getCategoryByIdApi,
  getCatListApi,
  getListServiceInCategoryAPI,
  getServiceListApi,
  updateListServiceInCategoryAPI,
} from "@services/api/Service"
import { consoleLog } from "@utils/debug"
import { AxiosError } from "axios"
import { Dispatch, SetStateAction, useState } from "react"

type Output = {
  loading: boolean
  setServiceList: Dispatch<SetStateAction<ServiceDTO[]>>
  pagination: PaginationDTO
  // list service
  loadingServiceList: boolean
  serviceList: ServiceDTO[]
  errServiceList: Error
  getServiceList: (search: string, page?: number) => void
  getAllServices: () => void
  // new service
  loadingNewService: boolean
  newService: ServiceDTO
  errNewService: Error
  addNewService: (data: Partial<NewService>) => void
  // cat
  loadingCatList: boolean
  catList: CategoryDTO[]
  errCatList: Error
  getCatList: (search?: string) => void
  // new cat
  loadingNewCategory: boolean
  newCategory: CategoryDTO
  errNewCategory: AxiosError
  addNewCategory: (data: Partial<NewCategory>) => void
  editCategory: (data: Partial<EditCategory>) => void
  editCategoryStatus: boolean
  // service in categort
  getListServiceInCategory: (id: number) => void
  serviceInCategory: ServiceInCategoryDTO[]
  setNewListServerInCategory: (data: Partial<ServiceInCategoryDTO[]>) => void
  updateListServerInCategory: (data: Partial<ServiceInCategoryDTO[]>, id: number) => void
  // category detail
  categoryDetail: Partial<CategoryByIdDTO>
  getCategoryById: (id: number) => void
  editSerivce: (data: ServiceDTO) => void
  // delete category
  deleteCategory: (id: number) => void
  categoryDeleted: boolean
  error: AxiosError
}

export const useService = (): Output => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<AxiosError>()
  const [pagination, setPagination] = useState<PaginationDTO>({
    page: 0,
    size: 20,
    totalElements: 0,
    totalPages: 0,
  })
  // list service
  const [loadingServiceList, setLoadingServiceList] = useState<boolean>(false)
  const [serviceList, setServiceList] = useState<ServiceDTO[]>([])
  const [errServiceList, setErrServiceList] = useState<Error>(null)
  // new service
  const [loadingNewService, setLoadingNewService] = useState<boolean>(false)
  const [newService, setNewService] = useState<ServiceDTO>(null)
  const [errNewService, setNewErrService] = useState<Error>(null)
  // cat
  const [loadingCatList, setLoadingCatList] = useState<boolean>(false)
  const [catList, setCatList] = useState<CategoryDTO[]>([])
  const [errCatList, setErrCatList] = useState<Error>(null)
  // new cat
  const [loadingNewCategory, setLoadingNewCategory] = useState<boolean>(false)
  const [newCategory, setNewCategory] = useState<CategoryDTO>(null)
  const [errNewCategory, setNewErrCategory] = useState<AxiosError>(null)
  const [editCategoryStatus, setEditCategoryStatus] = useState<boolean>(false)
  // service in category
  const [serviceInCategory, setServiceInCategory] = useState<ServiceInCategoryDTO[]>([])
  // delete category
  const [categoryDeleted, setCategoryDeleted] = useState(false)

  const getServiceList = async (search: string, page: number = pagination.page) => {
    try {
      const query = {
        search: search,
        page: page,
        size: pagination.size,
      } as ListSearch & PaginationDTO
      setLoadingServiceList(true)
      const result = await getServiceListApi(query)
      if (result && result?.data) {
        const {
          data: { content, ...rest },
        } = result
        setLoadingServiceList(false)
        setServiceList((prev) => (rest.page > 0 ? [...prev, ...content] : content))
        setPagination(rest)
        setErrServiceList(null)
      } else {
        const newErr = new Error("Data is empty!")
        setLoadingServiceList(false)
        setServiceList([])
        setErrServiceList(newErr)
      }
    } catch (err) {
      setErrServiceList(err)
      setLoadingServiceList(false)
    }
  }

  const getAllServices = async () => {
    try {
      setLoadingServiceList(true)
      const query = {
        page: 0,
        size: 1000,
        // || pagination.totalElements,
      } as ListSearch & PaginationDTO
      const result = await getServiceListApi(query)
      if (result && result?.data) {
        const {
          data: { content, ...rest },
        } = result
        setServiceList(content)
      }
    } catch (err) {
      setErrServiceList(err)
    } finally {
      setLoadingServiceList(false)
    }
  }

  // new service
  const addNewService = async (data: NewService) => {
    try {
      setLoadingNewService(true)
      const result = await addNewServiceApi(data)
      if (result && result.data) {
        setLoadingNewService(false)
        setNewService(result.data)
        setNewErrService(null)
      } else {
        const newErr = new Error("Data is empty!")
        setLoadingNewService(false)
        setNewService(null)
        setNewErrService(newErr)
      }
    } catch (err) {
      setNewErrService(err)
      setLoadingNewService(false)
    }
  }

  // cat
  const getCatList = async (search = "") => {
    try {
      const query = { search } as ListSearch
      setLoadingCatList(true)
      const result = await getCatListApi(query)
      if (result && result?.data) {
        setLoadingCatList(false)
        setCatList(result.data)
        setErrCatList(null)
      } else {
        const newErr = new Error("Data is empty!")
        setLoadingCatList(false)
        setCatList([])
        setErrCatList(newErr)
      }
    } catch (err) {
      setCatList([])
      setErrCatList(err)
    }
  }

  // new service
  const addNewCategory = async (data: NewCategory) => {
    try {
      setLoadingNewCategory(true)
      const result = await addNewCategoryApi(data)
      if (result && result.data) {
        setLoadingNewCategory(false)
        setNewCategory(result.data)
        setNewErrService(null)
      } else {
        const newErr = new Error("Data is empty!")
        setLoadingNewCategory(false)
        setNewCategory(null)
        setNewErrCategory(newErr as AxiosError)
      }
    } catch (err) {
      setNewErrCategory(err)
      setLoadingNewCategory(false)
    }
  }

  // edit category
  const editCategory = async (data: EditCategory) => {
    try {
      setLoadingNewCategory(true)
      const result = await editCategoryApi(data)
      if (result && result.data) {
        setLoadingNewCategory(false)
        setNewCategory(result.data)
        setNewErrService(null)
        setEditCategoryStatus(true)
      } else {
        const newErr = new Error("Data is empty!")
        setLoadingNewCategory(false)
        setNewCategory(null)
        setNewErrCategory(newErr as AxiosError)
        setEditCategoryStatus(false)
      }
    } catch (err) {
      setNewErrCategory(err)
      setLoadingNewCategory(false)
      setEditCategoryStatus(false)
    }
  }

  // list service in category
  const getListServiceInCategory = async (id: number) => {
    try {
      const query = { id } as ListServiceInCategory
      setLoadingCatList(true)
      const result = await getListServiceInCategoryAPI(query)
      if (result && result.data && result.data.length > 0) {
        setLoadingCatList(false)
        setServiceInCategory(result.data)
        setErrCatList(null)
      } else {
        const newErr = new Error("Data is empty!")
        setLoadingCatList(false)
        setServiceInCategory([])
        setErrCatList(newErr)
      }
    } catch (err) {
      setServiceInCategory([])
      setErrCatList(err)
    }
  }

  // update list service in catagory
  const setNewListServerInCategory = async (_serviceInCategory: ServiceInCategoryDTO[]) => {
    try {
      setServiceInCategory(_serviceInCategory)
      setErrCatList(null)
    } catch (err) {
      setServiceInCategory([])
      setErrCatList(err)
    }
  }

  // update list service in catagory
  const updateListServerInCategory = async (data: ServiceInCategoryDTO[], id: number) => {
    try {
      const categories = []
      // filtering updatable service in category
      data.forEach((service) => {
        if (
          (service.selected && !service.addNew) ||
          (!service.selected && !service.addNew) ||
          (service.selected && service.addNew)
        ) {
          categories.push(service)
        }
      })

      const query = { categories } as EditListServiceInCategory
      setLoadingNewCategory(true)
      const result = await updateListServiceInCategoryAPI(query, id)
      if (result && result.data) {
        setLoadingNewCategory(false)
        setNewErrService(null)
        setEditCategoryStatus(true)
      } else {
        const newErr = new Error("Data is empty!")
        setLoadingNewCategory(false)
        setNewCategory(null)
        setNewErrCategory(newErr as AxiosError)
        setEditCategoryStatus(false)
      }
    } catch (err) {
      setNewErrCategory(err)
      setLoadingNewCategory(false)
      setEditCategoryStatus(false)
    }
  }

  const [categoryDetail, setCategoryDetail] = useState<Partial<CategoryByIdDTO>>({})

  const getCategoryById = async (id: number) => {
    try {
      const res = await getCategoryByIdApi(id)
      if (res?.data) {
        setCategoryDetail(res.data)
      }
    } catch (err) {
      consoleLog("getCategoryById error: ", err)
    }
  }

  const editSerivce = async (data: ServiceDTO) => {
    try {
      setLoading(true)
      const response = await editServiceApi(data)
      if (response.data) {
        setNewService(response.data)
      }
    } catch (err) {
      consoleLog("editService Error: ", err)
    } finally {
      setLoading(false)
    }
  }

  const deleteCategory = async (id: number) => {
    try {
      setLoading(true)
      const response = await deleteCategoryApi(id)
      if (response.data) {
        setCategoryDeleted(true)
      }
    } catch (err) {
      consoleLog("editService Error: ", err)
      setError(err)
    } finally {
      setLoading(false)
    }
  }

  return {
    setServiceList,
    categoryDetail,
    loadingServiceList,
    serviceList,
    errServiceList,
    getServiceList,
    getCatList,
    catList,
    errCatList,
    loadingNewService,
    loadingCatList,
    errNewService,
    newService,
    addNewService,
    loadingNewCategory,
    newCategory,
    errNewCategory,
    addNewCategory,
    editCategory,
    editCategoryStatus,
    getListServiceInCategory,
    serviceInCategory,
    setNewListServerInCategory,
    updateListServerInCategory,
    getCategoryById,
    editSerivce,
    loading,
    deleteCategory,
    categoryDeleted,
    error,
    getAllServices,
    pagination,
  }
}
