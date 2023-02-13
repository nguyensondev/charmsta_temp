import Text from "@components/text/text"
import { DATE_FORMAT } from "@config/constants"
import { TxKeyPath } from "@i18n/i18n"
import { color } from "@theme/color"
import { translate } from "i18n-js"
import { isNull } from "lodash"
import moment from "moment"
import { Box, Input } from "native-base"
import React, { useEffect, useState } from "react"
import { ViewStyle } from "react-native"
import DatePicker, { DatePickerProps } from "react-native-date-picker"
import { styles } from "./styles"

const PRESETS: { [name: string]: ViewStyle } = {
  default: {},
}

interface TextFieldDateTimeProps {
  labelTx?: TxKeyPath
  placeholderTx?: TxKeyPath
  label?: string
  placeholder?: string
  isOptional?: boolean
  preset?: keyof typeof PRESETS
  inputStyle?: ViewStyle
  errorMsg?: string
  style?: ViewStyle
  datePickerProps?: DatePickerProps
  onValueChange?: (timeStamp: number) => void
  editable?: boolean
  defaultValue?: number
}

export interface ITextFieldDateTimeRef {
  isOpen: boolean
  value: Date
}

const TextFieldDateTime = (props: TextFieldDateTimeProps) => {
  const {
    placeholderTx,
    label,
    labelTx,
    placeholder,
    isOptional,
    preset,
    errorMsg,
    inputStyle: inputStyleOverride,
    style: styleOverride,
    datePickerProps,
    onValueChange,
    defaultValue,
    ...rest
  } = props

  const [isOpen, setOpen] = useState(false)
  const [value, setValue] = useState<null | number>(null)

  useEffect(() => {
    if (!isNull(defaultValue)) {
      setValue(defaultValue)
    }
  }, [])

  const containerStyles = [styles.CONTAINER, PRESETS[preset], styleOverride]
  const actualPlaceholder = placeholderTx ? translate(placeholderTx) : placeholder
  const inputStyles = [styles.INPUT, inputStyleOverride, errorMsg && styles.ERROR]

  return (
    <Box style={containerStyles}>
      {(label || labelTx) && (
        <Text>
          <Text preset="fieldLabel" tx={labelTx} text={label} />{" "}
          {isOptional && <Text preset="fieldLabel" tx={"textInput.label.optional"} />}
        </Text>
      )}
      <Input
        onPressIn={() => rest.editable && setOpen(true)}
        placeholder={actualPlaceholder}
        placeholderTextColor={color.palette.lighterGrey}
        underlineColorAndroid={color.transparent}
        variant="underlined"
        width="full"
        {...rest}
        style={inputStyles}
        borderBottomColor={props.errorMsg && color.error}
        value={isNull(value) ? "" : moment.unix(value).format(DATE_FORMAT)}
      />
      <DatePicker
        date={isNull(value) ? moment().toDate() : moment.unix(value).toDate()}
        modal
        open={isOpen}
        onCancel={() => setOpen(false)}
        onConfirm={(date) => {
          onValueChange(moment(date).unix())
          setValue(moment(date).unix())
          setOpen(false)
        }}
        {...datePickerProps}
      />
    </Box>
  )
}

export default TextFieldDateTime
