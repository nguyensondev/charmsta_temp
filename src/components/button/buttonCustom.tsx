import Text from "@components/text"
import { TxKeyPath } from "@i18n/i18n"
import { color } from "@theme/color"
import { Button as NativeButton } from "native-base"
import { IButtonProps } from "native-base/lib/typescript/components/primitives/Button/types"
import * as React from "react"
import { StyleProp, TextStyle } from "react-native"
import { ButtonPresetNames, textPresets } from "./button.presets"

interface IButtonCustom extends IButtonProps {
  tx?: TxKeyPath
  text?: string
  children?: React.ReactNode
  preset?: ButtonPresetNames
  textStyle?: StyleProp<TextStyle>
}
/**
 * For your text displaying needs.
 *
 * This component is a HOC over the built-in React Native one.
 */

export function ButtonCustom(props: IButtonCustom) {
  // grab the props
  const { preset, tx, text, children, textStyle: textStyleOverride, ...rest } = props

  const textStyle = textPresets[preset] || textPresets.primary
  const textStyles = [textStyle, textStyleOverride]

  const content = children || <Text tx={tx} text={text} style={textStyles} />

  return (
    <NativeButton
      rounded="full"
      width={"2/3"}
      alignSelf={"center"}
      backgroundColor={props.color ? props.color : color.palette.black}
      _pressed={{ opacity: 0.2 }}
      {...rest}
    >
      {content}
    </NativeButton>
  )
}
