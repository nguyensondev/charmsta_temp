/* eslint-disable no-async-promise-executor */
/* eslint-disable @typescript-eslint/ban-types */
import { consoleLog } from "@utils/debug"
import { loadString, saveString } from "@utils/storage"
import { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios"
import axiosInstance from "./axios"

const UNAUTHORIZED = 401
const REFRESH_TOKEN_URL = "/users/refreshToken"

/**
 * Defines a set of request methods to indicate the desired action to be performed for a given resource
 * @method The GET method requests a representation of the specified resource. Requests using GET should only retrieve data.
 * @method The POST method is used to submit an entity to the specified resource, often causing a change in state or side effects on the server.
 * @method The PUT method replaces all current representations of the target resource with the request payload
 * @method The DELETE method deletes the specified resource.
 */
type RequestMethodType = "GET" | "POST" | "PUT" | "DELETE" | "PATCH"

axiosInstance.interceptors.response.use(
  (response: AxiosResponse): AxiosResponse => response,
  async (error: AxiosError): Promise<any> => {
    try {
      const originalRequest: AxiosRequestConfig = error.config

      if (error.response && error.response.status === UNAUTHORIZED) {
        // refresh token
        const token = await loadString("@token")
        const refreshToken = await loadString("@refreshToken")

        if (token && refreshToken && refreshToken.length > 0 && token.length > 0) {
          console.log("current Auth ", {
            token,
            refreshToken,
          })
          return axiosInstance
            .post(REFRESH_TOKEN_URL, {
              token,
              refreshToken,
            })
            .then((response) => {
              if (response && response.data && response.data.refreshToken && response.data.token) {
                console.log("new Auth", {
                  token: response.data.token,
                  refreshToken: response.data.refreshToken,
                })

                // save to async-storage
                saveString("@token", response.data.token)
                saveString("@refreshToken", response.data.refreshToken)

                axiosInstance.defaults.headers.common.Authorization =
                  "Bearer " + response.data.token

                return axiosInstance(originalRequest)
              } else {
                return Promise.reject(error)
              }
            })
            .catch((error) => {
              return Promise.reject(error)
            })
        } else {
          return Promise.reject(error)
        }
      } else {
        return Promise.reject(error)
      }
    } catch (e) {
      return Promise.reject(error)
    }
  },
)

export class ApiError extends Error {
  public status?: number
  public data?: any

  constructor(status?: number, message?: string, data?: any) {
    super(message)
    this.status = status
    this.data = data
  }

  public getErrorMessage(): string {
    if (this.message && this.message) {
      return this.message
    }

    if (this.data && this.data.errors) {
      return this.data.errors.message || ""
    }

    return ""
  }
}

export interface IApiResponse<T = any> {
  data: T
  status: any
}

/**
 * Set authorization token for all apis
 *
 * @param {string} token An authorization token from server
 */
export function setAuthorizationHeader(token: string, type: string): void {
  axiosInstance.defaults.headers.common.Authorization = `${type} ${token}`
}

/**
 * Handle all errors from server and application
 *
 * @param {Error} error An error from axios library
 * @return {Object}
 */
export function handlingErrors(error: AxiosError): ApiError {
  let message: string | undefined
  let status: number | undefined
  let data: any | undefined
  try {
    if (error.response) {
      // tslint:disable-next-line:no-console
      console.log("API_ERROR", error.response)

      if (error.response.status === UNAUTHORIZED) {
        // store.dispatch(logout());
      }

      message = error.response.statusText
      data = error.response.data
      status = error.response.status
    } else {
      message = error.message
    }
  } catch (e) {
    message = e.message
  }

  return new ApiError(status, message, data)
}

/**
 * As middleware for API calling
 *
 * @param {string} url URL endpoint
 * @param {RequestMethodType} method Rest API method
 * @param {Object} data Body of rest API
 * @param {Object} headers Header of rest API
 * @param {Object} params Params of rest API
 * @return {Promise}
 */
//
export default <T>(
  url: string,
  method: RequestMethodType,
  data?: {},
  headers?: {},
  params?: any,
): Promise<IApiResponse<T>> => {
  return new Promise(async (resolve, reject) => {
    try {
      // get current token from async-storage
      const token = await loadString("@token")
      let defaultHeader = {}
      if (token && token.length > 0) {
        defaultHeader = {
          Authorization: "Bearer " + token,
        }
      }

      const response = await axiosInstance.request({
        data,
        headers: {
          ...defaultHeader,
          ...headers,
        },
        method,
        url,
        params,
      })
      resolve(response.data)
    } catch (e) {
      console.log("dos ", e)
      reject(e.response)
      // reject(handlingErrors(e))
    }
  })
}
