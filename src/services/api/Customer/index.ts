import { Customer, ImportCustomer } from "@models/backend/request/Customer"
import { CustomerDTO } from "@models/backend/response/Customer"
import api from "../axios/api-config"

const CUSTOMER = "/customers"
const UPDATE_CUSTOMER = "/customers/update"
const GET_CUSTOMER_BY_ID = "/customers/customer/"
const IMPORT_CUSTOMER = "/customers/import"

export const getCustomersApi = async (skip: number, search: string = null) =>
  api<Array<CustomerDTO>>(
    CUSTOMER,
    "GET",
    undefined,
    {},
    {
      skip,
      take: 10,
      search,
    },
  )

export const importCustomersApi = async (data: ImportCustomer[]) =>
  api<{ status: "ok" }>(IMPORT_CUSTOMER, "POST", { customer: data })

export const updateCustomersApi = async (data: Customer) =>
  api<CustomerDTO>(UPDATE_CUSTOMER, "PUT", data)

export const createCustomerApi = async (data: { customer: Customer }) =>
  api<CustomerDTO>(CUSTOMER, "POST", data)

export const getCustomerByIdApi = async (id: number) =>
  api<CustomerDTO>(GET_CUSTOMER_BY_ID + id, "GET")
