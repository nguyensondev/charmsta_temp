import { Box } from "native-base"
import React from "react"
import { ViewStyle } from "react-native"

import Text from "@components/text/text"
import { TxKeyPath } from "@i18n/i18n"
import { color } from "@theme/color"
import CurrencyPicker from "react-native-currency-picker"
import { styles } from "./styles"

const PRESETS: { [name: string]: ViewStyle } = {
  default: {},
}

interface ITextFieldCurrencyProps {
  preset?: keyof typeof PRESETS
  style?: ViewStyle
  placeholder?: string
  placeholderTx?: TxKeyPath
  label?: string
  labelTx?: TxKeyPath
  isOptional?: boolean
  forwardRef?: any
  inputStyle?: ViewStyle
  errorMsg?: string
  hideError?: boolean
  editable?: boolean
  defaultValue?: string
  onSelectCurrency?: (data: {
    symbol: string
    name: string
    symbol_native: string
    decimal_digits: number
    rounding: number
    code: string
    name_plural: string
  }) => void
}

const TextFieldCurrency = (props: ITextFieldCurrencyProps) => {
  const {
    isOptional,
    label,
    labelTx,
    preset,
    placeholder,
    placeholderTx,
    style: styleOverride,
    inputStyle: inputStyleOverride,
    forwardRef,
    errorMsg,
    hideError = false,
    defaultValue,
    onSelectCurrency,
    ...rest
  } = props

  const containerStyles = [styles.CONTAINER, PRESETS[preset], styleOverride]
  const errorMsgStyles = [styles.ERROR, styles.errorMsg]

  return (
    <Box style={containerStyles}>
      {(label || labelTx) && (
        <Text>
          <Text preset="fieldLabel" tx={labelTx} text={label} />{" "}
          {isOptional && <Text preset="fieldLabel" tx={"textInput.label.optional"} />}
        </Text>
      )}
      <CurrencyPicker
        darkMode={false}
        showFlag={false}
        currencyCode={defaultValue || "USD"}
        onSelectCurrency={onSelectCurrency}
        containerStyle={{
          container: {
            width: "100%",
            borderBottomWidth: 1,
            borderColor: color.palette.lighterGrey,
            minHeight: 44,
          },
          currencyCodeStyle: { flex: 0.2, marginLeft: 0 },
          currencyNameStyle: { flex: 1, textAlign: "center" },
          symbolStyle: { flex: 0.5 },
        }}
      />
      {!hideError && <Text style={errorMsgStyles}>{errorMsg}</Text>}
    </Box>
  )
}

export default TextFieldCurrency
