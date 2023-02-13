import { ImageStyle, StyleSheet, TextStyle, ViewStyle } from "react-native"

// const eventPaddingLeft = 4

export default function styleConstructor(theme: Partial<any> = {}, calendarHeight?: number) {
  const styles: { [name: string]: ViewStyle | ImageStyle | TextStyle } = {
    dayOfWeek: {
      alignItems: "center",
      height: 55,
      justifyContent: "center",
      flex: 1,
      flexDirection: "column",
    },
    multipleSelect: {
      margin: 10,
    },
    header: {
      borderColor: "rgb(216,216,216)",
      borderRightWidth: 1,
      borderBottomWidth: 1,
      // borderRightWidth: 0.3,
      borderStyle: "solid",
      flexDirection: "row",
    },
    selectedDate: {
      color: "#3498DB",
      fontSize: 18,
      fontWeight: "bold",
    },
    timeZone: {
      width: 50,
      justifyContent: "center",
      alignItems: "center",
    },
  }
  return StyleSheet.create(styles)
}
