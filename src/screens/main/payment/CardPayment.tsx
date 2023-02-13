import { Header, Screen } from "@components/index"
import * as React from "react"

interface CardPaymentScreenProps {}

const CardPaymentScreen = (props: CardPaymentScreenProps) => {
  return (
    <Screen>
      <Header leftIcon="back" headerTx="screens.headerTitle.cardPayment" />
    </Screen>
  )
}

export default CardPaymentScreen
