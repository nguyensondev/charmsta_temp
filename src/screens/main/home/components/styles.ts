import { SCREEN_WIDTH } from "@config/constants"
import { color } from "@theme/color"
import { spacing } from "@theme/spacing"
import { StyleSheet } from "react-native"

const styles = StyleSheet.create({
  body: {
    alignItems: "center",
    flex: 2,
    flexDirection: "row",
    justifyContent: "space-evenly",
  },
  calendarList: { overflow: "hidden", width: SCREEN_WIDTH },
  container: {
    flex: 0,
    flexDirection: "row",
    justifyContent: "center",
    paddingHorizontal: spacing[4],
    paddingTop: spacing[2],
  },
  icon: { backgroundColor: color.palette.white },
  left: { alignItems: "flex-start", flex: 0.7 },
  right: { alignItems: "flex-end", flex: 0.7 },
  txtDate: { color: color.palette.black },
})

export default styles
