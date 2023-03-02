import { ButtonCustom, Header, Screen } from "@components/index"
import { TextFieldCustom } from "@components/text-field"
import Text from "@components/text/text"
import { usePayment } from "@hooks/payment"
import { MAIN_SCREENS } from "@models/enum/screensName"
import { MainNavigatorParamList } from "@models/navigator"
import { RouteProp, useRoute } from "@react-navigation/native"
import { color } from "@theme/color"
import { spacing } from "@theme/spacing"
import { convertCurrency } from "@utils/data"
import { isEmpty } from "lodash"
import { Box, FormControl } from "native-base"
import * as React from "react"
import { Alert } from "react-native"

interface CashPaymentScreenProps {}

const CashPaymentScreen = (props: CashPaymentScreenProps) => {
  const route = useRoute<RouteProp<MainNavigatorParamList, MAIN_SCREENS.cashPayment>>()
  const {
    params: { amount, billId, payment_method },
  } = route
  const [amounts, setAmounts] = React.useState({ given: 0, return: 0 })

  const { data, payment, loading } = usePayment()

  React.useEffect(() => {
    if (!isEmpty(data)) {
      Alert.alert("Success", "Your payment has been successfully processed ")
    }
  }, [data])

  React.useLayoutEffect(() => {
    setAmounts((amounts) => {
      const calculatedReturn = amount - (amounts?.given ?? 0)

      return {
        ...amounts,
        return: calculatedReturn < 0 ? 0 : calculatedReturn,
      }
    })
  }, [amounts.given, amounts.return])

  const onButtonPress = () => {
    payment({ billId, payment_method, amount })
  }

  return (
    <Screen>
      <Header leftIcon="back" headerTx="screens.headerTitle.cashPayment" />
      <Box paddingX={spacing[1]} flex={1}>
        <Text text={`Amount to pay: ${convertCurrency(amount)}`} fontWeight="bold" />
        <FormControl>
          <Text text={"Amount give by customer"} />
          <TextFieldCustom
            keyboardType="number-pad"
            onChangeText={(text) => {
              setAmounts((amounts) => ({
                ...amounts,
                given: isEmpty(text) ? 0 : parseFloat(text),
              }))
            }}
          />
        </FormControl>
        <FormControl>
          <Text text={"Amount return to customer"} />
          <TextFieldCustom
            editable={false}
            value={amounts.return.toString()}
            onChangeText={(text) => {
              setAmounts((amounts) => ({
                ...amounts,
                return: parseFloat(text),
              }))
            }}
          />
        </FormControl>
      </Box>
      <ButtonCustom isLoading={loading} marginBottom={spacing[1]} onPress={onButtonPress}>
        <Text text={`Charge ${convertCurrency(amount)}`} style={{ color: color.palette.white }} />
      </ButtonCustom>
    </Screen>
  )
}

export default CashPaymentScreen
