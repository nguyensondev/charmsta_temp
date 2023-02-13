import { StyleSheet } from "react-native"

const BLACK50 = "#00000050"
const WHITE = "#ffffff"
export default StyleSheet.create({
  absoluteContent: {
    alignItems: "center",
    backgroundColor: BLACK50,
    bottom: 0,
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    left: 0,
    position: "absolute",
    right: 0,
    top: 0,
    zIndex: 999,
  },
  container: { flex: 1 },
  content: {
    alignItems: "center",
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
  },
  txt: {
    color: WHITE,
    fontSize: 12,
    fontWeight: "700",
    marginLeft: 10,
  },
})
