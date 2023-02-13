import { observer } from "mobx-react-lite"
import { Text as NativeText } from "native-base"
import * as React from "react"
import { FC } from "react"
import { translate } from "../../i18n"
import { presets } from "./text.presets"
import { TextProps } from "./text.props"

/**
 * For your text displaying needs.
 *
 * This component is a HOC over the built-in React Native one.
 */
const Text: FC<TextProps> = (props: TextProps) => {
  // grab the props
  const { preset = "default", tx, txOptions, text, children, style: styleOverride, ...rest } = props

  // figure out which content to use
  const i18nText = tx && translate(tx, txOptions)
  const content = i18nText || text || children

  const style = presets[preset] || presets.default
  const styles = [style, styleOverride]

  return (
    <NativeText adjustsFontSizeToFit={false} style={styles} {...rest}>
      {content}
    </NativeText>
  )
}
export default observer(Text)
