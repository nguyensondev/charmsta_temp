import { color } from "@theme/color"
import { spacing } from "@theme/spacing"
import { ICheckboxGroupProps, ICheckboxProps } from "native-base"
import { StyleSheet } from "react-native"

export const styles = StyleSheet.create({
  categoryLabel: { fontSize: 24, fontWeight: "bold", lineHeight: 24 },
  expandableCalendar: { marginTop: -20, zIndex: -1 },
  searchBar: { paddingVertical: 0 },
  timeSlotContentContainer: { borderColor: color.palette.lightGrey, borderWidth: 0.5 },
  timeSlotTouchArea: { flex: 1 },
})

export const naviteBaseStyles = {
  checkboxGroup: {
    // backgroundColor: "blue.400",
  } as ICheckboxGroupProps,
  checkbox: {
    justifyContent: "space-between",
    flexDirection: "row-reverse",
    mt: spacing[1],
    borderRadius: "full",
    w: "full",
    _icon: {
      size: 6,
    },
    _checked: {
      backgroundColor: color.primary,
      borderColor: color.primary,
    },
  } as ICheckboxProps,
}
