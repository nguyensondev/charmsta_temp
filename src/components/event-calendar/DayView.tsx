/* eslint-disable react/no-deprecated */
// @flow
import { CalendarDTO } from "@models/backend/response/Appointment"
import _ from "lodash"
import moment, { Moment } from "moment"
import React, { ReactNode } from "react"
import {
  ImageStyle,
  Pressable,
  ScrollView,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native"
import populateEvents from "./Packer"

interface Props {
  date?: Moment
  index?: number
  formatHeader?: string
  headerStyle?: ViewStyle
  scrollToFirst?: boolean
  width?: number
  styles?: { [styleName: string]: ViewStyle | TextStyle | ImageStyle }
  start?: number
  end?: number
  format24h?: boolean
  onTimelinePress?: (time: string) => void
  eventTapped?: (event: CalendarDTO) => void
  events?: any[]
  renderEvent: (event: any) => ReactNode
  calendarView: string
}
interface State {
  _scrollY: number
  packedEvents?: any[]
}

const LEFT_MARGIN = 60 - 1
// const RIGHT_MARGIN = 10
// const CALENDER_HEIGHT = 2400
// const EVENT_TITLE_HEIGHT = 15
const TEXT_LINE_HEIGHT = 17
// const MIN_EVENT_TITLE_WIDTH = 20
// const EVENT_PADDING_LEFT = 4

function range(from: number, to: number) {
  return Array.from(Array(to), (_, i) => from + i)
}

export default class DayView extends React.PureComponent<Props, State> {
  calendarHeight: number
  _scrollView: any
  constructor(props) {
    super(props)
    this.calendarHeight = (props.end - props.start) * 100
    const width = props.width - LEFT_MARGIN
    const packedEvents = populateEvents(props.events, width, props.start)
    let initPosition =
      _.min(_.map(packedEvents, "top")) - this.calendarHeight / (props.end - props.start)
    initPosition = initPosition < 0 ? 0 : initPosition
    this.state = {
      _scrollY: initPosition,
      packedEvents,
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const width = nextProps.width - LEFT_MARGIN
    this.setState({
      packedEvents: populateEvents(nextProps.events, width, nextProps.start),
    })
  }

  componentDidMount() {
    this.props.scrollToFirst && this.scrollToFirst()
  }

  scrollToFirst() {
    setTimeout(() => {
      if (this.state && this.state._scrollY && this._scrollView) {
        this._scrollView.scrollTo({
          x: 0,
          y: this.state._scrollY,
          animated: true,
        })
      }
    }, 1)
  }

  _renderDays() {
    // const { rangeTime } = this.props
    return <View></View>
  }

  _renderRedLine() {
    const offset = 100
    // const { format24h } = this.props
    const { width, styles, calendarView } = this.props
    const timeNowHour = moment().hour()
    const timeNowMin = moment().minutes()
    let widthRedLine = 0
    if (calendarView !== "DAY") {
      widthRedLine = (width - 50) / (calendarView === "3_DAYS" ? 3 : 7)
    } else {
      widthRedLine = width
    }
    return (
      <View
        key={`timeNow`}
        style={[
          styles.lineNow,
          {
            top: offset * (timeNowHour - this.props.start) + (offset * timeNowMin) / 60,
            width: widthRedLine,
          },
        ]}
      >
        <Text style={[styles.timeLabel, styles.timeNow]}>
          {timeNowHour > 9 ? timeNowHour : `0${timeNowHour}`}:
          {timeNowMin > 9 ? timeNowMin : `0${timeNowMin}`}
        </Text>
      </View>
    )
  }

  _renderVerticalLine() {
    const { calendarView, styles, width } = this.props

    if (calendarView === "DAY") {
      const offsetXStart = 0
      const ratio = (width - offsetXStart) / 3

      return range(0, 2).map((i: number, index: number) => {
        return (
          <View
            key={`verticalLine${i}`}
            style={[
              styles.verticalLine,
              {
                height: this.calendarHeight,
                top: 55,
                left: offsetXStart + ratio * (index + 1) - 1,
              },
            ]}
          />
        )
      })
    } else {
      const offsetXStart = 50
      const ratio = (width - offsetXStart) / (calendarView === "3_DAYS" ? 3 : 7)
      return range(0, calendarView === "3_DAYS" ? 2 : 6).map((i: number, index: number) => {
        return (
          <View
            key={`verticalLine${i}`}
            style={[
              styles.verticalLine,
              { height: this.calendarHeight, top: 0, left: offsetXStart + ratio * (index + 1) - 1 },
            ]}
          />
        )
      })
    }
  }

  _renderLines() {
    const { format24h, start, end, onTimelinePress } = this.props
    const offset = this.calendarHeight / (end - start)
    return range(start, end + 1).map((i, index) => {
      let timeText
      if (i === start) {
        timeText = ``
      } else if (i < 12) {
        timeText = !format24h ? `${i} AM` : i < 10 ? "0" + i + ":00" : i + ":00"
      } else if (i === 12) {
        timeText = !format24h ? `${i} PM` : i + ":00"
      } else if (i === 24) {
        timeText = !format24h ? `12 AM` : ""
      } else {
        timeText = !format24h ? `${i - 12} PM` : i + ":00"
      }
      const { width, styles } = this.props

      return [
        <Pressable key={`hour${i}`} onPress={() => onTimelinePress(timeText)}>
          <Text
            key={`timeLabel${i}`}
            style={[styles.timeLabel, styles.hourCol, { top: offset * index - 6 }]}
          >
            {timeText}
          </Text>
        </Pressable>,
        i === 0 || i === 24 ? null : (
          <Pressable key={`line${i}`} onPress={() => onTimelinePress(timeText)}>
            <View
              style={[styles.line, { height: offset / 2, top: offset * index, width: width - 20 }]}
            />
          </Pressable>
        ),
        i === end ? null : (
          <Pressable
            key={`lineHalf${i}`}
            onPress={() => onTimelinePress(moment().hour(i).minute(30).format("HH:mm"))}
          >
            <View
              style={[
                styles.line,
                { height: offset / 2, top: offset * (index + 0.5), width: width - 20 },
              ]}
            />
          </Pressable>
        ),
      ]
    })
  }

  _renderTimeLabels() {
    const { styles, start, end } = this.props
    const offset = this.calendarHeight / (end - start)
    return range(start, end).map((item, i) => {
      return <View key={`line${i}`} style={[styles.line, { top: offset * i }]} />
    })
  }

  _onEventTapped(event: CalendarDTO) {
    this.props.eventTapped(event)
  }

  _renderEvents() {
    const { styles, width, calendarView } = this.props
    const { packedEvents } = this.state
    const ratio = width / (calendarView === "WEEK" ? 7 : 3)

    const events = packedEvents.map((event, i) => {
      const style = {
        left: 0 + (i > 0 ? (ratio - ratio / 2) / packedEvents.length : 0),
        height: event.height,
        width: ratio / 2,
        top: event.top,
        marginLeft: 0,
        padding: 0,
        position: "absolute",
        zIndex: i,
      }

      // Fixing the number of lines for the event title makes this calculation easier.
      // However it would make sense to overflow the title to a new line if needed
      const numberOfLines = Math.floor(event.height / TEXT_LINE_HEIGHT)
      const formatTime = this.props.format24h ? "HH:mm" : "hh:mm A"
      return (
        <TouchableOpacity
          activeOpacity={0.5}
          onPress={() => this._onEventTapped(this.props.events[event.index])}
          key={i}
          style={[styles.event, style]}
        >
          {this.props.renderEvent ? (
            this.props.renderEvent(event)
          ) : (
            <View>
              <Text numberOfLines={1} style={styles.eventTitle}>
                {event.title || "Event"}
              </Text>
              {numberOfLines > 1 ? (
                <Text numberOfLines={numberOfLines - 1} style={styles.eventSummary}>
                  {event.summary || " "}
                </Text>
              ) : null}
              {numberOfLines > 2 ? (
                <Text style={styles.eventTimes} numberOfLines={1}>
                  {moment(event.start).format(formatTime)} - {moment(event.end).format(formatTime)}
                </Text>
              ) : null}
            </View>
          )}
        </TouchableOpacity>
      )
    })

    return (
      <View>
        <View style={{ marginLeft: LEFT_MARGIN }}>{events}</View>
      </View>
    )
  }

  render() {
    const { styles } = this.props
    return [
      <ScrollView
        key="calendarScrollView"
        bounces={false}
        ref={(ref) => (this._scrollView = ref)}
        contentContainerStyle={[styles.contentStyle, { width: this.props.width }]}
      >
        {/* {this._renderDays()} */}
        {this._renderLines()}
        {this._renderEvents()}
        {this._renderRedLine()}
      </ScrollView>,
      this._renderVerticalLine(),
    ]
  }
}
