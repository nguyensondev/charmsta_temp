import { ButtonCustom, Header, Screen } from "@components/index"
import { TextFieldCustom } from "@components/text-field"
import Text from "@components/text/text"
import { usePayment } from "@hooks/payment"
import { MAIN_SCREENS } from "@models/enum/screensName"
import { MainNavigatorParamList } from "@models/navigator"
import { RouteProp, StackActions, useNavigation, useRoute } from "@react-navigation/native"
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
  const navigate = useNavigation()
  const {
    params: { amount, billId, payment_method },
  } = route
  const [amounts, setAmounts] = React.useState({ given: 0, return: 0 })

  const { data, payment, loading } = usePayment()

  React.useEffect(() => {
    if (!isEmpty(data)) {
      Alert.alert("Success", "Your payment has been successfully processed ")
      navigate.dispatch(StackActions.popToTop())
    }
  }, [data])

  React.useLayoutEffect(() => {
    setAmounts((amounts) => {
      const calculatedReturn = (amounts?.given ?? 0) - amount

      return {
        ...amounts,
        return: calculatedReturn < 0 ? 0 : calculatedReturn,
      }
    })
  }, [amounts.given, amounts.return])

  const onButtonPress = () => {
    const { given, return: returnAmount } = amounts
    if (given > amount) {
      payment({ billId, payment_method, amount })
    } else {
      alert(`Please check customer give amount`)
    }
  }

  return (
    <Screen preset="fixed">
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
            value={amounts.return.toFixed(2).toString()}
            onChangeText={(text) => {
              setAmounts((amounts) => ({
                ...amounts,
                return: parseFloat(text),
              }))
            }}
          />
        </FormControl>
      </Box>
      <ButtonCustom
        disabled={amounts.given === 0}
        isLoading={loading}
        marginBottom={spacing[1]}
        onPress={onButtonPress}
      >
        <Text text={`Charge ${convertCurrency(amount)}`} style={{ color: color.palette.white }} />
      </ButtonCustom>
    </Screen>
  )
}

export default CashPaymentScreen
