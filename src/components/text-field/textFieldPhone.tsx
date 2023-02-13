import { Box, Input } from "native-base"
import React, { useEffect, useRef, useState } from "react"
import { ViewStyle } from "react-native"
import CountryPicker from "react-native-region-country-picker"

import Text from "@components/text/text"
import { TxKeyPath } from "@i18n/i18n"
import { color } from "@theme/color"
import { translate } from "i18n-js"
import { get } from "lodash"
import { styles } from "./styles"

const PRESETS: { [name: string]: ViewStyle } = {
  default: {},
}

interface ITextFieldPhoneProps {
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
  defaultValue?: {
    code?: string
    callingCode?: string
    phoneNumber?: string
  }
  onChange: ({
    code,
    phoneNumber,
    callingCode,
  }: {
    code: string
    phoneNumber: string
    callingCode: string
  }) => void
}

const TextFieldPhone = (props: ITextFieldPhoneProps) => {
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
    onChange,
    defaultValue,
    ...rest
  } = props

  const [phoneNumber, setPhoneNumber] = useState<string>(get(defaultValue, "phoneNumber", ""))
  const [region, setRegion] = useState<
    Partial<{
      code: string
      unicode: string
      name: string
      emoji: string
      callingCode: string
    }>
  >({
    code: get(defaultValue, "code", "US").toUpperCase(),
    callingCode: get(defaultValue, "callingCode", "1").replace("+", ""),
  })

  const countryPickerRef = useRef<Partial<{ open: () => void; close: () => void }>>()

  useEffect(() => {
    onChange({ code: region.code, callingCode: region.callingCode, phoneNumber })
  }, [region.code, phoneNumber])

  const containerStyles = [styles.CONTAINER, PRESETS[preset], styleOverride]
  const actualPlaceholder = placeholderTx ? translate(placeholderTx) : placeholder
  const inputStyles = [styles.INPUT, inputStyleOverride, errorMsg && styles.ERROR]
  const errorMsgStyles = [styles.ERROR, styles.errorMsg]

  const onCountryPickerOpen = () => {
    if (!rest.editable && countryPickerRef?.current) {
      countryPickerRef.current.close()
    }
  }
  return (
    <Box style={containerStyles}>
      {(label || labelTx) && (
        <Text>
          <Text preset="fieldLabel" tx={labelTx} text={label} />{" "}
          {isOptional && <Text preset="fieldLabel" tx={"textInput.label.optional"} />}
        </Text>
      )}
      <Input
        ref={forwardRef}
        keyboardType="phone-pad"
        placeholder={actualPlaceholder}
        placeholderTextColor={color.palette.lighterGrey}
        underlineColorAndroid={color.transparent}
        onChangeText={setPhoneNumber}
        leftElement={
          <CountryPicker
            countryPickerRef={(ref: any) => (countryPickerRef.current = ref)}
            onOpen={onCountryPickerOpen}
            disabled={true}
            darkMode={false}
            countryCode={region.code}
            onSelectCountry={setRegion}
            containerConfig={{
              showFlag: true,
              showCallingCode: true,
              showCountryName: false,
              showCountryCode: false,
            }}
          />
        }
        variant="underlined"
        width="full"
        defaultValue={get(defaultValue, "phoneNumber", phoneNumber)}
        {...rest}
        style={inputStyles}
        borderBottomColor={props.errorMsg && color.error}
      />
      {!hideError && <Text style={errorMsgStyles}>{errorMsg}</Text>}
    </Box>
  )
}

export default TextFieldPhone
