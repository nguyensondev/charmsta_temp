import { Payment } from "@models/backend/request/Payment"
import { paymentApi } from "@services/api/Payment"
import { AxiosResponse } from "axios"
import { useState } from "react"

interface Output {
  payment: (data: Payment) => {}
  loading: boolean
  error: any
  data: Partial<Payment>
}

export const usePayment = (): Output => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Partial<AxiosResponse>>()
  const [data, setData] = useState<Partial<Payment>>()

  const payment = async (data: Payment) => {
    try {
      const response = await paymentApi(data)
      if (response?.data) {
        setData(response.data)
      }
    } catch (err) {
      setError(error)
    }
  }

  return { payment, loading, error, data }
}
