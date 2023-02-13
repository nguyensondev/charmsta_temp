import { color } from "@theme/color"
import { spacing } from "@theme/spacing"
import { StyleSheet } from "react-native"

export const styles = StyleSheet.create({
  contactContainer: {
    alignItems: "center",
    borderColor: color.palette.lighterGrey,
    borderRadius: 10,
    borderWidth: 1,
    flexDirection: "row",
    height: 50,
    justifyContent: "space-between",
    marginBottom: spacing[2],
    marginHorizontal: spacing[3],
    padding: spacing[3],
  },
})
