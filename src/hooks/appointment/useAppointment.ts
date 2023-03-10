import { EVENT_CALENDAR_FORMAT } from "@config/constants"
import { Checkout, CreateAppointment, CreateLabel } from "@models/backend/request/Appointment"
import {
  AppointmentDTO,
  AppointmentLabelDTO,
  CalendarAgenda,
  CalendarDTO,
  CheckoutDTO
} from "@models/backend/response/Appointment"
import { AppointmentStatusEnum } from "@models/enum/appointment"
import {
  addNewAppointmentApi,
  addNewLabelAppointmentApi,
  cancelAppointmentByIdApi,
  checkoutApi,
  deleteAppointmentApi,
  delLabelAppointmentApi,
  editAppointmentApi,
  editLabelAppointmentApi,
  getAppointmentByIdApi,
  listAppointmentApi,
  listLabelAppointmentApi
} from "@services/api/Appontment"
import { convertAppointmentData, convertToAgendaItems } from "@utils/data"
import { consoleLog } from "@utils/debug"
import moment from "moment"
import { useState } from "react"

type Output = {
  // new appointment
  loadingNewAppointment: boolean
  newAppointmnet: AppointmentDTO
  errNewAppoint: Error
  addNewAppointment: (data: Partial<CreateAppointment>) => void
  // delete appointment
  deleteAppointment: (id: number) => void
  deleteAppointmentLoading: boolean
  // list appointment
  loadingAppointment: boolean
  listAppointmnet: AppointmentDTO[]
  errListAppointment: Error
  getListAppointment: () => void
  listAppointmnetTemp: CalendarDTO[]
  listAppointmentAgenda: CalendarAgenda
  // list label
  loadingLabels: boolean
  listLabel: AppointmentLabelDTO[]
  errListLabel: Error
  getListLabel: () => void
  // new label
  loadingNewLabel: boolean
  newLabel: AppointmentLabelDTO
  errNewLabel: Error
  addNewLabel: (data: Partial<CreateLabel>) => void
  // edit label
  loadingEditLabel: boolean
  editLabel: AppointmentLabelDTO
  errEditLabel: Error
  editALabel: (data: Partial<CreateLabel>, id: number) => void

  // delete label
  delStatus: boolean
  errDeleteLabel: Error
  delALabel: (id: number) => void

  // edit appointment
  editAppointment: (id: number, data: AppointmentDTO) => void
  loadingEditAppointment: boolean
  editedAppointment: AppointmentDTO
  errEditAppoint: Error

  // appointment by id
  appointmentDetail: Partial<CalendarDTO>
  gettingAppointmentDetail: boolean
  getAppointmentDetailErr: Error
  getAppointmentById: (id: number) => void

  // cancel appointment by id
  cancelStatus: boolean
  cancelError: Error
  cancelAppointment: (id: number, reason: string) => void

  // checkout appointment
  checkoutAppointment: (data: Checkout) => void
  checkoutInfo: Partial<CheckoutDTO>
}

export const useAppointment = (): Output => {
  // new appointment
  const [loadingNewAppointment, setLoadingNewAppointment] = useState<boolean>(false)
  const [newAppointmnet, setNewAppointmnet] = useState<AppointmentDTO>(null)
  const [errNewAppoint, setErrNewAppoint] = useState<Error>(null)

  // edit appointmnet
  const [loadingEditAppointment, setLoadingEditAppointment] = useState<boolean>(false)
  const [editedAppointment, setEditedAppointment] = useState<AppointmentDTO>(null)
  const [errEditAppoint, setErrEditAppoint] = useState<Error>(null)

  // list appointment
  const [loadingAppointment, setLoadingAppointment] = useState<boolean>(false)
  const [listAppointmnet, setListAppointmnet] = useState<AppointmentDTO[]>([])
  const [listAppointmnetTemp, setListAppointmnetTemp] = useState<CalendarDTO[]>([])
  const [listAppointmentAgenda, setListAppointmentAgenda] = useState<CalendarAgenda>({})
  const [errListAppointment, setErrListAppointment] = useState<Error>(null)

  // new label
  const [loadingNewLabel, setLoadingNewLabel] = useState<boolean>(false)
  const [newLabel, setNewLabel] = useState<AppointmentLabelDTO>(null)
  const [errNewLabel, setErrNewLabel] = useState<Error>(null)

  // edit label
  const [loadingEditLabel, setLoadingEditLabel] = useState<boolean>(false)
  const [editLabel, setEditLabel] = useState<AppointmentLabelDTO>(null)
  const [errEditLabel, setErrEditLabel] = useState<Error>(null)

  // list label
  const [loadingLabels, setLoadingLabels] = useState<boolean>(false)
  const [listLabel, setListLabel] = useState<AppointmentLabelDTO[]>([])
  const [errListLabel, setErrListLabel] = useState<Error>(null)

  // delete label
  const [delStatus, setDelStatus] = useState<boolean>(false)
  const [errDeleteLabel, setErrDelLabel] = useState<Error>(null)

  // list appointment
  const getListLabel = async () => {
    try {
      setLoadingLabels(true)
      const result = await listLabelAppointmentApi()
      if (result && result.data && result.data.length > 0) {
        setListLabel(result.data)
        setErrListLabel(null)
        setLoadingLabels(false)
      } else {
        setListLabel([])
        // const newErr = new Error("Data is empty!")
        setLoadingLabels(false)
        // setErrListLabel(newErr)
      }
    } catch (err) {
      setErrListLabel(err)
      setLoadingLabels(false)
    }
  }

  // new label
  const addNewLabel = async (data: CreateLabel) => {
    try {
      setLoadingNewLabel(true)

      const result = await addNewLabelAppointmentApi(data)
      if (result && result.data) {
        setLoadingNewLabel(false)
        setNewLabel(result.data)
        setErrNewLabel(null)
      } else {
        const newErr = new Error("Cannot create a label!")
        setLoadingNewLabel(false)
        setNewLabel(null)
        setErrNewLabel(newErr)
      }
    } catch (err) {
      setErrNewLabel(err)
      setLoadingNewLabel(false)
    }
  }

  // edit label
  const editALabel = async (data: CreateLabel, id: number) => {
    try {
      setLoadingEditLabel(true)
      const result = await editLabelAppointmentApi(data, id)
      if (result && result.data) {
        setEditLabel(result.data)
        setLoadingEditLabel(false)
        setErrEditLabel(null)
      } else {
        const newErr = new Error("Cannot edit a label!")
        setEditLabel(null)
        setLoadingEditLabel(false)
        setErrEditLabel(newErr)
      }
    } catch (err) {
      setErrEditLabel(err)
      setLoadingEditLabel(false)
    }
  }

  // edit label
  const delALabel = async (id: number) => {
    try {
      setLoadingEditLabel(true)
      const result = await delLabelAppointmentApi(id)
      if (result && result.data) {
        setDelStatus(result.data)
        setErrDelLabel(null)
      } else {
        const newErr = new Error("Cannot edit a label!")
        setDelStatus(false)
        setErrDelLabel(newErr)
      }
    } catch (err) {
      setErrDelLabel(err)
    }
  }

  // new appointment
  const addNewAppointment = async (data: CreateAppointment) => {
    try {
      setLoadingNewAppointment(true)
      const result = await addNewAppointmentApi(data)
      if (result && result.data) {
        setNewAppointmnet(result.data)
        setLoadingNewAppointment(false)
        setErrNewAppoint(null)
      } else {
        const newErr = new Error("Cannot create appointment!")
        setLoadingNewAppointment(false)
        setNewAppointmnet(null)
        setErrNewAppoint(newErr)
      }
    } catch (err) {
      const newErr = new Error("Cannot create appointment!")
      setErrNewAppoint(newErr)
      setLoadingNewAppointment(false)
    }
  }

  // edit appointment
  const editAppointment = async (id: number, data: AppointmentDTO) => {
    try {
      setLoadingEditAppointment(true)
      const result = await editAppointmentApi(id, data)
      if (result && result.data) {
        setEditedAppointment(result.data)
        setLoadingEditAppointment(false)
        setErrNewAppoint(null)
      } else {
        const newErr = new Error("Cannot create appointment!")
        setLoadingEditAppointment(false)
        setEditedAppointment(null)
        setErrNewAppoint(newErr)
      }
    } catch (err) {
      const newErr = new Error("Cannot create appointment!")
      setErrNewAppoint(newErr)
      setLoadingEditAppointment(false)
    }
  }

  // list appointment
  const getListAppointment = async () => {
    try {
      setLoadingAppointment(true)
      const result = await listAppointmentApi()
      if (result && result.data && result.data.length > 0) {
        const arrCalendar = [] as CalendarDTO[]
        result.data.forEach((element) => {
          if (
            element.date &&
            element.service &&
            element.duration &&
            moment(element.date).isValid()
          ) {
            const startTemp = moment(element.date).local()
            const min = startTemp.minutes()
            const item = {
              ...element,
              start: startTemp.format(EVENT_CALENDAR_FORMAT),
              end: startTemp.set({ m: min + element.duration }).format(EVENT_CALENDAR_FORMAT),
              title: element.service && element.service.name ? element.service.name : "",
              summary: element.staff && element.staff.name ? element.staff.name : "",
            }
            arrCalendar.push(item)
          }
        })
        setLoadingAppointment(false)
        setListAppointmnetTemp(arrCalendar)
        setListAppointmentAgenda(convertToAgendaItems(arrCalendar))
        setErrListAppointment(null)
      } else {
        const newErr = new Error("Data is empty!")
        setLoadingAppointment(false)
        setListAppointmnetTemp([])
        setErrListAppointment(newErr)
      }
    } catch (err) {
      setErrListAppointment(err)
      setLoadingAppointment(false)
    }
  }

  // delete appointment

  const [deleteAppointmentLoading, setDeleteAppointmentLoading] = useState(false)

  const deleteAppointment = async (id: number) => {
    try {
      setDeleteAppointmentLoading(true)
      const response = await deleteAppointmentApi(id)
      if (response?.data) {
        consoleLog(response.data)
      }
      setDeleteAppointmentLoading(false)
    } catch (err) {
      setDeleteAppointmentLoading(false)
    }
  }

  // get appointment by id

  const [appointmentDetail, setAppointmentDetail] = useState<Partial<CalendarDTO>>({})
  const [gettingAppointmentDetail, setGettingAppointmentDetail] = useState(false)
  const [getAppointmentDetailErr, setGetAppointmentDetailErr] = useState<Error>()
  const getAppointmentById = async (id: number) => {
    try {
      setGettingAppointmentDetail(true)
      const response = await getAppointmentByIdApi(id)
      if (response?.data) {
        setAppointmentDetail(convertAppointmentData(response.data))
      }
    } catch (err) {
      setGetAppointmentDetailErr(err)
    } finally {
      setGettingAppointmentDetail(false)
    }
  }
  // cancel appointment
  const [cancelStatus, setCancelStatus] = useState<boolean>(false)
  const [cancelError, setCancelError] = useState<Error>()

  const cancelAppointment = async (id: number, reason: string) => {
    try {
      const response = await cancelAppointmentByIdApi(id, {
        reason,
        status: AppointmentStatusEnum.Canceled,
      })
      if (response?.data) {
        setCancelStatus(true)
      }
    } catch (err) {
      setCancelError(err)
    }
  }

  // checkout appointment
  const [checkoutInfo, setCheckoutInfo] = useState<Partial<CheckoutDTO>>({})

  const checkoutAppointment = async (data: Checkout) => {
    try {
      const response = await checkoutApi(data)
      if (response?.data) {
        setCheckoutInfo(response.data)
      }
    } catch (err) {
      consoleLog("checkout error: ", err)
    }
  }

  return {
    deleteAppointmentLoading,
    loadingNewAppointment,
    newAppointmnet,
    listAppointmentAgenda,
    errNewAppoint,
    addNewAppointment,
    loadingAppointment,
    listAppointmnet,
    errListAppointment,
    getListAppointment,
    listAppointmnetTemp,
    addNewLabel,
    getListLabel,
    loadingNewLabel,
    newLabel,
    errNewLabel,
    loadingLabels,
    listLabel,
    errListLabel,
    editALabel,
    loadingEditLabel,
    editLabel,
    errEditLabel,
    delALabel,
    delStatus,
    errDeleteLabel,
    editAppointment,
    loadingEditAppointment,
    editedAppointment,
    errEditAppoint,
    deleteAppointment,
    appointmentDetail,
    gettingAppointmentDetail,
    getAppointmentDetailErr,
    getAppointmentById,
    cancelStatus,
    cancelError,
    cancelAppointment,
    checkoutAppointment,
    checkoutInfo,
  }
}
