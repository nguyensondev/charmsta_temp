import Slider from "@components/slider/Slider"
import Text from "@components/text/text"
import { SliderProps } from "@react-native-community/slider"
import { color } from "@theme/color"
import { spacing } from "@theme/spacing"
import { isFunction } from "lodash"
import { Box } from "native-base"
import React, { useRef } from "react"
import { ButtonCustom } from ".."

interface CalendarZoomProps {
  sliderProps?: SliderProps
  onConfirmPress?: (value: number) => void
  onValueChange?: (value: number) => void
}

const CalendarZoom = (props: CalendarZoomProps) => {
  const { sliderProps, onConfirmPress, onValueChange } = props
  const selectedValue = useRef<number>(null)

  const _onValueChange = (value: number) => {
    selectedValue.current = value
    if (isFunction(onValueChange)) {
      onValueChange(value)
    }
  }

  const _onPress = () => {
    onConfirmPress(selectedValue.current)
  }

  return (
    <Box
      backgroundColor={color.palette.white}
      borderTopLeftRadius={"3xl"}
      borderTopRightRadius={"3xl"}
      paddingY={spacing[1]}
    >
      <Slider onValueChange={_onValueChange} sliderProps={sliderProps} marginBottom={spacing[1]} />
      <ButtonCustom onPress={_onPress}>
        <Text tx="button.confirm" style={{ color: color.palette.white }} />
      </ButtonCustom>
    </Box>
  )
}

export default CalendarZoom
