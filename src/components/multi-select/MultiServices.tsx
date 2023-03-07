import VectorIcon from "@components/vectorIcon/vectorIcon"
import { useService } from "@hooks/service/useService"
import { ServiceDTO } from "@models/backend/response/Service"
import { color } from "@theme/color"
import { spacing } from "@theme/spacing"
import { isEmpty, isFunction } from "lodash"
import { CheckIcon, ChevronDownIcon, Row, Select, View } from "native-base"
import React, { useCallback, useEffect, useLayoutEffect, useState } from "react"
import { Text, TouchableOpacity } from "react-native"
import { styles } from "./styles"

interface MultiServicesProps {
  onSelected?: (selecteds: Partial<ServiceDTO>[]) => void
  defaultValues?: ServiceDTO[]
  displayOnly?: boolean
}

const MultiServices = (props: MultiServicesProps) => {
  const { onSelected, defaultValues = [], displayOnly = false } = props

  const [selecteds, setSelecteds] = useState<Partial<ServiceDTO>[]>([{}])
  const [isAddAvailable, setAddAvailable] = useState(false)
  const { getServiceList, serviceList, pagination, getAllServices, setServiceList } = useService()

  useLayoutEffect(() => {
    if (!displayOnly) {
      getAllServices()
    }
  }, [displayOnly])

  useLayoutEffect(() => {
    if (selecteds.every((selected) => !isEmpty(selected))) {
      setAddAvailable(true)
    }
  }, [selecteds.every((selected) => !isEmpty(selected))])

  useEffect(() => {
    if (!isEmpty(defaultValues)) {
      setSelecteds(defaultValues)
      if (displayOnly) {
        setServiceList(defaultValues)
      }
    }
  }, [defaultValues, defaultValues])

  const onAddMorePress = () => {
    if (isAddAvailable) {
      setAddAvailable(false)
      setSelecteds((prev) => [...prev, {}])
    }
  }

  const _onValueChange = (value: string, index: number) => {
    selecteds[index] = serviceList.find((service) => service.id.toString() === value)
    setSelecteds(selecteds)
    if (isFunction(onSelected)) {
      onSelected(selecteds)
    }
  }

  const onRemove = (index: number) => {
    setSelecteds((prev) => {
      const finalSelecteds =
        selecteds.length === 1 ? [{}] : prev.filter((item, prevIndex) => prevIndex !== index)

      if (isFunction(onSelected)) {
        onSelected(finalSelecteds)
      }
      return finalSelecteds
    })
    if (selecteds.length === 1) {
      setAddAvailable(false)
    }
  }

  const getDropdownIcon = useCallback(
    (item: Partial<ServiceDTO>, index: number) =>
      displayOnly ? (
        <View />
      ) : isEmpty(item) ? (
        <ChevronDownIcon />
      ) : (
        <TouchableOpacity
          onPress={() => onRemove(index)}
          hitSlop={{ bottom: 5, left: 5, right: 5, top: 5 }}
        >
          <VectorIcon iconSet="ant" name="closecircleo" color={color.error} />
        </TouchableOpacity>
      ),
    [selecteds, displayOnly],
  )

  const RenderBody = useCallback(
    () => (
      <>
        {selecteds.map((item, index) => {
          return (
            <Select
              key={`selected-${item?.id}-${index}`}
              borderWidth={0}
              borderBottomWidth={1}
              borderRadius={0}
              paddingLeft={"1.5"}
              marginTop={spacing[1]}
              fontSize={18}
              selectedValue={item?.id?.toString()}
              onValueChange={(value) => _onValueChange(value, index)}
              _selectedItem={{
                bg: "teal.600",
                endIcon: <CheckIcon size="5" />,
              }}
              dropdownIcon={getDropdownIcon(item, index)}
            >
              {serviceList.map((service) => (
                <Select.Item
                  key={`service-${service?.id}`}
                  label={service?.name}
                  value={service?.id?.toString()}
                />
              ))}
            </Select>
          )
        })}
      </>
    ),
    [selecteds, serviceList, isAddAvailable, displayOnly, defaultValues],
  )

  const RenderAddMore = useCallback(
    () =>
      isAddAvailable &&
      !displayOnly && (
        <TouchableOpacity onPress={onAddMorePress}>
          <Row mt={spacing[1]}>
            <VectorIcon color={color.primary} iconSet="ant" name="pluscircleo" />
            <Text style={styles.addMore}>Add new service</Text>
          </Row>
        </TouchableOpacity>
      ),
    [isAddAvailable, displayOnly],
  )

  return (
    <>
      <RenderBody />
      <RenderAddMore />
    </>
  )
}

export default MultiServices
