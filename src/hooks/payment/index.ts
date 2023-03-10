import { Payment } from "@models/backend/request/Payment"
import { paymentApi } from "@services/api/Payment"
import { AxiosResponse } from "axios"
import { useState } from "react"

interface Output {
  payment: (data: Payment) => void
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
      setLoading(true)

      const response = await paymentApi(data)
      if (response?.data) {
        setData(response.data)
      }
      setLoading(false)
    } catch (err) {
      setError(error)
      setLoading(false)
    }
  }

  return { payment, loading, error, data }
}
