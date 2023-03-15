import { ButtonCustom, Header, Screen } from "@components/index"
import { TextFieldCustom } from "@components/text-field"
import Text from "@components/text/"
import { useStoresInfo } from "@hooks/settings/useStoresInfo"
import { useStores } from "@models/index"
import { useNavigation } from "@react-navigation/native"
import { color } from "@theme/color"
import { spacing } from "@theme/spacing"
import { isNull } from "lodash"
import { Box } from "native-base"
import React, { useEffect, useRef } from "react"

interface ICustomerNotesScreenProps {}

const CustomerNotesScreen = (props: ICustomerNotesScreenProps) => {
  // const route = useRoute<RouteProp<MainNavigatorParamList, MAIN_SCREENS.customerNotes>>()
  const { goBack } = useNavigation()
  // const { storeDetail } = route.params
  const {
    currentStoreStore: { CurrentStore: storeDetail },
  } = useStores()
  const { updateStore, updating, updateSuccess } = useStoresInfo()
  const note = useRef("")

  useEffect(() => {
    if (!isNull(storeDetail.notes)) {
      note.current = storeDetail.notes
    }
  }, [])

  useEffect(() => {
    if (updateSuccess) {
    }
  }, [updateSuccess])

  const onNoteChange = (text: string) => {
    note.current = text
  }

  const onSave = () => {
    updateStore(storeDetail.id, { ...storeDetail, notes: note.current })
  }

  return (
    <Screen customBehavior="height">
      <Header leftIcon="back" onLeftPress={goBack} headerTx="screens.headerTitle.customerNotes" />
      <Box paddingX={spacing[1]} flex={1}>
        <Text tx="settings.bookingPolicies.customerNotes.intruction" />
        <TextFieldCustom
          defaultValue={storeDetail?.notes}
          placeholder="Write a note"
          multiline
          onChangeText={onNoteChange}
        />
      </Box>
      <ButtonCustom marginBottom={spacing[1]} width={"90%"} onPress={onSave} isLoading={updating}>
        <Text tx="button.save" style={{ color: color.palette.white }} />
      </ButtonCustom>
    </Screen>
  )
}

export default CustomerNotesScreen
