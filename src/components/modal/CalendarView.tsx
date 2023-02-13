import Text from "@components/text/text"
import { color } from "@theme/color"
import { spacing } from "@theme/spacing"
import { Box } from "native-base"
import React, { useState } from "react"
import { TouchableOpacity } from "react-native"
import { ButtonCustom } from ".."

const viewOptions = [
  { value: "DAY", label: "1 day" },
  { value: "3_DAYS", label: "3 days" },
  { value: "WEEK", label: "Week" },
]

interface CalendarViewProps {
  onConfirmPress?: (value: string) => void
  calendarView: string
}

const CalendarView = (props: CalendarViewProps) => {
  const { onConfirmPress, calendarView } = props
  const [selectedValue, setSelectedValue] = useState(calendarView)
  const _onPress = () => {
    onConfirmPress(selectedValue)
  }

  return (
    <Box
      backgroundColor={color.palette.white}
      borderTopLeftRadius={"3xl"}
      borderTopRightRadius={"3xl"}
      paddingY={spacing[1]}
    >
      <Box
        flexDirection="row"
        justifyContent="space-evenly"
        paddingY={spacing[1]}
        marginBottom={spacing[1]}
      >
        {viewOptions.map((option) => {
          const { label, value } = option
          return (
            <TouchableOpacity key={label} onPress={() => setSelectedValue(value)}>
              <Box
                borderWidth={1}
                p={spacing[1]}
                borderRadius="md"
                {...(value === selectedValue && { ...{ borderColor: color.primary } })}
              >
                <Text
                  text={label}
                  style={{ color: selectedValue === value ? color.primary : color.palette.black }}
                />
              </Box>
            </TouchableOpacity>
          )
        })}
      </Box>
      <ButtonCustom onPress={_onPress}>
        <Text tx="button.confirm" style={{ color: color.palette.white }} />
      </ButtonCustom>
    </Box>
  )
}

export default CalendarView
