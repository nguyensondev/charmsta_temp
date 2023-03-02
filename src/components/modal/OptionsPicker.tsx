import Text from "@components/text/text"
import { HEIGHT_WINDOW } from "@config/constants"
import { color } from "@theme/color"
import { spacing } from "@theme/spacing"
import { Box, IBoxProps, ScrollView, View } from "native-base"
import * as React from "react"
import { TouchableOpacity } from "react-native"

const defaultButtonStyle: IBoxProps = {
  alignSelf: "center",
  alignItems: "center",
  width: "90%",
  paddingY: spacing[1],
  bg: color.palette.white,
}

interface OptionsPickerProps {
  options: {
    label: string
    function: () => void
    background?: string
    color?: string
  }[]
  onClose?: () => void
  scrollable?: boolean
}

const OptionsPicker = (props: OptionsPickerProps) => {
  const { options = [], onClose, scrollable = false } = props
  return (
    <View>
      <ScrollView
        scrollEnabled={scrollable}
        backgroundColor={"transparent"}
        marginBottom={spacing[1]}
        maxHeight={scrollable ? HEIGHT_WINDOW / 2 : HEIGHT_WINDOW}
        showsVerticalScrollIndicator={false}
      >
        {options.map((option, index) => {
          return (
            <TouchableOpacity key={`${option.label}-${index}`} onPress={option.function}>
              <Box
                {...defaultButtonStyle}
                {...(index === 0 && {
                  ...{ borderTopLeftRadius: "xl", borderTopRightRadius: "xl" },
                })}
                {...(index === options.length - 1 && {
                  ...{ borderBottomLeftRadius: "xl", borderBottomRightRadius: "xl" },
                })}
                backgroundColor={option.background}
              >
                <Text text={option.label} fontWeight="bold" style={{ color: option.color }} />
              </Box>
            </TouchableOpacity>
          )
        })}
      </ScrollView>
      <TouchableOpacity onPress={onClose}>
        <Box
          {...defaultButtonStyle}
          borderTopLeftRadius="xl"
          borderTopRightRadius="xl"
          borderBottomLeftRadius="xl"
          borderBottomRightRadius="xl"
          marginBottom={spacing[1]}
        >
          <Text text={"Close"} fontWeight="bold" />
        </Box>
      </TouchableOpacity>
    </View>
  )
}

export default OptionsPicker
