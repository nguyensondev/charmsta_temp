/* eslint-disable react/jsx-no-duplicate-props */
import auth from "@react-native-firebase/auth"
import { useFocusEffect } from "@react-navigation/native"
import moment from "moment"
import { Avatar, Fab } from "native-base"
import React, { useCallback, useContext, useLayoutEffect, useRef, useState } from "react"
import { Alert, ScrollView, Text, View } from "react-native"
import { CalendarContext, DateData } from "react-native-calendars"

import { CustomCalendarList } from "@components/calendar/CustomCalendarList"
import EventCalendar from "@components/event-calendar/EventCalendar"
import CustomModal, { IRefCustomModal } from "@components/modal/CustomModal"
import { Screen } from "@components/screen/screen"
import VectorIcon from "@components/vectorIcon/vectorIcon"
import { DATE_FORMAT, SCREEN_WIDTH } from "@config/constants"

import AgendaCalendar from "@components/agenda-calendar"
import CalendarView from "@components/modal/CalendarView"
import CalendarZoom from "@components/modal/CalendarZoom"
import OptionsPicker from "@components/modal/OptionsPicker"
import { GET_APPOINTMENTS_QUERY } from "@graphql/appointment"
import useGraphql from "@hooks/graphql"
import { useStaff } from "@hooks/staff"
import { CalendarDTO } from "@models/backend/response/Appointment"
import { StaffDTO } from "@models/backend/response/Staff"
import { MAIN_SCREENS } from "@models/enum/screensName"
import { useStores } from "@models/index"
import { MainNavigatorParamList } from "@models/navigator"
import { navigate } from "@navigators/navigation-utilities"
import { color } from "@theme/color"
import { getTabParams } from "@utils/data"
import { consoleLog } from "@utils/debug"
import { isEmpty } from "lodash"
import { UpdateSources } from "react-native-calendars/src/expandableCalendar/commons"
import { SceneMapNameEnum } from "../selection"
import RenderEvent from "./components/RenderEvent"
import styleConstructor from "./styles"

const HomeScreen = () => {
  const styles = styleConstructor()

  const params = getTabParams(MAIN_SCREENS.home) as Partial<{
    filter: { staffIds: number[] }
  }>

  const { filter } = params
  const modalRef = useRef<IRefCustomModal>(null)
  const contentCalendarRef = useRef(null)
  const firstTimeStaffRef = React.useRef(true)
  const calendarViewRef = useRef<IRefCustomModal>(null)
  const calendarZoomRef = useRef<IRefCustomModal>(null)
  const optionsPickerRef = useRef<IRefCustomModal>(null)
  const rnCalendarCtx = useContext(CalendarContext)
  const { setDate, date } = rnCalendarCtx
  const { authStore, currentStoreStore, userStore } = useStores()
  const [currentDate, setCurrentDate] = useState(moment(date))
  const [fromDate, setFromDate] = useState(moment(date).startOf("d"))
  const [toDate, setToDate] = useState(moment(date).endOf("d"))
  const [calendarType, setCalendarType] = useState({ current: "timeline", next: "agenda" })
  const [calendarView, setCalendarView] = useState("DAY")
  const { getStaffForCalendar, staffs } = useStaff()
  // const [staffData, setStaffData] = useState<StaffDTO[]>([])
  const [currentPage, setCurrentPage] = useState(0)
  // const [size, setSize] = useState(3)
  useFocusEffect(
    useCallback(() => {
      getStaffForCalendar(0, 3)
      setCurrentPage(currentPage)
    }, []),
  )
  //
  // useEffect(() => {
  //
  // }, [staffs])

  const { listAppointmentAgenda, listAppointmnetTemp, startPolling, stopPolling } =
    useGraphql(GET_APPOINTMENTS_QUERY)
  useLayoutEffect(() => {
    setCurrentDate(moment(date))
  }, [date])

  useFocusEffect(
    useCallback(() => {
      startPolling(5000)
      // getListAppointment()
      return () => {
        // stop graphql polling when scene is unfocus
        stopPolling()
      }
    }, []),
  )

  const _eventTapped = (event: CalendarDTO) => {
    navigate(MAIN_SCREENS.appointmentDetail, { detail: event })
  }

  const _dateChanged = (date: string) => {
    setCurrentDate(moment(date))
    setFromDate(moment(date).startOf("d"))
    setToDate(moment(date).endOf("d"))
    setDate(moment(date).format(DATE_FORMAT), UpdateSources.CALENDAR_INIT)
  }
  const toDayAction = () => {
    const current = moment()
    setCurrentDate(current)
    setFromDate(moment(date).startOf("d"))
    setToDate(moment(date).endOf("d"))
    setDate(current.format(DATE_FORMAT), UpdateSources.CALENDAR_INIT)
  }
  const leftAction = () => {
    const amount = calendarView === "DAY" ? 1 : calendarView === "3_DAYS" ? 3 : 7
    const prev = moment(currentDate.format(DATE_FORMAT).toString()).add(-amount, "days")
    setCurrentDate(prev)
    setFromDate(moment(prev).startOf("d"))
    setToDate(moment(prev).add(-amount, "days").endOf("d"))
    setDate(prev.format(DATE_FORMAT), UpdateSources.CALENDAR_INIT)
  }
  const rightAction = () => {
    const amount = calendarView === "DAY" ? 1 : calendarView === "3_DAYS" ? 3 : 7
    const next = moment(currentDate.format(DATE_FORMAT).toString()).add(amount, "days")
    setCurrentDate(next)
    setFromDate(moment(next).startOf("d"))
    setToDate(moment(next).add(amount, "days").endOf("d"))
    setDate(next.format(DATE_FORMAT), UpdateSources.CALENDAR_INIT)
  }

  const openCalendar = () => {
    if (modalRef && modalRef.current) {
      modalRef.current.openModal()
    }
  }

  const selectedDate = (date: DateData) => {
    try {
      if (modalRef && modalRef.current) {
        modalRef.current.closeModal()
      }
      if (date && date.timestamp) {
        setCurrentDate(moment(date.timestamp))
      }
    } catch (error) {
      __DEV__ && console.log({ error })
    }
  }

  const logOut = () => {
    try {
      Alert.alert("Alert!", "Are you sure you want to log out?", [
        {
          text: "No",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        {
          text: "Yes",
          onPress: () => {
            authStore.resetAuth()
            currentStoreStore.clearCurrentStore()
            userStore.eraseUser()
            auth().signOut()
          },
        },
      ])
    } catch (error) {
      __DEV__ && console.log(error)
    }
  }

  const onZoomSelect = (value: number) => {
    if (calendarZoomRef?.current) {
      // Do something here
      consoleLog("Zooming calendar value: ", value)
      calendarZoomRef.current?.closeModal()
    }
  }

  const onViewSelect = (value: string) => {
    if (calendarViewRef?.current) {
      setCalendarView(value)
      calendarViewRef.current?.closeModal()
    }
  }

  const onTimelinePress = (time: string) => {
    navigate(MAIN_SCREENS.additionSelect, {
      actionName: SceneMapNameEnum.newAppointment,
      prevSelected: {
        startTime: time,
      },
    } as MainNavigatorParamList[MAIN_SCREENS.additionSelect])
  }

  const goRight = ({ layoutMeasurement, contentOffset, contentSize }) => {
    return contentOffset.x > 0
    // return (
    //   layoutMeasurement.width + contentOffset.x >= contentSize.width - paddingToBottom
    // )
  }

  const goLeft = ({ layoutMeasurement, contentOffset, contentSize }) => {
    return contentOffset.x < 0
  }

  const loadStaff = async (page: number, size: number) => {
    await getStaffForCalendar(page, size)
    setCurrentPage(page)
    firstTimeStaffRef.current = true
  }

  const _renderStaffs = () => {
    return (
      // <View style={{ flexDirection: "row" }}>
      //   {staffs.map((value: StaffDTO, index: number) => {
      //     return <Text key={value.id}>{value.name}</Text>
      //   })}
      // </View>
      <View style={styles.headerStaff}>
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: "center",
            width: "100%",
          }}
          horizontal={true}
          scrollEventThrottle={10000}
          onScroll={({ nativeEvent }) => {
            if (goRight(nativeEvent) && firstTimeStaffRef.current) {
              firstTimeStaffRef.current = false
              loadStaff(currentPage + 1, 3)
            }
            if (goLeft(nativeEvent) && firstTimeStaffRef.current) {
              firstTimeStaffRef.current = false
              loadStaff(currentPage > 0 ? currentPage - 1 : 0, 3)
            }
          }}
        >
          {/* <View style={styles.headerStaff}> */}
          {/* <TouchableOpacity onPress={leftAction} style={styles.leftArrowStaff}> */}
          {/*   <VectorIcon style={styles.iconHeaderStaff} size={24} iconSet="ion" name="chevron-back-outline" /> */}
          {/* </TouchableOpacity> */}
          <View style={styles.listStaff}>
            {staffs.map((value: StaffDTO, index: number) => {
              if (!filter?.staffIds.includes(value.id) && !isEmpty(filter?.staffIds)) return null
              return (
                <View style={[styles.staff, index === 1 ? styles.middleStaff : {}]} key={value.id}>
                  <Avatar source={{ uri: value.avatar }} size={12} style={{ marginRight: 6 }} />
                  <Text key={value.id}>{value.name}</Text>
                </View>
              )
            })}
          </View>
          {/* <TouchableOpacity onPress={rightAction} style={styles.rightArrowStaff}> */}
          {/*   <VectorIcon */}
          {/*     id={"1"} */}
          {/*     style={styles.iconHeaderStaff} */}
          {/*     size={24} */}
          {/*     iconSet="ion" */}
          {/*     name="chevron-forward-outline" */}
          {/*   /> */}
          {/* </TouchableOpacity> */}
          {/*   </View> */}
        </ScrollView>
      </View>
    )
  }

  const _renderHeader = () => {
    // let stringDate = ""
    // if (fromDate.month() === toDate.month()) {
    //   stringDate = currentDate.format(MONTH_YEAH_FORMAT)
    // } else {
    //   stringDate = fromDate.format(MONTH_YEAH_FORMAT) + " - " + toDate.format(MONTH_YEAH_FORMAT)
    // }
    return (
      <>
        <View style={styles.container}>
          <View style={styles.left}>
            {/* <VectorIcon
              id={"2"}
              style={styles.icon}
              size={24}
              iconSet="ion"
              name="filter-outline"
              onPress={() =>
                navigate(MAIN_SCREENS.additionSelect, {
                  actionName: "filterAppointment",
                } as unknown as [MAIN_SCREENS.additionSelect])
              }
            /> */}
          </View>
          {/* <View style={styles.left}> */}
          {/*   <TouchableOpacity onPress={toDayAction}> */}
          {/*     <Text style={styles.txtDate}>Today</Text> */}
          {/*   </TouchableOpacity> */}
          {/* </View> */}
          <View style={styles.body}>
            {/*   <TouchableOpacity onPress={leftAction}> */}
            {/*     <VectorIcon style={styles.icon} size={24} iconSet="ion" name="chevron-back-outline" /> */}
            {/*   </TouchableOpacity> */}
            {/*   <TouchableOpacity onPress={openCalendar}> */}
            {/*     <Text style={styles.txtDate}>{stringDate}</Text> */}
            {/*   </TouchableOpacity> */}
            {/*   <TouchableOpacity onPress={rightAction}> */}
            {/*     <VectorIcon */}
            {/*       id={"1"} */}
            {/*       style={styles.icon} */}
            {/*       size={24} */}
            {/*       iconSet="ion" */}
            {/*       name="chevron-forward-outline" */}
            {/*     /> */}
            {/*   </TouchableOpacity> */}
          </View>
          <View style={styles.right}>
            <VectorIcon
              id={"2"}
              style={styles.icon}
              size={24}
              iconSet="ion"
              name="settings-outline"
              onPress={() => {
                if (optionsPickerRef.current) {
                  optionsPickerRef.current.openModal()
                }
              }}
            />
          </View>
        </View>
        <CustomModal
          ref={modalRef}
          childView={<CustomCalendarList currentDate={currentDate} selectedDate={selectedDate} />}
        />
      </>
    )
  }

  const RenderBody = useCallback(() => {
    switch (calendarType.current) {
      case "timeline":
        return (
          <EventCalendar
            calendarView={calendarView}
            ref={contentCalendarRef}
            // renderStaff={() => _renderStaffs()}
            renderEvent={(event) => <RenderEvent event={event} />}
            eventTapped={_eventTapped}
            dateChanged={_dateChanged}
            openCalendar={openCalendar}
            onTimelinePress={onTimelinePress}
            events={listAppointmnetTemp}
            width={SCREEN_WIDTH}
            initDate={currentDate.format(DATE_FORMAT).toString()}
            setCurrentDate={setCurrentDate}
            scrollToFirst
            upperCaseHeader
            uppercase
            format24h={true}
            size={calendarView === "DAY" ? 1 : calendarView === "3_DAYS" ? 3 : 7}
          />
        )
      case "agenda":
        return <AgendaCalendar onEventPress={_eventTapped} events={listAppointmentAgenda} />
      default:
        return null
    }
  }, [calendarType.current, listAppointmentAgenda, listAppointmnetTemp, currentDate, calendarView])

  const RenderNewApppointment = useCallback(() => {
    return (
      <Fab
        position={"absolute"}
        bottom={50}
        onPress={() =>
          navigate(MAIN_SCREENS.additionSelect, {
            actionName: "newAppointment",
          } as MainNavigatorParamList[MAIN_SCREENS.additionSelect])
        }
        _pressed={{ opacity: 0.2 }}
        h={16}
        w={16}
        label={"+"}
        size="lg"
        rounded={"full"}
        backgroundColor={color.palette.orange}
        renderInPortal={false}
        onLongPress={logOut}
      />
    )
  }, [])

  const settingOptions = React.useMemo(
    () => [
      // {
      //   label: "Calendar Zoom",
      //   function: () => {
      //     optionsPickerRef.current?.closeModal()
      //     setTimeout(() => calendarZoomRef.current?.openModal(), 400)
      //   },
      // },
      {
        label: "Calendar View",
        function: () => {
          optionsPickerRef.current?.closeModal()
          setTimeout(() => calendarViewRef.current?.openModal(), 400)
        },
      },
      {
        label: `Display as ${calendarType.next}`,
        function: () => {
          switch (calendarType.current) {
            case "agenda":
              setCalendarType({ current: "timeline", next: "agenda" })
              break
            case "timeline":
              setCalendarType({ current: "agenda", next: "timeline" })
              break
            default:
              break
          }
          return optionsPickerRef.current.closeModal()
        },
      },
    ],
    [calendarType.current, calendarType.next],
  )

  // const _filterOptionsModal = () => {
  //   return (
  //     <CustomModal
  //       ref={filterOptionsRef}
  //       childView={
  //         <Screen>
  //           <Header
  //             headerTx={`screens.headerTitle.selectCustomer` as TxKeyPath}
  //             leftIcon="back"
  //             // onRightPress={_onRightPress}
  //           />
  //           <Text>ABX</Text>
  //         </Screen>
  //       }
  //     />
  //   )
  // }

  return (
    <Screen style={styles.content}>
      {_renderHeader()}
      {/* {calendarView === "DAY" ? _renderStaffs() : null} */}
      <RenderBody />
      <RenderNewApppointment />

      <CustomModal
        ref={calendarZoomRef}
        childView={
          <CalendarZoom
            onConfirmPress={onZoomSelect}
            sliderProps={{
              minimumValue: 1,
              maximumValue: 4,
              step: 1,
            }}
          />
        }
      />
      <CustomModal
        ref={calendarViewRef}
        childView={<CalendarView onConfirmPress={onViewSelect} calendarView={calendarView} />}
      />
      <CustomModal
        ref={optionsPickerRef}
        childView={
          <OptionsPicker
            options={settingOptions}
            onClose={() => {
              if (optionsPickerRef.current) {
                optionsPickerRef.current.closeModal()
              }
            }}
          />
        }
      />
    </Screen>
  )
}

export default HomeScreen
