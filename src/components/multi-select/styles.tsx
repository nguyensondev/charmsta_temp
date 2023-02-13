import { color } from "@theme/color"
import { spacing } from "@theme/spacing"
import { typography } from "@theme/typography"
import { StyleSheet } from "react-native"

export const styles = StyleSheet.create({
  addMore: {
    color: color.primary,
    fontFamily: typography.primary,
    fontSize: 16,
    paddingLeft: spacing[1],
  },
  label: { fontFamily: typography.primary, fontSize: 15 },
})
