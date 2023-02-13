import { Header, Screen } from "@components/index"
import * as React from "react"

interface PrivacyMainScreenProps {}

const PrivacyMainScreen = (props: PrivacyMainScreenProps) => {
  return (
    <Screen>
      <Header headerTx="screens.headerTitle.privacy" leftIcon="back" />
    </Screen>
  )
}

export default PrivacyMainScreen
