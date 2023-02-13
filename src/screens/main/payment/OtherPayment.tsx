import { Header, Screen } from "@components/index"
import * as React from "react"

interface OtherPaymentScreenProps {}

const OtherPaymentScreen = (props: OtherPaymentScreenProps) => {
  return (
    <Screen>
      <Header leftIcon="back" headerTx="screens.headerTitle.otherPayment" />
    </Screen>
  )
}

export default OtherPaymentScreen
