/* eslint-disable react/jsx-no-duplicate-props */
import * as React from "react"
import { TouchableOpacity, View } from "react-native"
import { CalendarList, DateData } from "react-native-calendars"
import moment from "moment"
import { FC, useRef, useState } from "react"

import VectorIcon from "@components/vectorIcon/vectorIcon"
import CustomModal, { IRefCustomModal } from "@components/modal/CustomModal"
import Text from "@components/text"

import styles from "./styles"
import { SCREEN_WIDTH } from "@config/constants"

interface ViewProps {
  dateChanged: (date: string) => void
  currentParentDate: any
}

const CalendarHeader: FC<ViewProps> = ({ dateChanged, currentParentDate }) => {
  const modalRef = useRef<IRefCustomModal>(null)

  const [currentDate, setCurrentDate] = useState(currentParentDate)

  const leftAction = () => {
    const prev = moment(currentDate.format("YYYY-MM-DD").toString()).add(-1, "days")
    dateChanged(prev.format("YYYY-MM-DD"))
    setCurrentDate(prev)
  }
  const rightAction = () => {
    const next = moment(currentDate.format("YYYY-MM-DD").toString()).add(-1, "days")
    dateChanged(next.format("YYYY-MM-DD"))
    setCurrentDate(next)
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
        const result = moment(date.timestamp)
        dateChanged(result.format("YYYY-MM-DD"))
        setCurrentDate(result)
      }
    } catch (error) {
      __DEV__ && console.log({ error })
    }
  }

  const renderCalendar = () => (
    <CalendarList
      style={styles.calendarList}
      // Enable horizontal scrolling, default = false
      horizontal={true}
      // Enable paging on horizontal, default = false
      pagingEnabled={true}
      // Set custom calendarWidth.
      calendarWidth={SCREEN_WIDTH}
      // date={"2017-09-07"}
      // initialDate={"2022-09-10"}
      current={currentDate.format("YYYY-MM-DD").toString()}
      markedDates={{
        [currentDate.format("YYYY-MM-DD").toString()]: {
          selected: true,
          marked: true,
          selectedColor: "green",
        },
      }}
      onDayPress={selectedDate}
    />
  )

  return (
    <View>
      <View style={styles.container}>
        <View style={styles.left}>
          <VectorIcon
            style={styles.icon}
            size={24}
            iconSet="ion"
            name="chatbox-ellipses-outline"
            onPress={leftAction}
          />
        </View>
        <View style={styles.body}>
          <TouchableOpacity onPress={leftAction}>
            <VectorIcon style={styles.icon} size={24} iconSet="ion" name="chevron-back-outline" />
          </TouchableOpacity>
          <TouchableOpacity onPress={openCalendar}>
            <Text style={styles.txtDate}>{currentDate.format("ddd D MMM, YYYY")}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={rightAction}>
            <VectorIcon
              id={"1"}
              style={styles.icon}
              size={24}
              iconSet="ion"
              name="chevron-forward-outline"
            />
          </TouchableOpacity>
        </View>
        <View style={styles.right}>
          <VectorIcon
            id={"2"}
            style={styles.icon}
            size={24}
            iconSet="ion"
            name="filter"
            onPress={rightAction}
          />
        </View>
      </View>
      <CustomModal ref={modalRef} childView={renderCalendar()} />
    </View>
  )
}

export default CalendarHeader
