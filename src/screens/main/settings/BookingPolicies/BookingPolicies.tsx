import { Header, Screen } from "@components/index"
import Text from "@components/text/text"
import { TxKeyPath } from "@i18n/i18n"
import { MAIN_SCREENS } from "@models/enum/screensName"
import { MainNavigatorParamList } from "@models/navigator"
import { NavigationProp, RouteProp, useNavigation, useRoute } from "@react-navigation/native"
import { color } from "@theme/color"
import { spacing } from "@theme/spacing"
import { Box, FlatList } from "native-base"
import * as React from "react"
import { TouchableOpacity } from "react-native"
import styles from "./styles"

const options = [
  { key: "bookingSlotSize", screenName: "bookingSlotSize", id: "option1" },
  { key: "notes", screenName: "customerNotes", id: "option2" },
  { key: "cancelTime", screenName: "cancellationPolicy", id: "option3" },
]

interface IBookingPoliciesScreenProps {}

const BookingPoliciesScreen = (props: IBookingPoliciesScreenProps) => {
  const route = useRoute<RouteProp<MainNavigatorParamList, MAIN_SCREENS.bookingPolicies>>()
  const navigation = useNavigation<NavigationProp<MainNavigatorParamList>>()
  const { navigate, goBack } = navigation
  const { storeDetail } = route.params

  const renderItem = ({ item, index }) => {
    const { screenName } = item

    const onOptionPress = () => {
      navigate(screenName, { storeDetail })
    }

    return (
      <TouchableOpacity onPress={onOptionPress}>
        <Box padding={spacing[1]} flexDirection="row" justifyContent={"space-between"}>
          <Text tx={`settings.bookingPolicies.${screenName}.label` as TxKeyPath} />
        </Box>
      </TouchableOpacity>
    )
  }
  return (
    <Screen>
      <Header headerTx="screens.headerTitle.bookingPolicies" leftIcon="back" onLeftPress={goBack} />
      <FlatList
        contentContainerStyle={styles.body}
        ItemSeparatorComponent={() => (
          <Box borderTopWidth={1} borderColor={color.palette.lightGrey} />
        )}
        data={options}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
      />
    </Screen>
  )
}

export default BookingPoliciesScreen
