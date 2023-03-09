import { ButtonCustom, Header, Screen } from "@components/index"
import { TextFieldCustom } from "@components/text-field"
import Text from "@components/text/text"
import { useTax } from "@hooks/tax"
import { translate } from "@i18n/translate"
import { INewTax } from "@models/backend/request/Tax"
import { MAIN_SCREENS } from "@models/enum/screensName"
import { MainNavigatorParamList } from "@models/navigator"
import { goBack, navigate } from "@navigators/navigation-utilities"
import { RouteProp, useRoute } from "@react-navigation/native"
import { color } from "@theme/color"
import { spacing } from "@theme/spacing"
import { isEmpty } from "lodash"
import { Row, ScrollView } from "native-base"
import React, { useEffect, useRef } from "react"
import { Alert } from "react-native"
import * as yup from "yup"
interface TaxDetailScreenProps {}

const schema = yup.object().shape({
  name: yup.string().required(),
  rate: yup.number().required(),
})

const TaxDetailScreen = (props: TaxDetailScreenProps) => {
  const {
    params: { detail },
  } = useRoute<RouteProp<MainNavigatorParamList, MAIN_SCREENS.taxDetail>>()
  const newTaxRef = useRef<Partial<INewTax>>({}).current
  const { deleteTax, isDeleted, error, loading } = useTax()

  useEffect(() => {
    if (!isEmpty(error)) {
      Alert.alert("Error", translate("errors.unexpected"))
    }
  }, [error])

  useEffect(() => {
    if (isDeleted) {
      Alert.alert("Success", "Your tax has been deleted")
      goBack()
    }
  }, [isDeleted])

  const handleInputChange = (key: keyof INewTax, value: string) => {
    switch (key) {
      case "name":
        newTaxRef["name"] = value
        break
      case "rate":
        newTaxRef["rate"] = parseFloat(value)
        break
    }
  }
  const onDeletePress = () => {
    Alert.alert("Warning", "Are you sure you want to delete this tax?", [
      { text: "No" },
      { text: "Yes", onPress: () => deleteTax(detail.id), style: "destructive" },
    ])
  }
  const onEditPress = () => {
    navigate(MAIN_SCREENS.editTax, { detail } as MainNavigatorParamList[MAIN_SCREENS.editTax])
  }

  return (
    <Screen>
      <Header leftIcon="back" headerTx="screens.headerTitle.newTax" />
      <ScrollView px={spacing[1]}>
        <TextFieldCustom
          hideError
          pointerEvents="none"
          labelTx="textInput.label.taxName"
          onChangeText={(text) => handleInputChange("name", text)}
          defaultValue={detail.name}
        />
        <TextFieldCustom
          hideError
          pointerEvents="none"
          keyboardType="decimal-pad"
          labelTx="textInput.label.taxRate"
          rightElement={<Text text="%" />}
          onChangeText={(text) => handleInputChange("rate", text)}
          defaultValue={detail.rate.toString()}
        />
      </ScrollView>
      <Row justifyContent={"space-between"} p={spacing[1]} mb={spacing[1]}>
        <ButtonCustom
          isLoading={loading}
          w={"48%"}
          backgroundColor={color.error}
          onPress={onDeletePress}
        >
          {translate("button.delete")}
        </ButtonCustom>
        <ButtonCustom isLoading={loading} w={"48%"} onPress={onEditPress}>
          {translate("button.edit")}
        </ButtonCustom>
      </Row>
    </Screen>
  )
}

export default TaxDetailScreen
