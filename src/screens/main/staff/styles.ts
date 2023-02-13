import { SCREEN_HEIGHT } from "@config/constants"
import { color } from "@theme/color"
import { spacing } from "@theme/spacing"
import { StyleSheet } from "react-native"

const styles = StyleSheet.create({
  body: {
    flex: 1,
    padding: spacing[4],
  },
  btnBreaks: {
    paddingVertical: 10,
  },
  childBetViewTime: {
    flex: 0.1,
  },
  childViewTime: {
    flex: 1,
  },
  empty: {
    alignItems: "center",
    flex: 1,
    height: SCREEN_HEIGHT - 100,
    justifyContent: "center",
  },
  footer: {
    backgroundColor: color.palette.black,
    flex: 1,
  },

  itemBreaks: {
    borderBottomColor: color.palette.lightGrey,
    borderBottomWidth: 1,

    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 5,
  },
  itemSubBreaks: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  itemViewTime: {
    alignItems: "center",
    flexDirection: "row",
    paddingVertical: 10,
  },
  itemWorkingDays: {
    alignItems: "center",
    borderBottomColor: color.palette.lightGrey,
    borderBottomWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 5,
  },
  lbl: {
    color: color.palette.black,
    fontSize: 13,
    fontWeight: "500",
  },
  lblitemAllDays: {
    color: color.palette.black,
    fontSize: 15,
  },
  lblitemTimeWorkingDays: {
    color: color.palette.black,
    fontSize: 18,
  },
  lblitemWorkingDays: {
    color: color.palette.lightGrey,
  },
  note: { padding: 20 },
  txtDate: {
    color: color.palette.black,
    fontSize: 15,
    fontWeight: "bold",
  },
  viewCenterTimeOff: {
    alignItems: "center",
    flex: 0.5,
    justifyContent: "center",
  },
  viewContainTimeOff: {
    alignItems: "center",
    borderBottomColor: color.palette.lightGrey,
    borderBottomWidth: 1,
    flexDirection: "row",
    justifyContent: "center",

    paddingVertical: 5,
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
  viewLeftTimeOff: {
    alignItems: "center",
    flex: 2,
    justifyContent: "center",
  },
  viewLstCenterTimeOff: {
    alignItems: "center",

    flexDirection: "row",
    justifyContent: "center",
  },
  viewLstLeftTimeOff: {
    alignItems: "center",
    flex: 0.3,
    justifyContent: "center",
  },
  viewLstRightTimeOff: {
    alignItems: "center",
    flex: 0.3,
    justifyContent: "center",
  },
  viewParentCenterTimeOff: {
    alignItems: "center",
    flex: 2,

    justifyContent: "center",
  },
  viewRightTimeOff: {
    alignItems: "center",
    flex: 2,
    justifyContent: "center",
  },
  viewService: {
    paddingVertical: spacing[4],
  },
  viewTime: {
    alignItems: "center",
    flexDirection: "row",
    paddingVertical: spacing[4],
  },
  viewTimeOff: {
    alignItems: "center",
    borderBottomColor: color.palette.lightGrey,
    borderBottomWidth: 1,
    flexDirection: "row",
    justifyContent: "center",
    paddingHorizontal: 20,
    paddingVertical: 5,
  },
})

export default styles
