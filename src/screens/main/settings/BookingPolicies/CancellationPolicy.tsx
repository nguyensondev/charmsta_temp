import { Header, Screen } from "@components/index"
import Text from "@components/text/text"
import VectorIcon from "@components/vectorIcon/vectorIcon"
import { useStoresInfo } from "@hooks/settings/useStoresInfo"
import { TxKeyPath } from "@i18n/i18n"
import { MAIN_SCREENS } from "@models/enum/screensName"
import { MainNavigatorParamList } from "@models/navigator"
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native"
import { color } from "@theme/color"
import { spacing } from "@theme/spacing"
import { FlatList, Pressable } from "native-base"
import React, { useState } from "react"

const times = [
  { label: "anytime", value: 0 },
  { label: "hour", value: 1 },
  { label: "hours", value: 2 },
  { label: "hours", value: 4 },
  { label: "hours", value: 6 },
  { label: "hours", value: 8 },
  { label: "hours", value: 10 },
  { label: "hours", value: 12 },
  { label: "hours", value: 24 },
  { label: "hours", value: 48 },
  { label: "week", value: 7 * 24 },
  { label: "never", value: -1 },
]

interface ICancellationPolicyScreenProps {}

const CancellationPolicyScreen = (props: ICancellationPolicyScreenProps) => {
  const route = useRoute<RouteProp<MainNavigatorParamList, MAIN_SCREENS.customerNotes>>()
  const { goBack } = useNavigation()

  const { updateStore } = useStoresInfo()
  const { storeDetail } = route.params
  const [selectedTime, setSelectedTime] = useState(storeDetail?.cancelTime)

  const renderItem = ({ item }) => {
    const itemPress = () => {
      if (item.value !== selectedTime) {
        updateStore(storeDetail.id, { ...storeDetail, cancelTime: item.value })
        setSelectedTime(item.value)
      }
    }

    return (
      <Pressable
        onPress={itemPress}
        flexDirection={"row"}
        justifyContent={"space-between"}
        alignItems={"center"}
        borderBottomWidth={1}
        borderColor={color.palette.lightGrey}
        padding={spacing[1]}
      >
        <Text
          tx={`valueDisplay.${item.label}` as TxKeyPath}
          txOptions={{ time: item.label === "week" ? item.value / (7 * 24) : item.value }}
        />
        {item.value === selectedTime && <VectorIcon iconSet="ion" name="checkmark" size={20} />}
      </Pressable>
    )
  }

  return (
    <Screen>
      <Header
        leftIcon="back"
        onLeftPress={goBack}
        headerTx="screens.headerTitle.cancellationPolicy"
      />
      <FlatList
        data={times}
        ListHeaderComponent={() => (
          <Text marginX={spacing[1]} tx="settings.bookingPolicies.cancellationPolicy.intruction" />
        )}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItem}
      />
    </Screen>
  )
}

export default CancellationPolicyScreen
