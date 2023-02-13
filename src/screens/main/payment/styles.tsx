import { color } from "@theme/color"
import { spacing } from "@theme/spacing"
import { StyleSheet } from "react-native"

export const styles = StyleSheet.create({
  paymentOption: {
    backgroundColor: color.palette.lighterGrey,
    padding: spacing[2],
    alignItems: "center",
    borderWidth: 1,
    borderColor: color.palette.lightGrey,
    borderRadius: 5,
  },
})
