import { Dimensions, StyleSheet } from "react-native"
const { height, width } = Dimensions.get("screen")

const white = "#fff"
const black = "#000"
const whiteAlpha = "#00000025"

const styles = StyleSheet.create({
  body: {
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 0,
    paddingVertical: 30,
    width,
  },
  btnArea: {
    bottom: 20,
    left: 20,
    right: 20,
    top: 20,
  },
  btnSkip: {
    alignItems: "center",
    backgroundColor: whiteAlpha,
    borderRadius: 25,
    height: 50,
    justifyContent: "center",
    position: "absolute",
    right: 20,
    top: 20,
    width: 50,
  },
  container: {
    alignItems: "center",
    backgroundColor: white,
    flex: 1,
    justifyContent: "center",
  },
  flatlistContent: { paddingBottom: 0 },
  img: {
    height: width / 3,
    resizeMode: "contain",
    width: width / 3,
  },
  indicator: {
    backgroundColor: white,
    borderRadius: 5,
    height: 10,
    margin: 10,
    width: 10,
  },
  indicatorView: { bottom: "5%", flexDirection: "row", position: "absolute" },
  lblDes: { color: black, fontWeight: "300", textAlign: "center", textAlignVertical: "center" },
  lblTitle: {
    color: black,
    fontSize: 24,
    fontWeight: "800",
    marginBottom: 10,
    textAlign: "center",
    textAlignVertical: "center",
  },
  square: {
    backgroundColor: white,
    borderRadius: 86,
    height,
    left: -height * 0.3,
    position: "absolute",
    top: -height * 0.6,
    width: height,
  },
  topView: { justifyContent: "center", marginBottom: 20 },
})

export default styles
