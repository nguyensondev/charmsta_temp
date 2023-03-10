/* eslint-disable react/no-string-refs */
// @flow
import _ from "lodash"
import moment, { Moment } from "moment"
import React, { ReactNode } from "react"
import {
  Image,
  TouchableOpacity,
  View,
  ViewStyle,
  VirtualizedList,
  VirtualizedListProps,
  Text,
} from "react-native"

import styleConstructor from "./style"

import { CalendarDTO } from "@models/backend/response/Appointment"
import DayView from "./DayView"
import CalendarHeader from "@screens/main/calendar/CalendarHeader"

interface Props {
  calendarView: string
  initDate?: string
  size?: number
  onRef?: (EventCalendar: EventCalendar) => void
  width?: number
  format24h?: boolean
  scrollToFirst?: boolean
  start?: number
  end?: number
  formatHeader?: string
  uppercase?: boolean
  upperCaseHeader?: boolean
  headerIconLeft?: ReactNode
  headerIconRight?: ReactNode
  onTimelinePress?: (time: string) => void
  headerStyle?: ViewStyle
  renderEvent?: (event: any) => ReactNode
  eventTapped?: (event: CalendarDTO) => void
  dateChanged?: (date: string) => void
  virtualizedListProps?: VirtualizedListProps<any>
  events?: any[]
  openCalendar: () => void
}
interface State {
  date: Moment
  index: number
}

export default class EventCalendar extends React.Component<Props, State> {
  styles: any
  calendar: { scrollToIndex: ({ index, animated }: { index: number; animated: boolean }) => void }
  constructor(props) {
    super(props)

    const start = props.start ? props.start : 0
    const end = props.end ? props.end : 24

    this.styles = styleConstructor(props.styles, (end - start) * 100)
    this.state = {
      date: moment(this.props.initDate),
      index: 0,
    }
  }

  componentDidMount() {
    if (this.props.onRef) {
      this.props.onRef(this)
    }
  }

  componentWillUnmount() {
    if (this.props.onRef) {
      this.props.onRef(undefined)
    }
  }

  // static defaultProps = {
  //   calendarView: "DAY", // start from 0
  //   initDate: new Date(),
  //   formatHeader: "DD MMMM YYYY",
  // }

  _getItemLayout(data, index) {
    const { width } = this.props
    return { length: width, offset: width * index, index }
  }

  _getItem(events, index) {
    const amount =
      this.props.calendarView === "DAY" ? 1 : this.props.calendarView === "3_DAYS" ? 4 : 8
    const date = moment(this.props.initDate).add(index - amount, "days")

    const result = _.filter(events, (event) => {
      const eventStartTime = moment(event.start)
      return eventStartTime >= date.startOf("day") && eventStartTime <= date.endOf("day")
    })

    return result
  }

  _renderItem({ index, item }) {
    const {
      width,
      format24h,
      initDate,
      scrollToFirst = true,
      start = 0,
      end = 24,
      formatHeader,
      upperCaseHeader = false,
    } = this.props
    const amount =
      this.props.calendarView === "DAY" ? 1 : this.props.calendarView === "3_DAYS" ? 4 : 8
    const date = moment(initDate).add(index - amount, "days")

    const leftIcon = this.props.headerIconLeft ? (
      this.props.headerIconLeft
    ) : (
      <Image source={require("./back.png")} style={this.styles.arrow} />
    )
    const rightIcon = this.props.headerIconRight ? (
      this.props.headerIconRight
    ) : (
      <Image source={require("./forward.png")} style={this.styles.arrow} />
    )
    const headerText = upperCaseHeader
      ? date.format(formatHeader || "DD MMMM YYYY").toUpperCase()
      : date.format(formatHeader || "DD MMMM YYYY")
    return (
      <View style={[this.styles.container, { width }]}>
        {/* <View style={this.styles.header}> */}
        {/*   <TouchableOpacity style={this.styles.arrowButton} onPress={this._previous}> */}
        {/*     {leftIcon} */}
        {/*   </TouchableOpacity> */}
        {/*   <View style={this.styles.headerTextContainer}> */}
        {/*     <Text style={this.styles.headerText}>{headerText}</Text> */}
        {/*   </View> */}
        {/*   <TouchableOpacity style={this.styles.arrowButton} onPress={this._next}> */}
        {/*     {rightIcon} */}
        {/*   </TouchableOpacity> */}
        {/* </View> */}
        <CalendarHeader
          openCalendar={this.props.openCalendar}
          calendarView={this.props.calendarView}
          moment={date}
        />
        <DayView
          calendarView={this.props.calendarView}
          onTimelinePress={this.props.onTimelinePress}
          date={date}
          index={index}
          format24h={format24h}
          formatHeader={this.props.formatHeader}
          headerStyle={this.props.headerStyle}
          renderEvent={this.props.renderEvent}
          eventTapped={this.props.eventTapped}
          events={item}
          width={width}
          styles={this.styles}
          scrollToFirst={scrollToFirst}
          start={start}
          end={end}
        />
      </View>
    )
  }

  _goToPage(index) {
    if (index <= 0 || index >= this.props.size * 2) {
      return
    }
    const date = moment(this.props.initDate).add(index - this.props.size, "days")
    this.calendar.scrollToIndex({ index, animated: false })
    this.setState({ index, date })
  }

  _goToDate(date) {
    const earliestDate = moment(this.props.initDate).subtract(this.props.size, "days")
    const index = moment(date).diff(earliestDate, "days")
    this._goToPage(index)
  }

  _previous = () => {
    this._goToPage(this.state.index - 1)
    if (this.props.dateChanged) {
      this.props.dateChanged(
        moment(this.props.initDate)
          .add(this.state.index - 1 - this.props.size, "days")
          .format("YYYY-MM-DD"),
      )
    }
  }

  _next = () => {
    this._goToPage(this.state.index + 1)
    if (this.props.dateChanged) {
      this.props.dateChanged(
        moment(this.props.initDate)
          .add(this.state.index + 1 - this.props.size, "days")
          .format("YYYY-MM-DD"),
      )
    }
  }

  _goRight = ({ layoutMeasurement, contentOffset, contentSize }) => {
    return contentOffset.x > 0
    // return (
    //   layoutMeasurement.width + contentOffset.x >= contentSize.width - paddingToBottom
    // )
  }

  _goLeft = ({ layoutMeasurement, contentOffset, contentSize }) => {
    return contentOffset.x < 0
  }

  render() {
    const { width, virtualizedListProps, events } = this.props

    return (
      <View style={[this.styles.container, { width }]}>
        <VirtualizedList
          ref="calendar"
          windowSize={3}
          // initialNumToRender={0}
          initialScrollIndex={1}
          data={events}
          getItemCount={() => 3}
          getItem={this._getItem.bind(this)}
          keyExtractor={(item, index) => index.toString()}
          getItemLayout={this._getItemLayout.bind(this)}
          horizontal
          pagingEnabled
          renderItem={this._renderItem.bind(this)}
          style={{ width }}
          onScroll={({ nativeEvent }) => {
            // console.log("go to ===================")
          }}
          // onScrollToTop={(event) => {
          //   console.log("go to ===================")
          //   console.log(this.props.initDate)
          //   console.log(this.props.size)
          //   const index = parseInt((event.nativeEvent.contentOffset.x / width).toString())
          //   const date = moment(this.props.initDate).add(
          //     this.props.size,
          //     "days",
          //   )
          //   if (this.props.dateChanged) {
          //     this.props.dateChanged(date.format("YYYY-MM-DD"))
          //   }
          //   this.setState({ index, date })
          // }}

          {...virtualizedListProps}
        />
      </View>
    )
  }
}
