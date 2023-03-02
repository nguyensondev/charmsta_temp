import { Header, Screen } from "@components/index"
import Text from "@components/text/text"
import VectorIcon, { VectorIconProps } from "@components/vectorIcon/vectorIcon"
import { TxKeyPath } from "@i18n/i18n"
import { MAIN_SCREENS } from "@models/enum/screensName"
import { MainNavigatorParamList } from "@models/navigator"
import { navigate } from "@navigators/navigation-utilities"
import { RouteProp, useRoute } from "@react-navigation/native"
import { spacing } from "@theme/spacing"
import { FlatList, Row, View } from "native-base"
import * as React from "react"
import { TouchableOpacity } from "react-native"
import { styles } from "./styles"

interface PaymentTypeScreenProps {}

interface IPaymentType {
  id: string
  icon?: VectorIconProps
  screenName: string
}

const paymentTypes: IPaymentType[] = [
  { id: "cash", screenName: "cashPayment", icon: { iconSet: "matc", name: "cash" } },
  { id: "card", screenName: "cardPayment", icon: { iconSet: "matc", name: "credit-card" } },
  { id: "other", screenName: "otherPayment", icon: { iconSet: "matc", name: "hand-coin" } },
]

const PaymentTypeScreen = (props: PaymentTypeScreenProps) => {
  const route = useRoute<RouteProp<MainNavigatorParamList, MAIN_SCREENS.paymentType>>()
  const {
    params: {
      checkoutInfo: { id: billId, total },
    },
  } = route

  const renderItem = ({ item, index }: { item: IPaymentType; index: number }) => {
    const { id, icon, screenName } = item

    const onItemPress = () => {
      navigate(MAIN_SCREENS[screenName], {
        billId: billId,
        payment_method: id,
        amount: total,
      })
    }

    return (
      <TouchableOpacity onPress={onItemPress}>
        <Row style={styles.paymentOption}>
          <VectorIcon {...icon} size={24} />
          <Text ml={spacing[1]} tx={`payment.types.${screenName}` as TxKeyPath} />
        </Row>
      </TouchableOpacity>
    )
  }

  return (
    <Screen>
      <Header leftIcon="back" headerTx="screens.headerTitle.selectPayment" />
      <FlatList
        paddingX={spacing[1]}
        data={paymentTypes}
        renderItem={renderItem}
        ItemSeparatorComponent={() => <View h={spacing[1]} />}
      />
    </Screen>
  )
}

export default PaymentTypeScreen
