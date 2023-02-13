import { Box, Row } from "native-base"
import React, { useCallback, useMemo } from "react"
import { AgendaList, AgendaListProps, ExpandableCalendar } from "react-native-calendars"

import Text from "@components/text/text"
import { TIME_12H_FORMAT } from "@config/constants"
import { CalendarAgenda, CalendarDTO } from "@models/backend/response/Appointment"
import { useStores } from "@models/index"
import { color } from "@theme/color"
import { spacing } from "@theme/spacing"
import { get, isEmpty } from "lodash"
import { observer } from "mobx-react-lite"
import moment from "moment"
import { TouchableOpacity } from "react-native"
import styleConstructor from "@components/agenda-calendar/styles"
interface AgendaCalendarProps {
  agendaListProps?: AgendaListProps
  events?: CalendarAgenda
  onEventPress?: (event: CalendarDTO) => void
}

const styles = styleConstructor()

const AgendaCalendar = observer((props: AgendaCalendarProps) => {
  const { agendaListProps, events, onEventPress } = props

  const { currentStoreStore } = useStores()
  const weekStartDay = get(currentStoreStore.CurrentStore.appointmentSetting, "weekStartDay", 1)

  const renderItem = ({ item }: { item: CalendarDTO }) => {
    const { start, duration, customer, label, services, packages } = item
    return (
      <TouchableOpacity onPress={() => onEventPress(item)}>
        <Row
          borderLeftWidth={8}
          borderRightWidth={8}
          borderColor={label?.color || color.primary}
          marginBottom={spacing[1] / 2}
          paddingX={spacing[3] / 2}
          paddingY={spacing[1]}
          bg={color.palette.white}
        >
          <Box marginRight={spacing[1]}>
            <Text text={moment(start).format(TIME_12H_FORMAT)} />
            <Text tx={"valueDisplay.mins"} txOptions={{ time: duration }} />
          </Box>
          <Box>
            <Text text={isEmpty(customer) ? " " : `${customer.firstName} ${customer.lastName}`} />
            <Text text={`${[...services, ...packages].map(({ name }) => name).join(", ")}`} />
          </Box>
        </Row>
      </TouchableOpacity>
    )
  }

  const agendaListData = useMemo(
    () =>
      Object.entries(events).map(([key, value]) => ({
        title: key,
        data: value.data,
      })),
    [events],
  )

  const RenderAgendaList = useCallback(
    () => <AgendaList {...agendaListProps} sections={agendaListData} renderItem={renderItem} />,
    [agendaListData],
  )

  return (
    <>
      <ExpandableCalendar
        customHeaderTitle={
          <Box height={9} backgroundColor={"transparent"}>
            <Text></Text>
          </Box>
        }
        markedDates={events}
        style={styles.expandableCalendar}
        firstDay={weekStartDay}
        hideArrows
        allowShadow={false}
      />
      <RenderAgendaList />
    </>
  )
})

export default AgendaCalendar
