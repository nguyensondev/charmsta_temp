import { color } from "@theme/color"
import { StyleSheet } from "react-native"

const styles = StyleSheet.create({
  container: {},
  contentSize: {
    fontSize: 16,
    fontWeight: "300",
  },
  contentSubSize: {
    color: color.alpha.black50,
    fontSize: 16,
    fontWeight: "300",
  },
  empty: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
  },
  headerLine: {
    backgroundColor: color.palette.lightGrey,
    justifyContent: "center",
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  headerSize: {
    fontSize: 17,
    fontWeight: "bold",
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
  },
  viewLeft: {
    flex: 0.5,
  },
  viewRight: {
    alignItems: "flex-end",
    flex: 1,
  },
  viewSubRight: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
  },
})

export default styles
