import { NewProduct } from "@models/backend/request/Product"
import { PaginationDTO } from "@models/backend/response/Pagination"
import { ProductDTO } from "@models/backend/response/Product"
import { createProductApi, getProductsApi, updateProductApi } from "@services/api/Product"
import { consoleLog } from "@utils/debug"
import { AxiosResponse } from "axios"
import { useState } from "react"

interface Output {
  loading: boolean
  error: AxiosResponse
  pagination: PaginationDTO
  products: Array<ProductDTO>
  newProduct: ProductDTO
  updateProductStatus: boolean
  createProductStatus: boolean
  getProducts: (search: string, page?: number) => void
  createProduct: (data: NewProduct) => void
  updateProduct: (product: ProductDTO) => void
}

export const useProduct = (): Output => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<AxiosResponse>()
  const [pagination, setPagination] = useState<PaginationDTO>({
    page: 0,
    size: 20,
    totalElements: 0,
    totalPages: 0,
  })
  const [newProduct, setNewProduct] = useState<ProductDTO>()
  const [updateProductStatus, setUpdateProductStatus] = useState(false)
  const [createProductStatus, setCreateProductStatus] = useState(false)
  const [products, setProducts] = useState<Array<ProductDTO>>()

  const getProducts = async (search: string, page: number = pagination.page) => {
    try {
      setLoading(true)
      const query = { search, page: page, size: pagination.size } as {
        search: string
      } & PaginationDTO
      const {
        data: { content, ...rest },
      } = await getProductsApi(query)
      setProducts((prev) => (rest.page > 0 ? [...prev, ...content] : content))
      setPagination(rest)
      setLoading(false)
    } catch (err) {
      consoleLog("Get products error: ", err)
      setError(err)
      setLoading(false)
    }
  }

  const createProduct = async (data: NewProduct) => {
    try {
      setLoading(true)
      const res = await createProductApi(data)
      if (res?.data) {
        setCreateProductStatus(true)
      }
      setLoading(false)
    } catch (err) {
      consoleLog("Update product fail: ", err)
      setError(err)

      setLoading(false)
    }
  }

  const updateProduct = async (product: ProductDTO) => {
    try {
      setLoading(true)
      const res = await updateProductApi(product)
      if (res?.data) {
        setUpdateProductStatus(true)
        setNewProduct(res.data)
      }
      setLoading(false)
    } catch (err) {
      consoleLog("Create product fail: ", err)
      setError(err)
      setLoading(false)
    }
  }

  return {
    loading,
    error,
    newProduct,
    pagination,
    products,
    updateProductStatus,
    createProductStatus,
    getProducts,
    createProduct,
    updateProduct,
  }
}
