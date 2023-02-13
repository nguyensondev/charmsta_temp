import { ButtonCustom, Header, Screen } from "@components/index"
import { TextFieldCustom } from "@components/text-field"
import { useAppointment } from "@hooks/appointment/useAppointment"
import { MAIN_SCREENS } from "@models/enum/screensName"
import { MainNavigatorParamList } from "@models/navigator"
import { navigationRef } from "@navigators/navigation-utilities"
import { RouteProp, StackActions, useRoute } from "@react-navigation/native"
import { color } from "@theme/color"
import { spacing } from "@theme/spacing"
import { View } from "native-base"
import React, { useLayoutEffect, useRef } from "react"
import { Alert, Keyboard } from "react-native"

interface CancelAppointmentScreenProps {}

const CancelAppointmentScreen = (props: CancelAppointmentScreenProps) => {
  const route = useRoute<RouteProp<MainNavigatorParamList, MAIN_SCREENS.cancelAppointment>>()
  const { appointmentId } = route.params
  const { cancelAppointment, cancelStatus } = useAppointment()
  let reason = useRef<string>("").current
  useLayoutEffect(() => {
    if (cancelStatus) {
      Alert.alert("Cancel successful", "This booking have been cancelled", [
        { text: "Ok", onPress: () => navigationRef.dispatch(StackActions.popToTop()) },
      ])
    }
  }, [cancelStatus])

  const onCancelPress = () => {
    cancelAppointment(appointmentId, reason)
  }

  return (
    <Screen keyboardOffset="opt1">
      <Header headerText="Cancel" leftIcon="back" />
      <View flex={1} mx={spacing[1]} onTouchStart={Keyboard.dismiss}>
        <TextFieldCustom
          label="Cancellation reason"
          multiline
          placeholder=""
          onChangeText={(text) => {
            reason = text
          }}
        />
      </View>
      <ButtonCustom
        onPress={onCancelPress}
        mb={spacing[1]}
        text="Cancel"
        background={color.error}
        textStyle={{
          fontSize: 16,
        }}
      />
    </Screen>
  )
}

export default CancelAppointmentScreen
