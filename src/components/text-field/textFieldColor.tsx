import ColorPicker from "@components/modal/ColorPicker"
import CustomModal, { IRefCustomModal } from "@components/modal/CustomModal"
import Text from "@components/text/text"
import { TxKeyPath } from "@i18n/i18n"
import { isNull } from "lodash"
import { Box } from "native-base"
import React, { useEffect, useRef, useState } from "react"
import { TouchableOpacity, ViewStyle } from "react-native"
import { DatePickerProps } from "react-native-date-picker"
import { styles } from "./styles"

const PRESETS: { [name: string]: ViewStyle } = {
  default: {},
}

interface TextFieldColorProps {
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
  onValueChange?: (color: string) => void
  disabled?: boolean
  defaultValue?: string
}

export interface ITextFieldColorRef {
  isOpen: boolean
  value: Date
}

const TextFieldColor = (props: TextFieldColorProps) => {
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

  const [value, setValue] = useState<null | string>(null)

  const colorPickerRef = useRef<IRefCustomModal>(null)

  useEffect(() => {
    if (!isNull(defaultValue)) setValue(defaultValue)
  }, [defaultValue])

  const onColorSelect = (value: string) => {
    setValue(value)
    onValueChange(value)
    colorPickerRef.current.closeModal()
  }

  const containerStyles = [styles.CONTAINER, PRESETS[preset], styleOverride]

  return (
    <Box style={containerStyles}>
      {(label || labelTx) && (
        <Text>
          <Text preset="fieldLabel" tx={labelTx} text={label} />{" "}
          {isOptional && <Text preset="fieldLabel" tx={"textInput.label.optional"} />}
        </Text>
      )}
      <TouchableOpacity
        onPress={() => colorPickerRef.current.openModal()}
        style={styles.colorFieldContainer}
        disabled={rest.disabled}
      >
        <Box backgroundColor={value} flex={1} />
      </TouchableOpacity>
      <CustomModal ref={colorPickerRef} childView={<ColorPicker onColorSelect={onColorSelect} />} />
    </Box>
  )
}

export default TextFieldColor
