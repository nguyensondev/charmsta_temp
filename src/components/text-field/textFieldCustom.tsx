import Text from "@components/text"
import VectorIcon from "@components/vectorIcon/vectorIcon"
import { Box, IInputProps, Input } from "native-base"
import React, { useState } from "react"
import { StyleProp, TextStyle, TouchableOpacity, View, ViewStyle } from "react-native"
import { translate, TxKeyPath } from "../../i18n"
import { color } from "../../theme"
import { styles } from "./styles"

// currently we have no presets, but that changes quickly when you build your app.
const PRESETS: { [name: string]: ViewStyle } = {
  default: {},
}

export interface TextFieldProps extends IInputProps {
  /**
   * The placeholder i18n key.
   */
  placeholderTx?: TxKeyPath

  /**
   * The Placeholder text if no placeholderTx is provided.
   */
  placeholder?: string

  /**
   * The label i18n key.
   */
  labelTx?: TxKeyPath

  /**
   * The label text if no labelTx is provided.
   */
  label?: string

  /**
   * Optional container style overrides useful for margins & padding.
   */
  style?: StyleProp<ViewStyle>

  /**
   * Optional style overrides for the input.
   */
  inputStyle?: StyleProp<TextStyle>

  /**
   * Various look & feels.
   */
  preset?: keyof typeof PRESETS

  isPassword?: boolean | undefined
  isValid?: boolean
  errorMsg?: string
  hideError?: boolean
  isOptional?: boolean
  forwardRef?: any
  isHasButton?: boolean
  buttonClick?: () => void
  rightElement?: JSX.Element
}

/**
 * A component which has a label and an input together.
 */
export function TextFieldCustom(props: TextFieldProps) {
  const {
    isOptional,
    placeholderTx,
    placeholder,
    label,
    labelTx,
    preset = "default",
    style: styleOverride,
    inputStyle: inputStyleOverride,
    isPassword,
    errorMsg,
    hideError = false,
    forwardRef,
    isHasButton = false,
    buttonClick,
    rightElement,
    editable = true,
    pointerEvents,
    ...rest
  } = props
  const [hidePassword, setHidePassword] = useState(true)
  const containerStyles = [styles.CONTAINER, PRESETS[preset], styleOverride]
  const inputStyles = [styles.INPUT, inputStyleOverride, errorMsg && styles.ERROR]
  const errorMsgStyles = [styles.ERROR, styles.errorMsg]
  const actualPlaceholder = placeholderTx ? translate(placeholderTx) : placeholder

  return (
    <Box style={containerStyles} pointerEvents={pointerEvents}>
      {(label || labelTx) && (
        <Text>
          <Text preset="fieldLabel" tx={labelTx} text={label} />{" "}
          {isOptional && <Text preset="fieldLabel" tx={"textInput.label.optional"} />}
        </Text>
      )}
      {isHasButton ? (
        <TouchableOpacity disabled={!editable} onPress={buttonClick}>
          <View pointerEvents="none">
            <Input
              px={"1.5"}
              isRequired={true}
              // isReadOnly={true}
              pointerEvents="none"
              ref={forwardRef}
              // isDisabled={rightElement === undefined}
              placeholder={actualPlaceholder}
              placeholderTextColor={color.palette.black}
              underlineColorAndroid={color.transparent}
              secureTextEntry={isPassword ? hidePassword : false}
              rightElement={rightElement || null}
              variant="underlined"
              width="full"
              style={inputStyles}
              borderBottomColor={props.errorMsg && color.error}
              {...rest}
            />
          </View>
        </TouchableOpacity>
      ) : (
        <Input
          ref={forwardRef}
          placeholder={actualPlaceholder}
          placeholderTextColor={color.palette.lighterGrey}
          underlineColorAndroid={color.transparent}
          secureTextEntry={isPassword ? hidePassword : false}
          variant="underlined"
          width="full"
          rightElement={
            !!isPassword ? (
              <VectorIcon
                size={18}
                iconSet="ion"
                name={hidePassword ? "eye" : "eye-off"}
                onPress={() => setHidePassword((prev) => !prev)}
              />
            ) : rightElement ? (
              rightElement
            ) : null
          }
          paddingLeft={"1.5"}
          paddingRight={"1.5"}
          style={inputStyles}
          borderBottomColor={props.errorMsg && color.error}
          editable={editable}
          {...rest}
        />
      )}
      {!hideError && <Text style={errorMsgStyles}>{errorMsg}</Text>}
    </Box>
  )
}
