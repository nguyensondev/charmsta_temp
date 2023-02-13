import { Header, Screen } from "@components/index"
import CustomModal, { IRefCustomModal } from "@components/modal/CustomModal"
import TimePicker from "@components/modal/TimePicker"
import { TextFieldCustom } from "@components/text-field"
import Text from "@components/text/text"
import { useStoresInfo } from "@hooks/settings/useStoresInfo"
import { useStores } from "@models/index"
import { useNavigation } from "@react-navigation/native"
import { spacing } from "@theme/spacing"
import { Box } from "native-base"
import React, { useRef, useState } from "react"

interface BookingSlotSizeScreenProps {}

const BookingSlotSizeScreen = (props: BookingSlotSizeScreenProps) => {
  // const route = useRoute<RouteProp<MainNavigatorParamList, MAIN_SCREENS.bookingSlotSize>>()
  const { goBack } = useNavigation()
  const {
    currentStoreStore: { CurrentStore: storeDetail },
  } = useStores()
  // const { storeDetail } = route.params
  const [minutes, setMinutes] = useState(storeDetail?.bookingSlotSize || 0)
  const { updateStore } = useStoresInfo()

  const modalRef = useRef<IRefCustomModal>()

  const onConfirm = (hour: number, minute: number) => {
    const selectedMinutes = minute + hour * 60
    setMinutes(selectedMinutes)
    modalRef.current.closeModal()
    updateStore(storeDetail.id, { ...storeDetail, bookingSlotSize: selectedMinutes })
  }

  const onCloseModal = () => {
    if (modalRef.current) {
      modalRef.current.closeModal()
    }
  }

  return (
    <Screen>
      <Header leftIcon="back" onLeftPress={goBack} headerTx="screens.headerTitle.bookingSlotSize" />
      <Box padding={spacing[1]}>
        <Text tx="settings.bookingPolicies.bookingSlotSize.intruction" />
        <TextFieldCustom
          value={`${minutes} mins`}
          isHasButton
          buttonClick={() => {
            if (modalRef.current) {
              modalRef.current.openModal()
            }
          }}
        />
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

export default BookingSlotSizeScreen
