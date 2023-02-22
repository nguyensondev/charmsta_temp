import { ButtonCustom } from "@components/button/buttonCustom"
import { CustomCalendarList } from "@components/calendar/CustomCalendarList"
import { Header } from "@components/header/header"
import CustomModal, { IRefCustomModal } from "@components/modal/CustomModal"
import { Screen } from "@components/screen/screen"
import Text from "@components/text"
import { CALENDAR_FORMAT, DURATION, TIME_SLOTS_CONFIG } from "@config/constants"
import { useAppointment } from "@hooks/appointment/useAppointment"
import { useCustomer } from "@hooks/customer"
import { useService } from "@hooks/service/useService"
import { useStaff } from "@hooks/staff"
import { CreateAppointment } from "@models/backend/request/Appointment"
import { PackageDTO } from "@models/backend/response/Package"
import { ServiceDTO } from "@models/backend/response/Service"
import { StaffDTO } from "@models/backend/response/Staff"
import { AppointmentStatusEnum } from "@models/enum/appointment"
import { MAIN_SCREENS } from "@models/enum/screensName"
import { useStores } from "@models/index"
import { MainNavigatorParamList } from "@models/navigator"
import { goBack, navigationRef } from "@navigators/navigation-utilities"
import { RouteProp, useRoute } from "@react-navigation/native"
import { color } from "@theme/color"
import { spacing } from "@theme/spacing"
import { convertMinsValue } from "@utils/time"
import { get, isEmpty } from "lodash"
import moment from "moment"
import {
  Box,
  ChevronDownIcon,
  FormControl,
  Select,
  TextArea,
  useToast,
  WarningOutlineIcon
} from "native-base"

import React, { useCallback, useContext, useEffect, useLayoutEffect, useRef, useState } from "react"
import { ScrollView, TouchableOpacity, View } from "react-native"
import { CalendarContext, DateData } from "react-native-calendars"
import { ServicesAndPackages } from "./components"
import { nativeBaseStyle, styles } from "./styles"

const isInBreak = (slotTime: moment.Moment, breakTimes: string[][]) => {
  try {
    return breakTimes.some((br) => {
      return slotTime >= moment(br[0], "HH:mm") && slotTime < moment(br[1], "HH:mm")
    })
  } catch (error) {
    return false
  }
}

const NewAppointmentScreen = () => {
  const route = useRoute<RouteProp<MainNavigatorParamList, MAIN_SCREENS.newAppointment>>()
  const { appointmentDetail } = route.params
  const calendarCtx = useContext(CalendarContext)

  const [customer, setCustomer] = useState("")
  // const [service, setService] = useState("")
  const [services, setServices] = useState<ServiceDTO[]>([])
  const [packages, setPackages] = useState<PackageDTO[]>([])
  // const [staff, setStaff] = useState("")
  const [label, setLabel] = useState("")
  const [startTime, setStartTime] = useState(get(route.params, "start", ""))
  const [duration, setDuration] = useState("")
  const [notes, setNotes] = useState("")
  const [currentDate, setCurrentDate] = useState(moment(calendarCtx.date))
  const [timeSlot, setTimeSlot] = useState([])
  const modalRef = useRef<IRefCustomModal>(null)
  const toast = useToast()

  const {
    addNewAppointment,
    loadingNewAppointment,
    newAppointmnet,
    errNewAppoint,
    getListLabel,
    listLabel,
  } = useAppointment()
  const { getServiceList, serviceList } = useService()
  const { getStaffByServicesAndPackages, staffsByService } = useStaff()
  const { getCustomers, customers, skip } = useCustomer()
  const { currentStoreStore } = useStores()
  const { customServiceDuration } = currentStoreStore.CurrentStore.appointmentSetting
  const endTime = moment(TIME_SLOTS_CONFIG.endTime, "HH:mm")

  useLayoutEffect(() => {
    const { customerId, staffId, services, packages } = appointmentDetail

    const selectedStaff = staffsByService.find((staff) => staff.id === staffId) as StaffDTO
    setCustomer(customerId.toString())
    setServices(services.map((item) => ({ ...item, staffId, staff: selectedStaff })))
    setPackages(packages.map((item) => ({ ...item, staffId, staff: selectedStaff })))
    // setService(serviceId.toString())
  }, [staffsByService])

  useEffect(() => {
    getCustomers(skip, "")
    getServiceList("")
    getStaffByServicesAndPackages(appointmentDetail.packages, appointmentDetail.services)
    getListLabel()
  }, [])

  useEffect(() => {
    timeSelector()
  }, [currentDate])

  useEffect(() => {
    const { routes } = navigationRef.getRootState()
    const resetRoutes = routes
      .map((route) => ({ name: route.name }))
      .filter((route, index, array) => {
        const screenIndex = array.findIndex((item) => item.name === MAIN_SCREENS.home)
        return index <= screenIndex
      })
    if (newAppointmnet) {
      toast.show({
        render: () => {
          return (
            <Box bg="emerald.500" px="2" py="1" rounded="sm" mb={5}>
              Appointment Created!
            </Box>
          )
        },
      })
      navigationRef.reset({ index: 0, routes: resetRoutes })
    }
  }, [newAppointmnet])

  useEffect(() => {
    if (errNewAppoint && errNewAppoint.message) {
      toast.show({
        render: () => {
          return (
            <Box bg="emerald.500" px="2" py="1" rounded="sm" mb={5}>
              {errNewAppoint.message}
            </Box>
          )
        },
      })
    }
  }, [errNewAppoint])

  const checkCurrentDate = () => {
    try {
      if (currentDate.isSame(moment(), "days")) {
        return 0
      } else if (currentDate.isAfter(moment(), "days")) {
        return 1
      }
      return -1
    } catch (error) {
      __DEV__ && console.log({ error })
      return -1
    }
  }

  const validateData = () => {
    if (checkCurrentDate() > -1 && startTime.length > 0) {
      return true
    } else {
      return false
    }
  }

  const timeSelector = () => {
    try {
      const times = []
      let slotTime = moment()
      const checkDate = checkCurrentDate()
      if (checkDate === -1) {
        // pass date
        if (timeSlot.length > 0) {
          setTimeSlot([])
        }
        return
      } else if (checkDate === 0) {
        // current date
        const currentMin = moment().minutes()
        let minOffet = "00"
        let hourOffet = moment().hours()
        if (currentMin === 0 || currentMin < 15) {
          minOffet = "15"
        } else if (currentMin === 15 || currentMin < 30) {
          minOffet = "30"
        } else if (currentMin === 30 || currentMin < 45) {
          minOffet = "45"
        } else if (currentMin === 45 || currentMin < 60) {
          minOffet = "00"
          hourOffet = hourOffet + 1
        }

        slotTime = moment(hourOffet + ":" + minOffet, "HH:mm")
      } else if (checkCurrentDate() === 1) {
        // future date
        slotTime = moment(TIME_SLOTS_CONFIG.startTime, "HH:mm")
      }
      while (slotTime < endTime) {
        if (!isInBreak(slotTime, TIME_SLOTS_CONFIG.breakTime)) {
          times.push(slotTime.format("HH:mm"))
        }
        slotTime = slotTime.add(TIME_SLOTS_CONFIG.nextSlot, "minutes")
      }
      setTimeSlot(times)
    } catch (error) {
      __DEV__ && console.log({ error })
    }
  }

  const submit = () => {
    if (validateData()) {
      const data = {} as CreateAppointment
      let startHour = 0
      let startMin = 0
      if (notes.length > 0) {
        data.note = notes
      }
      if (customer.length > 0) {
        data.customerId = parseInt(customer.trim())
      }
      // if (service.length > 0) {
      //   data.serviceId = parseInt(service.trim())
      // }
      // if (staff.length > 0) {
      //   data.staffId = parseInt(staff.trim())
      // }
      if (label.length > 0) {
        data.labelId = parseInt(label.trim())
      }
      if (services.length > 0) {
        data.services = services.map(({ id, price, staffId, categoryId }) => ({
          id,
          price: parseFloat(price.toString()),
          staffId,
          categoryId,
        }))
      }
      if (packages.length > 0) {
        data.packages = packages.map(({ id, price, staffId }) => ({
          id,
          price: parseFloat(price.toString()),
          staffId,
        }))
      }
      if (startTime.length > 0) {
        const arr = startTime.split(":")
        startHour = parseInt(arr[0])
        startMin = parseInt(arr[1])
      }
      data.status = AppointmentStatusEnum.Booked
      const convertDateUTC = moment(currentDate.set({ h: startHour, m: startMin })).utc()

      data.date = convertDateUTC.toDate()
      if (duration.length > 0) {
        const convertLastDateUTC = moment(
          currentDate.set({ h: startHour, m: startMin + parseInt(duration.trim()) }),
        ).utc()
        data.lastDate = convertLastDateUTC.toDate()
        data.duration = parseInt(duration.trim())
      }

      addNewAppointment(data)
    }
  }

  const openCalendar = () => {
    if (modalRef && modalRef.current) {
      modalRef.current.openModal()
    }
  }

  // const selectService = (serviceId: string) => {
  //   setService(serviceId)
  //   getStaffByService(parseInt(serviceId))
  //   if (serviceId.length > 0) {
  //     const temp = serviceList.find((element) => element.id === parseInt(serviceId.trim()))
  //     if (temp && temp.serviceDuration) {
  //       const durationTemp = DURATION.find((element) => element.value === temp.serviceDuration)
  //       if (durationTemp && durationTemp.value) {
  //         setDuration(durationTemp.value.toString())
  //       }
  //     }
  //   }
  // }

  const selectedDate = (date: DateData) => {
    try {
      if (modalRef && modalRef.current) {
        modalRef.current.closeModal()
      }
      if (date && date.timestamp) {
        setDuration("")
        setStartTime("")
        setCurrentDate(moment(date.timestamp))
      }
    } catch (error) {
      __DEV__ && console.log({ error })
    }
  }

  const RenderHeader = useCallback(
    () => <Header headerTx="appointment.newAppointment" leftIcon="back" onLeftPress={goBack} />,
    [],
  )

  useEffect(() => {
    const allDurations = [
      ...services.map((item) => item.serviceDuration),
      ...packages.map((item) => item.duration),
    ]
    if (!isEmpty(allDurations)) {
      setDuration(allDurations.reduce((prev, curr) => prev + curr).toString())
    }
  }, [customServiceDuration, serviceList])

  const RenderBody = useCallback(
    () => {
      return (
        <ScrollView style={styles.body}>
          {/* date */}
          <TouchableOpacity onPress={openCalendar}>
            <View style={styles.viewDate}>
              <Text style={styles.txtDate}>{currentDate.format(CALENDAR_FORMAT)}</Text>
              <Box>
                <ChevronDownIcon size="5" />
              </Box>
            </View>
          </TouchableOpacity>
          {/* customer */}
          <FormControl style={styles.viewCustomer} isRequired isInvalid={false}>
            <Text tx="appointment.customer" style={styles.lbl} />
            <Select
              {...nativeBaseStyle.selectWrapper}
              selectedValue={customer}
              py={spacing[1]}
              accessibilityLabel="Add a Customer"
              placeholder="Add a Customer"
              mt={1}
              onValueChange={(itemValue) => setCustomer(itemValue)}
            >
              {customers && customers.length > 0
                ? customers.map((element) => {
                    return (
                      <Select.Item
                        key={element.id}
                        label={`${element?.firstName || ""} ${element?.lastName || ""}`}
                        value={element.id.toString()}
                      />
                    )
                  })
                : null}
            </Select>
            <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
              Please make a selection!
            </FormControl.ErrorMessage>
          </FormControl>
          {/* start time */}
          <FormControl isRequired isInvalid={startTime.length === 0}>
            <Text tx="appointment.startTime" style={styles.lbl} pt={spacing[1]} />
            <Select
              {...nativeBaseStyle.selectWrapper}
              selectedValue={startTime}
              py={spacing[1]}
              accessibilityLabel=""
              placeholder=""
              mt={1}
              onValueChange={setStartTime}
            >
              {timeSlot && timeSlot.length > 0
                ? timeSlot.map((element) => {
                    return <Select.Item key={element} label={element} value={element} />
                  })
                : null}
            </Select>
            <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
              Please make a selection!
            </FormControl.ErrorMessage>
          </FormControl>
          {/* label */}
          <FormControl isRequired isInvalid={false}>
            <Text tx="appointment.label" style={styles.lbl} pt={spacing[1]} />
            <Select
              {...nativeBaseStyle.selectWrapper}
              selectedValue={label}
              py={spacing[1]}
              accessibilityLabel=""
              placeholder=""
              mt={1}
              onValueChange={(itemValue) => setLabel(itemValue)}
            >
              {listLabel && listLabel.length > 0
                ? listLabel.map((element) => {
                    return (
                      <Select.Item
                        key={element.id}
                        label={element.name}
                        value={element.id.toString()}
                      />
                    )
                  })
                : null}
            </Select>
            <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
              Please make a selection!
            </FormControl.ErrorMessage>
          </FormControl>
          {/* services and pacakges area */}
          <ServicesAndPackages services={services} packages={packages} />

          {/* duration */}
          <FormControl isRequired isInvalid={duration.length === 0}>
            <Text tx="appointment.duration" style={styles.lbl} />
            <Select
              selectedValue={duration}
              {...nativeBaseStyle.selectWrapper}
              isDisabled={!customServiceDuration}
              py={spacing[1]}
              accessibilityLabel=""
              placeholder=""
              mt={1}
            >
              {[
                ...DURATION,
                {
                  label: convertMinsValue(parseInt(duration), "duration"),
                  value: parseInt(duration),
                },
              ].map((element) => {
                return (
                  <Select.Item
                    key={element.value}
                    label={element.label}
                    value={element.value.toString()}
                  />
                )
              })}
            </Select>
            <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
              Please make a selection!
            </FormControl.ErrorMessage>
          </FormControl>

          {/* notes */}
          <Text tx="appointment.notes" style={styles.lbl} pt={spacing[1]} />
          <TextArea
            // value={notes}
            onChangeText={(text) => setNotes(text)}
            h={20}
            placeholder="Notes visible to staff only"
            w="100%"
            autoCompleteType={"off"}
          />
          {/* calendar picker modal */}
          <CustomModal
            ref={modalRef}
            childView={
              <CustomCalendarList
                minDate={moment().toString()}
                currentDate={currentDate}
                selectedDate={selectedDate}
              />
            }
          />
        </ScrollView>
      )
    },
    // service
    [
      serviceList,
      staffsByService,
      customers,
      customer,
      startTime,
      currentDate,
      label,
      duration,
      customServiceDuration,
      services,
      packages,
    ],
  )

  const RenderFooter = () => {
    return (
      <ButtonCustom
        disabled={loadingNewAppointment || startTime.length === 0}
        isLoading={loadingNewAppointment}
        w="90%"
        // h={SELECT_HEIGHT}
        marginY={spacing[1]}
        onPress={submit}
      >
        <Text tx="common.save" style={{ color: color.palette.white }} />
      </ButtonCustom>
    )
  }

  return (
    <Screen>
      <RenderHeader />
      <RenderBody />
      <RenderFooter />
    </Screen>
  )
}

export default NewAppointmentScreen
