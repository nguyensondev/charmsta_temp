import * as React from "react"
import { TouchableOpacity, ViewStyle } from "react-native"
import AntDesign from "react-native-vector-icons/AntDesign"
import Feather from "react-native-vector-icons/Feather"
import Ionicons from "react-native-vector-icons/Ionicons"
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"
import MaterialIcons from "react-native-vector-icons/MaterialIcons"

export interface VectorIconProps {
  iconSet?: "ion" | "ant" | "mat" | "fea" | "matc" | undefined
  size?: number
  name?: string
  style?: ViewStyle
  onPress?: () => void
  color?: string
  id?: string
}

const defaultSize = 18

const VectorIcon = (props: VectorIconProps) => {
  const { iconSet, onPress, name, size, style: customStyle, id, ...rest } = props
  const renderIcon = React.useCallback(() => {
    switch (iconSet) {
      case "ion":
        return <Ionicons {...rest} name={name} size={size || defaultSize} />
      case "ant":
        return <AntDesign {...rest} name={name} size={size || defaultSize} />
      case "mat":
        return <MaterialIcons {...rest} name={name} size={size || defaultSize} />
      case "fea":
        return <Feather {...rest} name={name} size={size || defaultSize} />
      case "matc":
        return <MaterialCommunityIcons {...rest} name={name} size={size || defaultSize} />
    }
  }, [iconSet, name, rest])

  return (
    <TouchableOpacity
      key={id}
      style={customStyle}
      onPress={onPress}
      hitSlop={{ top: 10, right: 10, left: 10, bottom: 10 }}
      disabled={!onPress}
    >
      {renderIcon()}
    </TouchableOpacity>
  )
}

export default VectorIcon
