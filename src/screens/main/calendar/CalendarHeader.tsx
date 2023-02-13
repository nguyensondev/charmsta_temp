import * as React from "react"
import { Text, TouchableOpacity, View } from "react-native"
import styleConstructor from "@screens/main/calendar/styles"
import moment, { Moment } from "moment"
import VectorIcon from "@components/vectorIcon/vectorIcon"

const styles = styleConstructor()

export interface CalendarHeaderProps {
  calendarView: string
  moment: Moment
  openCalendar: () => void
}

const CalendarHeader = (props: CalendarHeaderProps) => {
  const _renderWeekHeaer = (calendarView: string, initMoment: Moment) => {
    let dates = []
    if (calendarView === "DAY") {
      dates = [moment(initMoment)]
    } else if (calendarView === "3_DAYS") {
      dates = [initMoment, moment(initMoment).add(1, "d"), moment(initMoment).add(2, "d")]
    } else {
      dates = [
        moment(initMoment),
        moment(initMoment).add(1, "d"),
        moment(initMoment).add(2, "d"),
        moment(initMoment).add(3, "d"),
        moment(initMoment).add(4, "d"),
        moment(initMoment).add(5, "d"),
        moment(initMoment).add(6, "d"),
      ]
    }
    return dates.map((date: Moment, index: number) => {
      return (
        <TouchableOpacity key={date.unix()} onPress={null} style={styles.dayOfWeek}>
          <Text style={date.date() === moment().date() ? styles.selectedDate : {}}>
            {moment(date).format("ddd")}
          </Text>
          <Text style={date.date() === moment().date() ? styles.selectedDate : {}}>
            {date.date()}
          </Text>
        </TouchableOpacity>
      )
    })
  }

  return (
    <View style={styles.header}>
      <View style={styles.timeZone}>
        <VectorIcon
          id={"2"}
          style={styles.icon}
          size={24}
          iconSet="ion"
          name="calendar-outline"
          onPress={props.openCalendar}
        />
      </View>
      {_renderWeekHeaer(props.calendarView, props.moment)}
    </View>
  )
}

export default CalendarHeader
