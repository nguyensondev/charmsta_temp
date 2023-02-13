import RNSlider, { SliderProps as RNSliderProps } from "@react-native-community/slider"
import { Box, IBoxProps } from "native-base"
import * as React from "react"
import { StyleSheet } from "react-native"

interface SliderProps extends IBoxProps {
  sliderProps: RNSliderProps
  onValueChange?: (value: number) => void
}

const Slider = (props: SliderProps) => {
  const { onValueChange, sliderProps, ...rest } = props
  return (
    <Box {...rest}>
      <RNSlider onValueChange={onValueChange} style={styles.slider} {...sliderProps} />
    </Box>
  )
}

export default Slider

const styles = StyleSheet.create({
  slider: {
    alignSelf: "center",
    width: "95%",
  },
})

//   const [value, setValue] = React.useState(props.step || props.minValue || 0)
//   const [hours, setHours] = React.useState([])
//   React.useLayoutEffect(() => {
//     switch (value) {
//       case 4:
//         setHours(range(0, 1440, 120))
//         break
//       case 3:
//         setHours(range(0, 1440, 60))
//         break
//       case 2:
//         setHours(range(0, 1440, 30))
//         break
//       case 1:
//         setHours(range(0, 1440, 15))
//         break
//     }
//   }, [value])
