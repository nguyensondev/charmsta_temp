import { Dimensions } from "react-native"

const { width, height } = Dimensions.get("window")

export const DATE_FORMAT = "YYYY-MM-DD"
export const CALENDAR_FORMAT = "ddd D MMM, YYYY"
export const EVENT_CALENDAR_FORMAT = "YYYY-MM-DD HH:mm:ss"
export const STAFF_TIME_FORMAT = "MMM DD, YYYY"
export const TIME_12H_FORMAT = "HH:mm A"
export const TIME_24H_FORMAT = "HH:mm"
export const SELECT_HEIGHT = width * 0.13
export const WIDTH_WINDOW = width
export const HEIGHT_WINDOW = height

export const TIME_OFFSET = [15, 30, 45]
export const SCREEN_WIDTH = Dimensions.get("window").width
export const SCREEN_HEIGHT = Dimensions.get("window").height
export const TIME_SLOTS_CONFIG = {
  nextSlot: 15,
  breakTime: [["12:00", "13:00"]],
  startTime: "08:00",
  endTime: "20:00",
}

export const DURATION: { label: string; value: number }[] = [
  { label: "5min", value: 5 },
  { label: "10min", value: 10 },
  { label: "15min", value: 15 },
  { label: "20min", value: 20 },
  { label: "25min", value: 25 },
  { label: "30min", value: 30 },
  { label: "35min", value: 35 },
  { label: "40min", value: 40 },
  { label: "45min", value: 45 },
  { label: "50min", value: 50 },
  { label: "55min", value: 55 },
  { label: "1h", value: 60 },
  { label: "1h 5min", value: 65 },
  { label: "1h 10min", value: 70 },
  { label: "1h 15min", value: 75 },
  { label: "1h 20min", value: 80 },
  { label: "1h 25min", value: 85 },
  { label: "1h 30min", value: 90 },
  { label: "1h 35min", value: 95 },
  { label: "1h 40min", value: 100 },
  { label: "1h 45min", value: 105 },
  { label: "1h 50min", value: 110 },
  { label: "1h 55min", value: 115 },
  { label: "2h", value: 120 },
  { label: "2h 5min", value: 125 },
  { label: "2h 10min", value: 130 },
  { label: "2h 15min", value: 135 },
  { label: "2h 20min", value: 140 },
  { label: "2h 25min", value: 145 },
  { label: "2h 30min", value: 150 },
  { label: "2h 35min", value: 155 },
  { label: "2h 40min", value: 160 },
  { label: "2h 45min", value: 165 },
  { label: "2h 50min", value: 170 },
  { label: "2h 55min", value: 175 },
  { label: "3h", value: 180 },
]

export const REGEXP = {
  password: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,12}$/,
}
