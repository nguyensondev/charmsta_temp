import { ImageStyle, StyleSheet, TextStyle, ViewStyle } from "react-native"

export default function styleConstructor(theme: Partial<any> = {}) {
  const styles: { [name: string]: ViewStyle | ImageStyle | TextStyle } = {
    expandableCalendar: {
      backgroundColor: "#fff",
      marginTop: -20,
      zIndex: -1,
    },
  }

  return StyleSheet.create(styles)
}
