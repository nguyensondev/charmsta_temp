import { SCREEN_WIDTH } from "@config/constants"
import { color } from "@theme/color"
import { StyleSheet } from "react-native"

const textWidth = SCREEN_WIDTH / 2.5
const BackgoundColor = "#dfe3eb"
const BackgoundColorAll = "#fff000"

const styles = StyleSheet.create({
  body: { flex: 1 },
  containerItem: {
    flex: 1,
  },
  item: {
    backgroundColor: BackgoundColor,
    borderRadius: 15,
    flexDirection: "row",
    marginHorizontal: 16,
    marginVertical: 8,
    padding: 20,
    shadowColor: color.palette.black,
    shadowOffset: {
      height: 1,
      width: 1,
    },
    shadowOpacity: 0.8,
    shadowRadius: 2,
  },
  itemSelectAll: {
    backgroundColor: BackgoundColorAll,
    borderRadius: 15,
    flexDirection: "row",
    marginHorizontal: 16,
    marginVertical: 8,
    padding: 20,
    shadowColor: color.palette.black,
    shadowOffset: {
      height: 1,
      width: 1,
    },
    shadowOpacity: 0.8,
    shadowRadius: 2,
  },
  serviceImage: {
    borderColor: color.palette.white,
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
  viewNamePrice: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  viewServiceList: {
    flex: 1,
    paddingVertical: 15,
  },
})

export default styles
