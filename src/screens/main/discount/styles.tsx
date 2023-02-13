import { color } from "@theme/color"
import { spacing } from "@theme/spacing"
import { InterfaceHStackProps } from "native-base/lib/typescript/components/primitives/Stack/HStack"
import { StyleSheet } from "react-native"

export const styles = StyleSheet.create({})

export const nativeBaseStyles = {
  discountItemContainer: {
    borderWidth: 1,
    borderRadius: "2xl",
    p: spacing[1],
    mb: spacing[1],
    borderColor: color.palette.lightGrey,
    shadow: 1,
    backgroundColor: color.palette.white,
    justifyContent: "space-between",
  } as InterfaceHStackProps,
}
