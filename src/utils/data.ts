import { DATE_FORMAT, EVENT_CALENDAR_FORMAT } from "@config/constants"
import { AppointmentDTO, CalendarAgenda, CalendarDTO } from "@models/backend/response/Appointment"
import { PackageDTO } from "@models/backend/response/Package"
import { CategoryDTO, ServiceDTO } from "@models/backend/response/Service"
import { MAIN_SCREENS } from "@models/enum/screensName"
import { useStores } from "@models/index"
import { useNavigation } from "@react-navigation/native"
import i18n from "i18n-js"
import { has, isEmpty } from "lodash"
import moment from "moment"
import { Platform } from "react-native"
export const convertToAgendaItems = (data: CalendarDTO[]): CalendarAgenda => {
  const agendaItems: { title: string; data: CalendarDTO[]; marked?: boolean }[] = []
  const agendaObj: { [date: string]: { data: CalendarDTO[]; marked?: boolean } } = {}
  // data.forEach((item) => {
  //   const startDate = moment(item.start).format(DATE_FORMAT)
  //   if (agendaItems.some((agendaItem) => agendaItem.title === startDate)) {
  //     const duplicateIndex = agendaItems.findIndex((agendaItem) => agendaItem.title === startDate)
  //     agendaItems[duplicateIndex].data.push({ ...item })
  //     agendaItems[duplicateIndex].data.sort((a, b) => moment(a.start).diff(b.start))
  //   } else {
  //     agendaItems.push({ title: startDate, data: [item], marked: true })
  //   }
  // })
  data.forEach((item) => {
    const curFormattedStart = moment(item.start).format(DATE_FORMAT)
    if (has(agendaObj, curFormattedStart)) {
      agendaObj[curFormattedStart].data.push(item)
      agendaObj[curFormattedStart].data.sort((a, b) => moment(a.start).diff(b.start))
    } else {
      agendaObj[curFormattedStart] = {
        data: [item],
        marked: true,
      }
    }
  })
  // agendaItems.sort((a, b) => moment(a.title).diff(b.title))
  return agendaObj
}

export const convertAppointmentData = (data: AppointmentDTO): CalendarDTO => {
  const { date, service, staff, duration } = data
  const startTemp = moment(date).local()
  const min = startTemp.minutes()
  const item = {
    ...data,
    start: startTemp.format(EVENT_CALENDAR_FORMAT),
    end: startTemp.set({ m: min + duration }).format(EVENT_CALENDAR_FORMAT),
    title: service && service.name ? service.name : "",
    summary: staff && staff.name ? staff.name : "",
  }
  return item
}

export const convertCurrency = (value = 0, withoutSymbol = false) => {
  const { locale } = i18n
  const { currency } = useStores().currentStoreStore.CurrentStore
  if (withoutSymbol) {
    return value.toString()
  } else {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency: currency,
      currencyDisplay: Platform.OS === "ios" ? "narrowSymbol" : "symbol",
    }).format(value)
  }
}

export const totalServicesPrice = (services: ServiceDTO[]) => {
  return isEmpty(services)
    ? 0
    : services.reduce((prev, curr) => ({ ...curr, price: prev.price + curr.price })).price
}

export const totalAppointmentPrice = (services: ServiceDTO[], packages: PackageDTO[]) =>
  isEmpty(services) && isEmpty(packages)
    ? 0
    : [...services, ...packages].reduce((prev, curr) => ({
        ...curr,
        price: prev.price + curr.price,
      })).price

export const totalAppointmentTax = (services: ServiceDTO[] = [], packages: PackageDTO[] = []) => {
  return isEmpty(services) && isEmpty(packages)
    ? 0
    : [...services.map(({ tax, price }) => ((tax?.rate ?? 0) * price) / 100), 0].reduce(
        (prev, curr) => prev + curr,
      )
}

export const getFilteredCategoryList = (list: CategoryDTO[] = [], searchText = "") =>
  isEmpty(searchText)
    ? list
    : list
        .filter(
          (cat) =>
            cat.services.some((service) =>
              service.name.toLowerCase().includes(searchText.toLowerCase()),
            ) ||
            cat.packages.some((pack) => pack.name.toLowerCase().includes(searchText.toLowerCase())),
        )
        .map((fitleredCat) => ({
          ...fitleredCat,
          services: fitleredCat.services.filter((service) =>
            service.name.toLowerCase().includes(searchText.toLowerCase()),
          ),
          packages: fitleredCat.packages.filter((pack) =>
            pack.name.toLowerCase().includes(searchText.toLowerCase()),
          ),
        }))

export const getTabParams = (name: MAIN_SCREENS): any => {
  const state = useNavigation().getParent().getState()
  return state.routes.find((route) => route.name === name)?.params ?? {}
}
