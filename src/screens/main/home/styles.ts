import { SCREEN_WIDTH } from "@config/constants"
import { color } from "@theme/color"
import { spacing } from "@theme/spacing"
import { Platform, ImageStyle, StyleSheet, TextStyle, ViewStyle } from "react-native"

export default function styleConstructor(theme: Partial<any> = {}) {
  const styles: { [name: string]: ViewStyle | ImageStyle | TextStyle } = {
    body: {
      alignItems: "center",
      flex: 5,
      flexDirection: "row",
      justifyContent: "space-evenly",
    },
    calendarList: { overflow: "hidden", width: SCREEN_WIDTH },
    container: {
      backgroundColor: color.palette.blue,
      borderBottomWidth: 1,
      borderColor: "rgb(216,216,216)",
      flex: 0,
      flexDirection: "row",
      justifyContent: "center",
      paddingHorizontal: spacing[4],
      paddingTop: spacing[2],
      paddingVertical: Platform.OS === "ios" ? spacing[2] : spacing[4],
    },
    content: {
      backgroundColor: color.palette.blue,
      flex: 1,
    },
    icon: {
      // backgroundColor: color.palette.white
      backgroundColor: color.palette.blue,
    },
    iconHeaderStaff: {
      // backgroundColor: color.palette.white
      backgroundColor: color.palette.white,
    },
    left: {
      alignContent: "center",
      alignItems: "flex-start",
      flex: 0.5,
      justifyContent: "center",
      paddingBottom: 3,
    },
    right: {
      alignContent: "center",
      alignItems: "flex-end",
      flex: 0.5,
      justifyContent: "center",
      paddingBottom: 3,
    },
    txtDate: { color: color.palette.black, fontSize: 15, fontWeight: "800", marginRight: 10 },
    headerStaff: {
      backgroundColor: "#FFF",
      height: 62,
      width: "100%",
      alignContent: "center",
      alignItems: "center",
      flexDirection: "row",
      justifyContent: "center",
      borderColor: "rgb(216,216,216)",
      borderBottomWidth: 1,
    },
    listStaff: {
      alignContent: "center",
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "row",
      flex: 4,
    },
    staff: {
      alignContent: "center",
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "row",
      flex: 2,
    },
    leftArrowStaff: {
      backgroundColor: "#FFF",
      alignContent: "center",
      alignItems: "center",
      justifyContent: "center",
      flex: 1,
    },
    rightArrowStaff: {
      backgroundColor: "#FFF",
      alignContent: "center",
      alignItems: "center",
      justifyContent: "center",
      flex: 1,
    },
    middleStaff: {
      borderLeftWidth: 1,
      borderRightWidth: 1,
      borderColor: "rgb(216,216,216)",
    },
  }
  return StyleSheet.create(styles)
}
