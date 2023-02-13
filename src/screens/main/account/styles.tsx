import { color } from "@theme/color"
import { spacing } from "@theme/spacing"
import { IButtonProps } from "native-base"
import { StyleSheet } from "react-native"

export const styles = StyleSheet.create({
  header: {
    alignItems: "center",
    // marginVertical: spacing[3],
  },
  name: {
    fontSize: 16,
    marginVertical: spacing[4],
  },
  optionContainer: {
    // width: WIDTH_WINDOW / 1.5,
    padding: spacing[4],
    alignSelf: "center",
  },
  optionsTitle: {
    fontSize: 18,
    flex: 4,
    marginLeft: spacing[2],
  },
  optionsIcon: { flex: 1, alignItems: "center" },
  buttonLabel: { fontSize: 15 },
  changePass: { color: color.palette.black, fontWeight: "bold" },
  deleteAcc: { color: color.error, fontWeight: "bold" },
})

export const nativeBaseStyles = {
  bottomBtns: {
    mb: spacing[1],
    background: "transparent",
  } as IButtonProps,
}
