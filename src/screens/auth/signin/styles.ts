import { color } from "@theme/color"
import { Dimensions, StyleSheet } from "react-native"

const { width } = Dimensions.get("window")

export const styles = StyleSheet.create({
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
    justifyContent: "space-around",
    marginBottom: 32,
    marginTop: "5%",
    width: width / 2.5,
  },
  termConditionPhrase: {
    textAlign: "center",
  },
  textUnderline: {
    textDecorationLine: "underline",
  },
})
