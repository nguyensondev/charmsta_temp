import { color } from "@theme/color"
import { spacing } from "@theme/spacing"
import { typography } from "@theme/typography"
import { StyleSheet } from "react-native"

export const styles = StyleSheet.create({
  // the base styling for the container
  CONTAINER: {
    paddingVertical: spacing[2],
  },
  // the base styling for the Error
  ERROR: {
    color: color.error,
  },
  // the base styling for the TextInput
  INPUT: {
    backgroundColor: color.palette.white,
    color: color.palette.black,
    flex: 1,
    fontFamily: typography.primary,
    fontSize: 18,
    minHeight: 44,
  },
  colorFieldContainer: {
    borderBottomWidth: 1,
    borderColor: color.palette.lighterGrey,
    minHeight: 44,
    width: "100%",
  },
  errorMsg: {
    fontSize: 12,
    marginTop: 4,
  },
})
