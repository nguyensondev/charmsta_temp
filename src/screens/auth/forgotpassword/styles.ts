import { color } from "@theme/color"
import { Dimensions, StyleSheet } from "react-native"

const { width } = Dimensions.get("window")

export const styles = StyleSheet.create({
  appLogo: { height: width / 2, width: width / 2 },
  appLogoContainer: { alignItems: "center", flex: 1, justifyContent: "center" },
  container: {
    backgroundColor: color.primary,
    flex: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    lineHeight: 32,
  },
  icon: { backgroundColor: color.palette.black, borderRadius: 24, padding: 8 },
  mainContainer: {
    backgroundColor: color.palette.white,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    flex: 2,
    padding: 36,
  },
  socialBtnContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 32,
    width: width / 2.5,
  },
})
