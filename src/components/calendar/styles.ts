import { Dimensions, StyleSheet } from "react-native"

const { width } = Dimensions.get("window")

const styles = StyleSheet.create({
  calendarList: { overflow: "hidden", width },
})

export default styles
