import React, { FC } from "react"
import { ActivityIndicator, ColorValue, StyleProp, TextStyle, View, ViewStyle } from "react-native"

import Text from "@components/text/index"
import { TxKeyPath } from "@i18n/i18n"

import styles from "./styles"

interface ViewProps {
  showContent?: boolean
  content?: TxKeyPath
  color?: ColorValue
  style?: StyleProp<ViewStyle>
  textStyle?: StyleProp<TextStyle>
  isAbsolute?: boolean
}

const Loading: FC<ViewProps> = ({
  showContent = false,
  content,
  color = "white",
  style,
  textStyle,
  isAbsolute = false,
}) => {
  return (
    <View style={[styles.container, isAbsolute && styles.absoluteContent, style]}>
      <View style={styles.content}>
        <ActivityIndicator color={color} size={"small"} />
        {showContent && <Text tx={content} style={[styles.txt, textStyle]} />}
      </View>
    </View>
  )
}

export default Loading
