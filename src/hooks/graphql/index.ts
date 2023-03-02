import { ApolloError, DocumentNode, useQuery } from "@apollo/client"
import { AppointmentDTO, CalendarAgenda, CalendarDTO } from "@models/backend/response/Appointment"
import { AppointmentStatusEnum } from "@models/enum/appointment"
import { convertAppointmentData, convertToAgendaItems } from "@utils/data"
import { get } from "lodash"
import moment from "moment"
import { useMemo } from "react"

interface Output {
  listAppointmnetTemp: CalendarDTO[]
  listAppointmentAgenda: CalendarAgenda
  refetch: () => void
  startPolling: (interval: number) => void
  stopPolling: () => void
  loading: boolean
  error: ApolloError
}

const useGraphql = (query: DocumentNode): Output => {
  const { data, refetch, startPolling, stopPolling, loading, error } = useQuery(query)

  const appointments = get(data, "getAppointments", [])

  const listAppointmnetTemp = useMemo(() => {
    const arrCalendar = [] as CalendarDTO[]
    appointments.forEach((element: AppointmentDTO, index) => {
      if (
        element.date &&
        // element.service &&
        element.duration &&
        moment(element.date).isValid() &&
        element.status !== AppointmentStatusEnum.Canceled
      ) {
        const item = convertAppointmentData(element)
        arrCalendar.push(item)
      }
    })

    return arrCalendar
  }, [data])

  const listAppointmentAgenda = useMemo(
    () => convertToAgendaItems(listAppointmnetTemp),
    [listAppointmnetTemp],
  )

  return {
    listAppointmentAgenda,
    listAppointmnetTemp,
    refetch,
    startPolling,
    stopPolling,
    loading,
    error,
  }
}

export default useGraphql
