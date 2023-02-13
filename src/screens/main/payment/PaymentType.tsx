import { Header, Screen } from "@components/index"
import Text from "@components/text/text"
import VectorIcon, { VectorIconProps } from "@components/vectorIcon/vectorIcon"
import { TxKeyPath } from "@i18n/i18n"
import { MAIN_SCREENS } from "@models/enum/screensName"
import { navigate } from "@navigators/navigation-utilities"
import { spacing } from "@theme/spacing"
import { FlatList, Row, View } from "native-base"
import * as React from "react"
import { TouchableOpacity } from "react-native"
import { styles } from "./styles"

interface PaymentTypeScreenProps {}

interface IPaymentType {
  id: string
  icon?: VectorIconProps
}

const paymentTypes: IPaymentType[] = [
  { id: "cashPayment", icon: { iconSet: "matc", name: "cash" } },
  { id: "cardPayment", icon: { iconSet: "matc", name: "credit-card" } },
  { id: "otherPayment", icon: { iconSet: "matc", name: "hand-coin" } },
]

const PaymentTypeScreen = (props: PaymentTypeScreenProps) => {
  const renderItem = ({ item, index }: { item: IPaymentType; index: number }) => {
    const { id, icon } = item

    const onItemPress = () => {
      navigate(MAIN_SCREENS[id])
    }

    return (
      <TouchableOpacity onPress={onItemPress}>
        <Row style={styles.paymentOption}>
          <VectorIcon {...icon} size={24} />
          <Text ml={spacing[1]} tx={`payment.types.${id}` as TxKeyPath} />
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
