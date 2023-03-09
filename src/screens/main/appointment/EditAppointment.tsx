import { ButtonCustom } from "@components/button/buttonCustom"
import { CustomCalendarList } from "@components/calendar/CustomCalendarList"
import { Header } from "@components/header/header"
import { Screen } from "@components/index"
import CustomModal, { IRefCustomModal } from "@components/modal/CustomModal"
import Text from "@components/text"
import { CALENDAR_FORMAT, DURATION, TIME_SLOTS_CONFIG } from "@config/constants"
import { useAppointment } from "@hooks/appointment/useAppointment"
import { useCustomer } from "@hooks/customer"
import { useStaff } from "@hooks/staff"
import { TxKeyPath } from "@i18n/i18n"
import { translate } from "@i18n/translate"
import { AppointmentDTO, CalendarDTO } from "@models/backend/response/Appointment"
import { StaffDTO } from "@models/backend/response/Staff"
import { AppointmentStatusEnum } from "@models/enum/appointment"
import { MAIN_SCREENS } from "@models/enum/screensName"
import { useStores } from "@models/index"
import { MainNavigatorParamList } from "@models/navigator"
import { goBack, navigationRef } from "@navigators/navigation-utilities"
import {
  RouteProp,
  StackActions,
  useIsFocused,
  useNavigation,
  useRoute
} from "@react-navigation/native"
import { color } from "@theme/color"
import { spacing } from "@theme/spacing"
import { convertMinsValue } from "@utils/time"
import { isEmpty } from "lodash"
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
import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react"
import { Alert, ScrollView, TouchableOpacity, View } from "react-native"
import { DateData } from "react-native-calendars"
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

const EditAppointmentScreen = () => {
  const route = useRoute<RouteProp<MainNavigatorParamList, MAIN_SCREENS.editAppointment>>()
  const { detail: appointmentDetail, start: appointmentStartTime } = route.params
  const [appointment, setAppointment] = useState<Partial<CalendarDTO>>(appointmentDetail)
  const navigation = useNavigation()
  const [startTime, setStartTime] = useState(appointmentStartTime)
  const [timeSlot, setTimeSlot] = useState([])

  const modalRef = useRef<IRefCustomModal>(null)
  const toast = useToast()

  const { customerId, labelId, start, duration, note, status, packages, services } = appointment

  const {
    editAppointment,
    loadingEditAppointment,
    editedAppointment,
    errEditAppoint,
    getListLabel,
    listLabel,
  } = useAppointment()
  const isFocused = useIsFocused()
  const { getStaffByServicesAndPackages, staffsByService } = useStaff()
  const { getCustomers, customers, skip } = useCustomer()
  const { currentStoreStore } = useStores()
  const {
    appointmentSetting: { customServiceDuration },
    openHours,
    bookingSlotSize,
  } = currentStoreStore.CurrentStore
  const endTime = moment(TIME_SLOTS_CONFIG.endTime, "HH:mm")
  useLayoutEffect(() => {
    if (!isFocused) {
      navigationRef.setParams({ start: startTime, detail: appointment } as never)
    }
  }, [isFocused])

  useEffect(() => {
    setAppointment(appointmentDetail)
  }, [appointmentDetail])

  useEffect(() => {
    getCustomers(skip, "")
    getStaffByServicesAndPackages(packages, services)
    getListLabel()
  }, [])

  useEffect(() => {
    if (isEmpty(listLabel) && isEmpty(staffsByService) && isEmpty(customers)) {
      const { label, staff, customer } = appointmentDetail
      listLabel.push(label)
      staffsByService.push(staff)
      customers.push(customer)
    }
  }, [listLabel, staffsByService, customers])

  useEffect(() => {
    timeSelector()
  }, [start])

  useEffect(() => {
    if (editedAppointment) {
      Alert.alert("Success", "Appointment edited!", [
        {
          text: "Ok",
          onPress: () =>
            navigation.dispatch(
              StackActions.replace(MAIN_SCREENS.appointmentDetail, {
                detail: { ...appointmentDetail, ...editedAppointment },
              } as MainNavigatorParamList[MAIN_SCREENS.appointmentDetail]),
            ),
        },
      ])
    }
  }, [editedAppointment])

  useEffect(() => {
    if (errEditAppoint && errEditAppoint.message) {
      toast.show({
        render: () => {
          return (
            <Box bg="emerald.500" px="2" py="1" rounded="sm" mb={5}>
              {errEditAppoint.message}
            </Box>
          )
        },
      })
    }
  }, [errEditAppoint])

  const checkCurrentDate = () => {
    try {
      const currentDate = moment(start)
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
    if (
      // checkCurrentDate() > -1 &&
      // service.length > 0 &&
      services.every((i) => i?.staffId) &&
      packages.every((i) => i?.staffId) &&
      startTime.length > 0 &&
      duration > 0
    ) {
      return true
    } else {
      let alertStrs = []
      if (!packages.every((i) => i?.staffId)) {
        alertStrs.push("Please pick a staff for your package")
      }
      if (!services.every((i) => i?.staffId)) {
        alertStrs.push("Please pick a staff for your service")
      }
      alert(alertStrs.join(", "))
      return false
    }
  }

  const timeSelector = () => {
    try {
      const times = []
      let slotTime = moment()
      const currentDay = moment(start).day()
      const checkDate = checkCurrentDate()
      if (checkDate === 0) {
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
      } else if (checkDate === 1) {
        // future date

        slotTime = moment(
          openHours.find((item) => item.day === currentDay),
          "HH:mm",
        )
      }
      while (slotTime < endTime) {
        if (!isInBreak(slotTime, TIME_SLOTS_CONFIG.breakTime)) {
          times.push(slotTime.format("HH:mm"))
        }
        slotTime = slotTime.add(bookingSlotSize, "minutes")
      }
      setTimeSlot(times)
    } catch (error) {
      __DEV__ && console.log({ error })
    }
  }

  const submit = () => {
    if (validateData()) {
      const data = {} as AppointmentDTO
      let startHour = 0
      let startMin = 0
      if (!isEmpty(note)) {
        data.note = note
      }
      if (customerId > 0) {
        data.customerId = customerId
      }

      if (labelId > 0) {
        data.labelId = labelId
      }
      if (!isEmpty(startTime)) {
        const arr = startTime.split(":")
        startHour = parseInt(arr[0])
        startMin = parseInt(arr[1])
      }
      if (!isEmpty(packages)) {
        data.packages = packages
      }
      if (!isEmpty(services)) {
        data.services = services
      }
      if (!isEmpty(status)) {
        data.status = status as AppointmentStatusEnum
      }

      const convertDateUTC = moment(moment(start).set({ h: startHour, m: startMin })).utc()

      data.date = convertDateUTC.toDate()
      if (duration > 0) {
        const convertLastDateUTC = moment(
          moment(start).set({ h: startHour, m: startMin + duration }),
        ).utc()
        data.lastDate = convertLastDateUTC.toDate()
        data.duration = duration
      }

      editAppointment(appointmentDetail.id, data)
    }
  }
  const openCalendar = () => {
    if (modalRef && modalRef.current) {
      modalRef.current.openModal()
    }
  }

  const handleAppointmentChange = (key: keyof CalendarDTO, value: any) => {
    switch (key) {
      default:
        setAppointment((prev) => ({
          ...prev,
          [key]: value,
        }))
    }
  }

  const onStaffPress = (staff?: StaffDTO, belongToId?: number, type?: "services" | "packages") => {
    switch (type) {
      case "packages":
        setAppointment((prev) => {
          const currentPackages = prev.packages
          const packageIndex = currentPackages.findIndex(({ id }) => id === belongToId)

          // handleAppointmentChange("packages", packages)
          return {
            ...prev,
            packages: currentPackages.map((item, index) =>
              index === packageIndex ? { ...item, staff: staff, staffId: staff.id } : item,
            ),
          }
        })
        break
      case "services":
        setAppointment((prev) => {
          const currentServices = prev.services
          const serviceIndex = currentServices.findIndex(({ id }) => id === belongToId)

          // handleAppointmentChange("services", services)
          return {
            ...prev,
            services: currentServices.map((item, index) =>
              index === serviceIndex ? { ...item, staff: staff, staffId: staff.id } : item,
            ),
          }
        })
        break
      default:
        break
    }
  }

  const selectedDate = (date: DateData) => {
    try {
      if (modalRef && modalRef.current) {
        modalRef.current.closeModal()
      }
      if (date && date.timestamp) {
        setAppointment((prev) => {
          const editedAppointment = {
            ...prev,
            // duration: 0,
            start: moment(date.timestamp).toISOString(),
          }
          navigation.setParams({ detail: editedAppointment } as never)

          return editedAppointment
        })
        setStartTime("")
        // setDuration("")
        // setStartTime("")
        // setCurrentDate(moment(date.timestamp))
      }
    } catch (error) {
      __DEV__ && console.log({ error })
    }
  }

  const RenderHeader = useCallback(
    () => <Header headerTx={"appointment.editAppointment"} leftIcon="back" onLeftPress={goBack} />,
    [],
  )

  const RenderBody = useCallback(() => {
    return (
      <ScrollView style={styles.body}>
        {/* date */}
        <TouchableOpacity onPress={openCalendar}>
          <View style={styles.viewDate}>
            <Text style={styles.txtDate}>{moment(start).format(CALENDAR_FORMAT)}</Text>
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
            selectedValue={customerId.toString()}
            py={spacing[1]}
            accessibilityLabel="Add a Customer"
            placeholder="Add a Customer"
            mt={1}
            onValueChange={(itemValue) =>
              handleAppointmentChange("customerId", parseInt(itemValue))
            }
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
          <Text tx="appointment.startTime" style={styles.lbl} />
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
        <FormControl style={styles.viewLabel} isRequired isInvalid={false}>
          <Text tx="appointment.label" style={styles.lbl} />
          <Select
            {...nativeBaseStyle.selectWrapper}
            selectedValue={labelId?.toString()}
            py={spacing[1]}
            accessibilityLabel=""
            placeholder=""
            mt={1}
            onValueChange={(itemValue) => handleAppointmentChange("labelId", parseInt(itemValue))}
          >
            {listLabel && listLabel.length > 0
              ? listLabel.map((element, index) => {
                  return (
                    <Select.Item
                      key={`${element?.id}-${index}`}
                      label={element?.name}
                      value={element?.id.toString()}
                    />
                  )
                })
              : null}
          </Select>
          <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
            Please make a selection!
          </FormControl.ErrorMessage>
        </FormControl>

        {/* services and Packages */}
        <ServicesAndPackages
          isAddNew
          services={services}
          packages={packages}
          onStaffPress={onStaffPress}
          staffList={staffsByService}
        />

        {/* staff */}

        {/* status */}
        <FormControl isRequired isInvalid={false}>
          <Text tx="appointment.status" style={styles.lbl} />
          <Select
            {...nativeBaseStyle.selectWrapper}
            selectedValue={status}
            py={spacing[1]}
            accessibilityLabel=""
            placeholder=""
            mt={1}
            onValueChange={(itemValue) => handleAppointmentChange("status", itemValue)}
          >
            {Object.values(AppointmentStatusEnum).map((element) =>
              element !== AppointmentStatusEnum.Canceled ? (
                <Select.Item
                  key={element}
                  label={translate(`appointment.currentStatus.${element}` as TxKeyPath)}
                  value={element}
                />
              ) : null,
            )}
          </Select>
          <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
            Please make a selection!
          </FormControl.ErrorMessage>
        </FormControl>
        {/* duration */}

        <FormControl isRequired isInvalid={duration === 0}>
          <Text tx="appointment.duration" style={styles.lbl} />
          <Select
            {...nativeBaseStyle.selectWrapper}
            isDisabled={!customServiceDuration}
            selectedValue={duration.toString()}
            py={spacing[1]}
            accessibilityLabel=""
            placeholder=""
            mt={1}
            onValueChange={(itemValue) => handleAppointmentChange("duration", parseInt(itemValue))}
          >
            {[
              ...DURATION,
              {
                label: convertMinsValue(duration, "duration"),
                value: duration,
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
        <Text tx="appointment.notes" style={styles.lbl} />
        <TextArea
          key="editinput"
          // value={notes}
          defaultValue={note}
          onChangeText={(text) => handleAppointmentChange("note", text)}
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
              currentDate={moment(start)}
              selectedDate={selectedDate}
            />
          }
        />
      </ScrollView>
    )
  }, [
    customerId,
    labelId,
    status,
    duration,
    staffsByService,
    packages,
    services,
    timeSlot,
    startTime,
    customerId,
    listLabel,
  ])

  const RenderFooter = () => {
    return (
      <ButtonCustom
        disabled={loadingEditAppointment || duration === 0 || startTime.length === 0}
        isLoading={loadingEditAppointment}
        w="90%"
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

export default EditAppointmentScreen
