import Text from "@components/text/text"
import { StaffByServiceDTO } from "@models/backend/response/Staff"
import { useStores } from "@models/index"
import { color } from "@theme/color"
import { spacing } from "@theme/spacing"
import { get } from "lodash"
import moment from "moment"
import { Box, FlatList } from "native-base"
import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from "react"
import { Alert, TouchableOpacity } from "react-native"
import { CalendarContext, ExpandableCalendar } from "react-native-calendars"
import { AdditionSelectContext } from "."
import { styles } from "./styles"

export interface ITimeSlotItem {
  value: number
  label: string
  hour: number
  min: number
}

const getTimeSlots = (per: number): ITimeSlotItem[] =>
  Array.from(Array(24 * Math.round(60 / per)).keys()).map((timeSlot) => {
    const time = timeSlot * per
    const hour = Math.floor(time / 60)
    const min = time % 60
    return {
      value: time,
      label: `${hour < 10 ? `0${hour}` : hour}:${min < 10 ? `0${min}` : min}`,
      hour,
      min,
    }
  })
interface AddTimeSlotProps {}

const AddTimeSlot = (props: AddTimeSlotProps) => {
  const rnCalendarCtx = useContext(CalendarContext)
  const { saveAdditionSelect, additionSelect, prevSelected } = useContext(AdditionSelectContext)
  const { date } = rnCalendarCtx
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(get(prevSelected, "startTime", ""))
  const { workingHours = [], breakTimes = [] } = get(
    additionSelect,
    "staff",
    {},
  ) as Partial<StaffByServiceDTO>

  const timeSlotListRef = useRef(null)
  const { currentStoreStore } = useStores()

  const weekStartDay = get(currentStoreStore.CurrentStore.appointmentSetting, "weekStartDay", 1)
  const { openHours, appointmentSetting, bookingSlotSize } = currentStoreStore?.CurrentStore
  const { offHoursBooking } = appointmentSetting
  const currentDay = moment(date).day()
  const { open, ...storeOpenHours } = openHours.find(({ day }) => day === currentDay)
  const staffBreakTime = breakTimes.find(({ day }) => day === currentDay)
  const staffWorkingHours = workingHours.find(({ day }) => day === currentDay)

  const timeSlots = useMemo(() => getTimeSlots(bookingSlotSize), [bookingSlotSize])

  const currentDayStatus = {
    storeOpenHours: {
      startIndex: timeSlots.findIndex((slot) => slot.label === storeOpenHours?.fromHour),
      endIndex: timeSlots.findIndex((slot) => slot.label === storeOpenHours?.toHour),
    },
    staffBreakTime: {
      startIndex: timeSlots.findIndex((slot) => slot.label === staffBreakTime?.fromHour),
      endIndex: timeSlots.findIndex((slot) => slot.label === staffBreakTime?.toHour),
    },
    staffWorkingHours: {
      startIndex: timeSlots.findIndex((slot) => slot.label === staffWorkingHours?.fromHour),
      endIndex: timeSlots.findIndex((slot) => slot.label === staffWorkingHours?.toHour),
    },
  }

  useEffect(() => {
    if (
      formattedTimeSlots.find(({ label, isAvailable }) => label === selectedTimeSlot && isAvailable)
    ) {
      saveAdditionSelect({ startTime: selectedTimeSlot })
    } else {
      Alert.alert("Warning", "This time slot is not available, please try another")
      saveAdditionSelect({ startTime: null })
    }
  }, [selectedTimeSlot])

  const _renderItem = useCallback(
    ({ item }: { item: ITimeSlotItem & { isAvailable: boolean } }) => {
      const onItemPress = () => {
        setSelectedTimeSlot(item.label)
      }

      return (
        <TouchableOpacity
          disabled={!item.isAvailable}
          onPress={onItemPress}
          style={styles.timeSlotTouchArea}
        >
          <Box
            alignItems="center"
            py={spacing[1]}
            borderWidth={0.5}
            borderColor={color.palette.lightGrey}
            backgroundColor={item.label === selectedTimeSlot ? color.primary : color.palette.white}
          >
            <Text
              text={item.label}
              style={{
                color: item.isAvailable
                  ? item.label === selectedTimeSlot
                    ? color.palette.white
                    : color.palette.black
                  : color.palette.lighterGrey,
              }}
            />
          </Box>
        </TouchableOpacity>
      )
    },
    [selectedTimeSlot],
  )

  const formattedTimeSlots = useMemo(() => {
    const { storeOpenHours, staffBreakTime, staffWorkingHours } = currentDayStatus

    return timeSlots.map((timeSlot, index) => ({
      ...timeSlot,
      isAvailable:
        // base on store open hours
        storeOpenHours.startIndex <= index &&
        index <= storeOpenHours.endIndex &&
        // base on store allowing booking in off hours
        (offHoursBooking ||
          // base on staff break time
          staffBreakTime.startIndex > index ||
          index > staffBreakTime.endIndex) &&
        // base on staff working hours
        staffWorkingHours.startIndex <= index &&
        index <= staffWorkingHours.endIndex &&
        // base on store is open
        open &&
        // base on current day activity hours
        workingHours.find((workingHour) => workingHour.day === currentDay)?.open &&
        moment(date)
          .set({
            hours: timeSlot.hour,
            minutes: timeSlot.min,
          })
          .isSameOrAfter(moment()),
    }))
  }, [
    offHoursBooking,
    date,
    bookingSlotSize,
    selectedTimeSlot,
    currentDay,
    workingHours.findIndex(({ day }) => day === currentDay),
    currentDayStatus.staffBreakTime,
    currentDayStatus.staffWorkingHours,
    currentDayStatus.storeOpenHours,
  ])

  return (
    <>
      <ExpandableCalendar
        customHeaderTitle={
          <Box height={9} backgroundColor={"transparent"}>
            <Text></Text>
          </Box>
        }
        style={styles.expandableCalendar}
        firstDay={weekStartDay}
        hideArrows
        allowShadow={false}
      />
      <FlatList
        ref={timeSlotListRef}
        numColumns={4}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.timeSlotContentContainer}
        data={formattedTimeSlots}
        renderItem={_renderItem}
        keyExtractor={(item) => item.label}
      />
    </>
  )
}

export default AddTimeSlot
