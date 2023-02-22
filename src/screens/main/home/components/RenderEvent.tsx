import Text from "@components/text/text"
import { TIME_24H_FORMAT } from "@config/constants"
import { CalendarDTO } from "@models/backend/response/Appointment"
import moment from "moment"
import { View } from "native-base"
import * as React from "react"

interface RenderEventProps {
  event: CalendarDTO & { height: number }
}

const RenderEvent = ({ event }: RenderEventProps) => {
  const { packages = [], services = [], date, id, label, customer, duration, height } = event
  const allServices = [
    services,
    ...packages.map((pack) =>
      pack.services.map((packSer) => ({ ...packSer, name: `${pack.name} - ${packSer.name}` })),
    ),
  ].flat(1)
  return (
    <View borderLeftWidth={5} borderColor={label?.color || "transparent"} flex={1} pl={"1"}>
      <Text fontWeight={"bold"} text={`${customer?.firstName || ""} ${customer?.lastName || ""}`} />
      <Text>
        {moment(date).format(TIME_24H_FORMAT)} -{" "}
        {moment(date).add({ minutes: duration }).format(TIME_24H_FORMAT)}
      </Text>

      <Text noOfLines={2}>{allServices.map((service) => service.name).join(", ")}</Text>
    </View>
  )
}

export default RenderEvent
