import { color } from "@theme/color"
import { StyleSheet } from "react-native"

const AVATAR_SIZE = 90

export const styles = StyleSheet.create({
  avatar: {
    alignItems: "center",
    alignSelf: "center",
    borderColor: color.palette.lighterGrey,
    borderRadius: AVATAR_SIZE / 2,
    borderWidth: 1,
    height: AVATAR_SIZE,
    justifyContent: "center",
    // padding: 3,
    width: AVATAR_SIZE,
  },
  avatarImage: { borderRadius: 100, height: "100%", width: "100%" },
  avatarTouchArea: {
    alignSelf: "center",
    // borderRadius: AVATAR_SIZE / 2,
  },
})
