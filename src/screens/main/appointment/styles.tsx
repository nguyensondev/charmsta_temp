import { color } from "@theme/color"
import { spacing } from "@theme/spacing"
import { typography } from "@theme/typography"
import { CheckIcon, IFormControlProps, ISelectProps } from "native-base"
import React from "react"
import { Platform, StyleSheet } from "react-native"

export const styles = StyleSheet.create({
  body: {
    flex: 1,
    paddingHorizontal: spacing[4],
    // paddingTop: spacing[4],
  },
  childBetViewTime: {
    flex: 0.1,
  },
  childViewTime: {
    flex: 1,
  },
  footer: {
    backgroundColor: color.palette.black,
    flex: 1,
  },
  lbl: {
    color: color.palette.black,
    fontSize: 13,
    fontWeight: "500",
  },
  staffItemContainer: {
    justifyContent: "space-between",
    padding: spacing[3],
  },
  staffModalItem: {
    fontSize: 18,
  },
  txtDate: {
    color: color.palette.black,
    fontSize: 15,
    fontWeight: "bold",
  },
  viewCustomer: {
    paddingTop: spacing[4],
  },
  viewDate: {
    alignItems: "center",
    backgroundColor: color.palette.lighterGrey,
    borderColor: color.palette.lighterGrey,
    borderWidth: 0.5,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: spacing[2],
    paddingVertical: spacing[4],
  },
  viewLabel: {
    paddingBottom: spacing[4],
  },
  viewService: {
    paddingVertical: spacing[4],
  },
  viewStaff: {
    paddingBottom: spacing[4],
  },
  viewTime: {
    alignItems: "center",
    flexDirection: "row",
    paddingVertical: spacing[4],
  },
  addMore: {
    color: color.primary,
    fontFamily: typography.primary,
    fontSize: 16,
    paddingLeft: spacing[1],
  },
})

export const nativeBaseStyle = {
  serviceArea: {
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderColor: color.palette.lighterGrey,
    py: spacing[1] / 2,
  },
  formController: {
    mt: spacing[1] / 2,
  } as IFormControlProps,
  selectWrapper: {
    _actionSheet: {
      useRNModal: Platform.OS === "ios",
    },
    _selectedItem: {
      bg: "teal.600",
      endIcon: <CheckIcon size="5" />,
    },
  } as ISelectProps,
}
