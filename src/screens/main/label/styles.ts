import { color } from "@theme/color"
import { Dimensions, StyleSheet } from "react-native"

const windowWidth = Dimensions.get("window").width
const textWidth = windowWidth / 2.5
const BackgoundColor = "#dfe3eb"
const Black = "#000000"
const White = "#ffffff"

const styles = StyleSheet.create({
  body: { flex: 1 },
  btnClose: { alignItems: "flex-end" },
  containerItem: {
    flex: 1,
  },
  contentSize: {
    fontSize: 16,
    fontWeight: "300",
  },
  empty: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
  },
  input: {
    backgroundColor: color.palette.white,
    color: color.palette.black,
    flex: 1,
    fontSize: 18,
    minHeight: 44,
  },
  item: {
    backgroundColor: BackgoundColor,
    borderRadius: 15,
    flexDirection: "row",
    marginHorizontal: 16,
    marginVertical: 8,
    padding: 20,
    shadowColor: Black,
    shadowOffset: {
      height: 1,
      width: 1,
    },
    shadowOpacity: 0.8,
    shadowRadius: 2,
  },
  serviceImage: {
    borderColor: White,
    borderRadius: 25,
    borderWidth: 1,
    height: 50,
    width: 50,
  },
  serviceName: {
    fontSize: 16,
    fontWeight: "600",
    maxWidth: textWidth,
  },
  servicePrice: {
    fontSize: 16,
    fontWeight: "400",
  },
  serviceTime: {
    fontSize: 14,
    fontWeight: "600",
  },
  subContainerItem: {
    flex: 4,
    justifyContent: "space-between",
  },
  title: {
    fontSize: 32,
  },
  viewCard: {
    borderBottomColor: color.palette.lighterGrey,
    borderBottomWidth: 0.5,
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  viewCenter: {
    flex: 3,
    paddingHorizontal: 10,
  },
  viewColor: {
    backgroundColor: color.palette.white,
    height: 30,
    width: 30,
  },
  viewLeft: {
    flex: 0.5,
  },
  viewNamePrice: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  viewPickerColor: {
    flex: 1,
    paddingHorizontal: 50,
    paddingVertical: 100,
  },
  viewRight: {
    alignItems: "flex-end",
    flex: 1,
  },
  viewServiceList: {
    flex: 1,
    paddingVertical: 15,
  },
})

export default styles
