import { AppIcon } from "@assets/"
import { Screen } from "@components/index"
import React, { useEffect, useState } from "react"
import {
  Keyboard,
  ScrollView,
  TouchableWithoutFeedback,
  useWindowDimensions,
  View
} from "react-native"
import FastImage from "react-native-fast-image"
import { styles } from "./styles"

interface AuthLayoutProps {
  children: React.ReactNode
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  const { height, width } = useWindowDimensions()
  const [keyboardHide, setKeyboardHide] = useState(true)

  useEffect(() => {
    const showLogo = Keyboard.addListener("keyboardDidShow", () => setKeyboardHide(false))
    const hideLogo = Keyboard.addListener("keyboardDidHide", () => setKeyboardHide(true))

    return () => {
      showLogo.remove()
      hideLogo.remove()
    }
  }, [])

  return (
    <Screen style={styles.container}>
      {keyboardHide ? (
        <View style={styles.appLogoContainer}>
          <FastImage source={AppIcon.imageSource} style={styles.appLogo} />
        </View>
      ) : null}
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          scrollEnabled={height < width}
          style={styles.mainContainer}
          contentContainerStyle={styles.mainContentContainer}
        >
          {children}
        </ScrollView>
      </TouchableWithoutFeedback>
    </Screen>
  )
}

export default AuthLayout
