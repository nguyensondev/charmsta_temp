import { color } from "@theme/color"
import { Platform, StyleSheet } from "react-native"

const COLOR = "#d9dbda"

const styles = StyleSheet.create({
  cancelButton: { alignItems: "center", flex: 1 },
  cancelText: { color: color.primary, fontSize: 18 },
  container: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "flex-start",
    marginHorizontal: 15,

    // width: "93%",
  },
  entypo: {
    padding: 1,
  },
  feather: {
    marginLeft: 1,
  },
  input: {
    fontSize: 14,
    marginLeft: 10,
    width: "90%",
  },
  searchBar__clicked: {
    alignItems: "center",
    backgroundColor: COLOR,
    borderRadius: 15,
    flexDirection: "row",
    justifyContent: "space-evenly",
    paddingHorizontal: Platform.OS === "ios" ? 10 : 10,
    paddingVertical: Platform.OS === "ios" ? 10 : 0,
    width: "80%",
  },
  searchBar__unclicked: {
    alignItems: "center",
    backgroundColor: COLOR,
    borderRadius: 15,
    flexDirection: "row",
    paddingHorizontal: Platform.OS === "ios" ? 10 : 10,
    paddingVertical: Platform.OS === "ios" ? 10 : 0,
    width: "100%",
  },
})

export default styles
