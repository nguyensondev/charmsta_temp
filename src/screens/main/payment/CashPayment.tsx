import { Header, Screen } from "@components/index"
import * as React from "react"

interface CashPaymentScreenProps {}

const CashPaymentScreen = (props: CashPaymentScreenProps) => {
  return (
    <Screen>
      <Header leftIcon="back" headerTx="screens.headerTitle.cashPayment" />
    </Screen>
  )
}

export default CashPaymentScreen
