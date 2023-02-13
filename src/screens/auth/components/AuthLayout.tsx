import { AppIcon } from "@assets/"
import { ScrollView, View } from "native-base"
import React from "react"
import { Keyboard, TouchableWithoutFeedback, useWindowDimensions } from "react-native"
import FastImage from "react-native-fast-image"
import { styles } from "./styles"

interface AuthLayoutProps {
  children: React.ReactNode
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  const { height, width } = useWindowDimensions()

  return (
    <View style={styles.container}>
      <View style={styles.appLogoContainer}>
        <FastImage source={AppIcon.imageSource} style={styles.appLogo} />
      </View>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          scrollEnabled={height < width}
          style={styles.mainContainer}
          contentContainerStyle={styles.mainContentContainer}
        >
          {children}
        </ScrollView>
      </TouchableWithoutFeedback>
    </View>
  )
}

export default AuthLayout
