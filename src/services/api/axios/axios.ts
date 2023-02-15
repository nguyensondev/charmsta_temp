import axios from "axios"
import axiosRetry from "axios-retry"

const axiosInstance = axios.create({
  baseURL: "http://192.168.1.43:3000",
  withCredentials: true,
  timeout: 30000,
})

axiosRetry(axiosInstance, {
  retries: 3,
  retryDelay: (retryCount: number): number => retryCount * 1000,
})

export default axiosInstance
