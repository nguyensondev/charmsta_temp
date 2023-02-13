import { StyleSheet } from "react-native"
import { color } from "@theme/color"

export const styles = StyleSheet.create({
  modal: {
    flex: 1,
    justifyContent: "flex-end",
    margin: 0,
  },
  optionText: { color: color.palette.black, fontSize: 14 },
  pickerWidth: { width: "50%" },
})
