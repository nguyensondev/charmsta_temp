import CustomModal, { IRefCustomModal } from "@components/modal/CustomModal"
import Text from "@components/text/text"
import VectorIcon from "@components/vectorIcon/vectorIcon"
import { SCREEN_HEIGHT } from "@config/constants"
import { PackageDTO } from "@models/backend/response/Package"
import { ServiceDTO } from "@models/backend/response/Service"
import { StaffByServiceDTO } from "@models/backend/response/Staff"
import { MAIN_SCREENS } from "@models/enum/screensName"
import { MainNavigatorParamList } from "@models/navigator"
import { navigationRef } from "@navigators/navigation-utilities"
import { StackActions } from "@react-navigation/native"
import { SceneMapNameEnum } from "@screens/main/selection"
import { color } from "@theme/color"
import { spacing } from "@theme/spacing"
import { convertCurrency } from "@utils/data"
import { convertMinsValue } from "@utils/time"
import { isFunction } from "lodash"
import { Box, FlatList, Row } from "native-base"
import React, { useMemo, useRef, useState } from "react"
import { TouchableOpacity } from "react-native"
import { nativeBaseStyle, styles } from "../styles"

interface ServicesAndPacakgesProps {
  services: ServiceDTO[]
  packages: PackageDTO[]
  isAddNew?: boolean
  onStaffPress?: (
    staff: StaffByServiceDTO,
    serviceId: number,
    type: "services" | "packages",
  ) => void
  staffList?: StaffByServiceDTO[]
}

const ServicesAndPackages = (props: ServicesAndPacakgesProps) => {
  const { services = [], packages = [], onStaffPress, staffList = [], isAddNew = false } = props
  const [selected, setSelected] = useState<{
    staffId?: number
    belongToId?: number
    type?: "services" | "packages"
  }>({})

  const modalRef = useRef<IRefCustomModal>()
  const isStaffPressable = useMemo(
    () => isFunction(onStaffPress) && staffList.length > 0,
    [onStaffPress, staffList],
  )

  const _onStaffPress = (
    staff?: StaffByServiceDTO,
    belongToId?: number,
    type?: "services" | "packages",
  ) => {
    modalRef.current.openModal()
    setSelected({ staffId: staff?.id, belongToId, type })
  }

  const onStaffSelect = (newStaffId: number) => {
    const { belongToId, type } = selected
    onStaffPress(
      staffList.find((staff) => staff.id === newStaffId),
      belongToId,
      type,
    )
    modalRef.current.closeModal()
    setSelected({})
  }

  const onAddMorePress = () => {
    navigationRef.dispatch(
      StackActions.push(MAIN_SCREENS.additionSelect, {
        actionName: SceneMapNameEnum.editAppointment,
        prevSelected: { services: { services, packages } },
      } as MainNavigatorParamList[MAIN_SCREENS.additionSelect]),
    )
  }

  return (
    <>
      <Text fontWeight={"bold"} mt={spacing[1]} tx="textInput.label.services" />
      {services.map((service, index) => (
        <Row key={`service-${service.id}-${index}`} {...nativeBaseStyle.serviceArea}>
          <Box flex={1}>
            <Text text={service.name} />
            <Row>
              <Text>{convertMinsValue(service.serviceDuration, "duration")} with </Text>
              <TouchableOpacity
                disabled={!isStaffPressable}
                onPress={() => _onStaffPress(service.staff, service.id, "services")}
              >
                <Text>
                  {service?.staff?.name}
                  {isStaffPressable && (
                    <VectorIcon iconSet="ion" name="md-chevron-down" size={24} />
                  )}
                </Text>
              </TouchableOpacity>
            </Row>
          </Box>
          <Text fontWeight={"bold"} text={convertCurrency(service.price)} />
        </Row>
      ))}
      <Text fontWeight={"bold"} mt={spacing[1]} tx="textInput.label.packages" />
      {packages.map((pack, index) => (
        <Row key={`package-${pack.id}-${index}`} {...nativeBaseStyle.serviceArea}>
          <Box>
            <Text text={pack.name} />
            {pack.services.map((service) => (
              <Row key={service.id.toString()}>
                <VectorIcon iconSet="ion" name="add" />
                <Text text={service.name} />
              </Row>
            ))}
            <Row>
              <Text>{convertMinsValue(pack.duration, "duration")} with </Text>
              <TouchableOpacity
                disabled={!isStaffPressable}
                onPress={() => _onStaffPress(pack.staff, pack.id, "packages")}
              >
                <Text>
                  {pack?.staff?.name}
                  {isStaffPressable && (
                    <VectorIcon iconSet="ion" name="md-chevron-down" size={24} />
                  )}
                </Text>
              </TouchableOpacity>
            </Row>
          </Box>
          <Text fontWeight={"bold"} text={convertCurrency(pack.price)} />
        </Row>
      ))}
      {isAddNew ? (
        <TouchableOpacity onPress={onAddMorePress}>
          <Row my={spacing[1] / 2}>
            <VectorIcon color={color.primary} iconSet="ant" name="pluscircleo" />
            <Text style={styles.addMore}>Add new</Text>
          </Row>
        </TouchableOpacity>
      ) : null}
      <CustomModal
        childView={
          <Box
            height={SCREEN_HEIGHT / 2.5}
            background={color.palette.white}
            borderTopLeftRadius="md"
            borderTopRightRadius="md"
          >
            <FlatList
              data={staffList}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item, index }) => (
                <TouchableOpacity key={item?.id.toString()} onPress={() => onStaffSelect(item.id)}>
                  <Row style={styles.staffItemContainer}>
                    <Text text={item.name} style={styles.staffModalItem} />
                    {selected?.staffId === item.id ? (
                      <VectorIcon
                        iconSet="ion"
                        name="checkmark-sharp"
                        size={25}
                        color={color.primary}
                      />
                    ) : null}
                  </Row>
                </TouchableOpacity>
              )}
            />
          </Box>
        }
        ref={modalRef}
      />
    </>
  )
}

export default ServicesAndPackages
