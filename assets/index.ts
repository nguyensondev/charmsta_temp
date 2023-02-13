import { ImageSourcePropType } from "react-native"
import { Source } from "react-native-fast-image"

export interface ImageSource {
    imageSource: Source
}

// export const ImgSplash: ImageSource = {
//   imageSource: require("./onboarding-bg-6.png"),
// }

export const AppIcon: ImageSource = {
    imageSource: require("./images/app-icon.png"),
}