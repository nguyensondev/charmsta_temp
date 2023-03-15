import { ButtonCustom, Header, Screen } from "@components/index"
import CustomModal, { IRefCustomModal } from "@components/modal/CustomModal"
import TimePicker from "@components/modal/TimePicker"
import { TextFieldCustom } from "@components/text-field"
import Text from "@components/text/text"
import { useStoresInfo } from "@hooks/settings/useStoresInfo"
import { MAIN_SCREENS } from "@models/enum/screensName"
import { MainNavigatorParamList } from "@models/navigator"
import { goBack } from "@navigators/navigation-utilities"
import { RouteProp, useRoute } from "@react-navigation/native"
import { color } from "@theme/color"
import { spacing } from "@theme/spacing"
import { get } from "lodash"
import { Box } from "native-base"
import React, { useRef, useState } from "react"
interface IAppointmentSlotScreenProps {}

const AppointmentSlotScreen = (props: IAppointmentSlotScreenProps) => {
  const route = useRoute<RouteProp<MainNavigatorParamList, MAIN_SCREENS.bookingSlotSize>>()
  const { storeDetail } = route.params
  const appointmentSetting = get(storeDetail, "appointmentSetting.appointmentSlots", 0)
  const [minutes, setMinutes] = useState(appointmentSetting)
  const { updateStore } = useStoresInfo()
  const modalRef = useRef<IRefCustomModal>()

  const onConfirm = (hour: number, minute: number) => {
    const selectedMinutes = minute + hour * 60
    setMinutes(selectedMinutes)
    modalRef.current.closeModal()
  }

  const onCloseModal = () => {
    modalRef.current.closeModal()
  }

  const onSave = () => {
    updateStore(storeDetail.id, {
      ...storeDetail,
      appointmentSetting: { ...storeDetail.appointmentSetting, appointmentSlots: minutes },
    })
  }
  console.log("alo1", { minutes })
  return (
    <Screen>
      <Header leftIcon="back" onLeftPress={goBack} headerTx="screens.headerTitle.appointmentSlot" />
      <Box justifyContent={"space-between"} flex={1}>
        <Box padding={spacing[1]}>
          <Text tx="settings.calendarSettings.appointmentSlot.instruction1" />
          <TextFieldCustom
            value={`${minutes} mins`}
            isHasButton
            buttonClick={() => {
              if (modalRef.current) {
                modalRef.current.openModal()
              }
            }}
          />

          <Text tx="settings.calendarSettings.appointmentSlot.instruction2" />
        </Box>
        <ButtonCustom w="90%" marginBottom={spacing[1]} onPress={onSave}>
          <Text tx="button.save" style={{ color: color.palette.white }} />
        </ButtonCustom>
      </Box>
      <CustomModal
        ref={modalRef}
        childView={
          <TimePicker
            value={{
              hour: Math.floor(minutes / 60),
              minute: minutes % 60,
            }}
            onConfirm={onConfirm}
            onCancel={onCloseModal}
          />
        }
      />
    </Screen>
  )
}

export default AppointmentSlotScreen
