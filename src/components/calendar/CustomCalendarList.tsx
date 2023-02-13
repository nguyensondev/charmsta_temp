import { DATE_FORMAT, WIDTH_WINDOW } from "@config/constants"
import * as React from "react"
import { CalendarList, DateData } from "react-native-calendars"

import { useStores } from "@models/index"
import { get } from "lodash"
import moment from "moment"
import { FC } from "react"
import styles from "./styles"

interface IViewPros {
  currentDate: moment.Moment
  selectedDate: (date: DateData) => void
  minDate?: string
}

export const CustomCalendarList: FC<IViewPros> = ({ currentDate, selectedDate, minDate }) => {
  const { currentStoreStore } = useStores()
  const firstDay = get(currentStoreStore.CurrentStore.appointmentSetting, "weekStartDay", 1)
  return (
    <CalendarList
      style={styles.calendarList}
      firstDay={firstDay}
      // Enable horizontal scrolling, default = false
      horizontal={true}
      // Enable paging on horizontal, default = false
      pagingEnabled={true}
      // Set custom calendarWidth.
      calendarWidth={WIDTH_WINDOW}
      minDate={minDate}
      current={currentDate.format(DATE_FORMAT).toString()}
      markedDates={{
        [currentDate.format(DATE_FORMAT).toString()]: {
          selected: true,
          marked: true,
          selectedColor: "green",
        },
      }}
      onDayPress={selectedDate}
    />
  )
}
