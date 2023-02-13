import VectorIcon from "@components/vectorIcon/vectorIcon"
import { color } from "@theme/color"
import { spacing } from "@theme/spacing"
import { isFunction } from "lodash"
import { Avatar as NativeAvatar, Box, IAvatarProps, View } from "native-base"
import * as React from "react"
import { ActivityIndicator, ImageSourcePropType, TouchableOpacity, ViewStyle } from "react-native"

import { styles } from "./styles"

interface AvatarProps
  extends Omit<IAvatarProps, "height" | "width" | "maxHeight" | "minHeight" | "w" | "h"> {
  source?: ImageSourcePropType
  containerStyle?: ViewStyle
  isLoading?: boolean
  disabled?: boolean
  errorMsg?: string
  size?: number
  onPress?: () => void
}

export const Avatar = (props: AvatarProps) => {
  const {
    onPress,
    source,
    isLoading,
    errorMsg,
    rounded = "full",
    size = 110,
    disabled,
    containerStyle: containerStyleOverride,
    ...rest
  } = props

  const customSize = { height: size, width: size, borderRadius: size / 2 }
  const avatarStyle = [styles.avatar, customSize]
  const containerStyle = [styles.avatarTouchArea, containerStyleOverride || null]
  const errorStyle = errorMsg ? { borderWidth: 1.5, borderColor: color.palette.angry } : null
  const url = source as any
  const isDisabled = (!isLoading && !isFunction(onPress)) || disabled

  const isImage = url && url.uri && url.uri !== undefined && url.uri !== null

  return (
    <TouchableOpacity
      disabled={isDisabled}
      onPress={onPress}
      style={containerStyle}
      hitSlop={{ bottom: 10, top: 10, left: 10, right: 10 }}
    >
      <View style={[avatarStyle, errorStyle, {}]}>
        {isImage ? (
          <NativeAvatar
            source={source}
            alignSelf="center"
            width={"full"}
            height={"full"}
            rounded={rounded}
            _image={{
              rounded,
            }}
            {...rest}
            {...errorStyle}
          />
        ) : (
          <VectorIcon iconSet="ion" name="images" />
        )}
      </View>
      {isLoading && (
        <View
          backgroundColor={color.alpha.black50}
          rounded={rounded}
          // w="md"
          position="absolute"
          justifyContent={"center"}
          alignSelf={"center"}
          top={0}
          bottom={0}
          style={avatarStyle}
        >
          <ActivityIndicator />
        </View>
      )}
      {errorMsg && (
        <Box
          position={"absolute"}
          bottom={0}
          right={spacing[1] / 2}
          backgroundColor={color.palette.white}
          borderRadius={24}
        >
          <VectorIcon
            iconSet="ant"
            name="exclamationcircleo"
            size={26}
            color={color.palette.angry}
          />
        </Box>
      )}
    </TouchableOpacity>
  )
}
