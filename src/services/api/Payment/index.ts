import { Payment } from "@models/backend/request/Payment"
import api from "../axios/api-config"
const PAYMENT = "/payment"

export const paymentApi = (data: Payment) => api(PAYMENT, "POST", data)
