import Text from "@components/text/text"
import { TxKeyPath } from "@i18n/i18n"
import { translate } from "@i18n/translate"
import { Picker } from "@react-native-picker/picker"
import { color } from "@theme/color"
import { spacing } from "@theme/spacing"
import { Box } from "native-base"
import React, { useEffect, useState } from "react"
import { TouchableOpacity } from "react-native"
import { styles } from "./styles"

const hours = Array.from(Array(24).keys()).map((item) => ({
  label: translate(`valueDisplay.${item > 1 ? "hours" : "hour"}`, { time: item }),
  value: item,
}))
const minutes = Array.from(Array(12).keys()).map((item) => ({
  label: translate(`valueDisplay.${item > 0 ? "mins" : "min"}`, { time: item * 5 }),
  value: item * 5,
}))

interface TimePickerProps {
  onConfirm: (hour: number, minute: number) => void
  onCancel: () => void
  value?: { hour: number; minute: number }
}
const TimePicker = (props: TimePickerProps) => {
  const [selectedTime, setSelectedTime] = useState({
    hour: 0,
    minute: 0,
  })

  useEffect(() => {
    if (props.value) {
      setSelectedTime(props.value)
    }
  }, [])

  const onConfirmPress = () => {
    props.onConfirm(selectedTime.hour, selectedTime.minute)
  }

  return (
    <Box
      backgroundColor={color.palette.white}
      borderTopLeftRadius={"3xl"}
      borderTopRightRadius={"3xl"}
      padding={spacing[1]}
    >
      <Box flexDirection="row" justifyContent={"space-between"}>
        <TouchableOpacity onPress={props.onCancel}>
          <Text tx="button.cancel" />
        </TouchableOpacity>
        <TouchableOpacity onPress={onConfirmPress}>
          <Text tx={"button.confirm" as TxKeyPath} />
        </TouchableOpacity>
      </Box>
      <Box flexDirection="row">
        <Picker
          selectedValue={selectedTime.hour}
          style={styles.pickerWidth}
          onValueChange={(value: number) => setSelectedTime({ ...selectedTime, hour: value })}
        >
          {hours.map((item) => (
            <Picker.Item {...item} key={item.label} />
          ))}
        </Picker>
        <Picker
          selectedValue={selectedTime.minute}
          style={styles.pickerWidth}
          onValueChange={(value: number) => setSelectedTime({ ...selectedTime, minute: value })}
        >
          {minutes.map((item) => (
            <Picker.Item {...item} key={item.label} />
          ))}
        </Picker>
      </Box>
    </Box>
  )
}

export default TimePicker
