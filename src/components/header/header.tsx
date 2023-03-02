import Text from "@components/text"
import VectorIcon from "@components/vectorIcon/vectorIcon"
import { goBack, navigationRef } from "@navigators/navigation-utilities"
import { useNavigation } from "@react-navigation/native"
import { isFunction } from "lodash"
import React from "react"
import { Platform, TextStyle, View, ViewStyle } from "react-native"
import { translate } from "../../i18n/"
import { spacing } from "../../theme"
import { Button } from "../button/button"
import { Icon } from "../icon/icon"
import { HeaderProps } from "./header.props"

// static styles
const ROOT: ViewStyle = {
  flexDirection: "row",
  paddingHorizontal: spacing[4],
  paddingBottom: spacing[4],
  alignItems: "center",
  justifyContent: "flex-start",
  paddingVertical: Platform.OS === "ios" ? spacing[2] : spacing[4],
}
const TITLE: TextStyle = { textAlign: "center", fontSize: 18, fontWeight: "bold" }
const TITLE_MIDDLE: ViewStyle = { flex: 1, justifyContent: "center" }
const LEFT: ViewStyle = { width: 32 }
const RIGHT: ViewStyle = { width: 32 }

/**
 * Header that appears on many screens. Will hold navigation buttons and screen title.
 */
export function Header(props: HeaderProps) {
  const {
    onLeftPress,
    onRightPress,
    rightIcon,
    leftIcon,
    headerText,
    headerTx,
    style,
    titleStyle,
    rightVectorIcon,
    leftVectorIcon,
  } = props

  const { canGoBack } = useNavigation()

  const header =
    headerTx && headerTx.length > 0
      ? translate(headerTx)
      : (headerText && headerText.length) > 0
      ? headerText
      : headerText

  const goBackAction = () => {
    if (navigationRef.canGoBack()) {
      if (isFunction(onLeftPress)) onLeftPress()
      else goBack()
    }
  }
  return (
    <View style={[ROOT, style]}>
      {/* left side */}
      {leftIcon && canGoBack() ? (
        <Button
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          style={LEFT}
          preset="link"
          onPress={leftIcon === "back" ? goBackAction : onLeftPress}
        >
          <Icon icon={leftIcon} />
        </Button>
      ) : leftVectorIcon ? (
        <VectorIcon size={24} {...leftVectorIcon} onPress={onLeftPress} />
      ) : (
        <View style={LEFT} />
      )}
      {/* middle */}
      <View style={TITLE_MIDDLE}>
        <Text style={[TITLE, titleStyle]} text={header} />
      </View>
      {/* right side */}
      {rightIcon ? (
        <Button
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          style={RIGHT}
          preset="link"
          onPress={onRightPress}
        >
          <Icon icon={rightIcon} />
        </Button>
      ) : rightVectorIcon ? (
        <VectorIcon size={24} {...rightVectorIcon} onPress={onRightPress} />
      ) : (
        <View style={RIGHT} />
      )}
    </View>
  )
}
