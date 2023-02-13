import { color } from "@theme/color"
import { spacing } from "@theme/spacing"
import { StyleSheet } from "react-native"

export const styles = StyleSheet.create({
  categoryLabel: { fontSize: 24, fontWeight: "bold", lineHeight: 24 },
  deleteTxt: { fontSize: 15 },
  editTxt: { color: color.palette.lightGrey, fontSize: 15 },
})

export const nativeBaseStyle = {
  form: {
    inputLabel: {
      marginTop: spacing[1],
    },
  },
}
