import axios from "axios"
import axiosRetry from "axios-retry"

const axiosInstance = axios.create({
  baseURL: "https://uzmos-api.softyn.com",
  withCredentials: true,
  timeout: 30000,
})

axiosRetry(axiosInstance, {
  retries: 3,
  retryDelay: (retryCount: number): number => retryCount * 1000,
})

export default axiosInstance
