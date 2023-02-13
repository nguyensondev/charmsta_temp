import { ButtonCustom, Header, Screen } from "@components/index"
import { TextFieldCustom } from "@components/text-field"
import Text from "@components/text/text"
import { useTax } from "@hooks/tax"
import { translate } from "@i18n/translate"
import { INewTax } from "@models/backend/request/Tax"
import { MAIN_SCREENS } from "@models/enum/screensName"
import { MainNavigatorParamList } from "@models/navigator"
import { navigate } from "@navigators/navigation-utilities"
import { RouteProp, useRoute } from "@react-navigation/native"
import { spacing } from "@theme/spacing"
import { convertYupErrorInner } from "@utils/yup/yup"
import { isEmpty } from "lodash"
import { FormControl, ScrollView } from "native-base"
import React, { useEffect, useRef, useState } from "react"
import { Alert } from "react-native"
import * as yup from "yup"
interface EditTaxScreenProps {}

const schema = yup.object().shape({
  name: yup.string().required(),
  rate: yup.number().required(),
})

const EditTaxScreen = (props: EditTaxScreenProps) => {
  const {
    params: { detail },
  } = useRoute<RouteProp<MainNavigatorParamList, MAIN_SCREENS.taxDetail>>()
  const [errors, setErrors] = useState<{ name?: string; rate?: string }>({})
  const newTaxRef = useRef<Partial<INewTax>>({}).current
  const { updateTax, loading, newTax } = useTax()

  useEffect(() => {
    if (!isEmpty(newTax)) {
      Alert.alert("Success", "Your tax have been edited", [
        {
          text: "Ok",
          onPress: () =>
            navigate(MAIN_SCREENS.taxDetail, {
              detail: newTax,
            } as MainNavigatorParamList[MAIN_SCREENS.taxDetail]),
        },
      ])
    }
  }, [newTax])

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

  const onConfirmPress = async () => {
    try {
      const editedTax = { ...detail, ...newTaxRef }
      await schema.validate(editedTax, { abortEarly: false })
      updateTax(editedTax as INewTax)
    } catch (err) {
      setErrors(convertYupErrorInner(err.inner))
    }
  }

  return (
    <Screen>
      <Header leftIcon="back" headerTx="screens.headerTitle.newTax" />
      <ScrollView px={spacing[1]}>
        <FormControl isInvalid={!!errors?.name}>
          <TextFieldCustom
            hideError
            labelTx="textInput.label.taxName"
            onChangeText={(text) => handleInputChange("name", text)}
            defaultValue={detail.name}
          />
          <FormControl.ErrorMessage>{errors?.name}</FormControl.ErrorMessage>
        </FormControl>
        <FormControl isInvalid={!!errors?.rate}>
          <TextFieldCustom
            hideError
            keyboardType="decimal-pad"
            labelTx="textInput.label.taxRate"
            rightElement={<Text text="%" />}
            onChangeText={(text) => handleInputChange("rate", text)}
            defaultValue={detail.rate.toString()}
          />
          <FormControl.ErrorMessage>{errors?.rate}</FormControl.ErrorMessage>
        </FormControl>
      </ScrollView>
      <ButtonCustom isLoading={loading} onPress={onConfirmPress} mb={spacing[1]} w={"90%"}>
        {translate("button.confirm")}
      </ButtonCustom>
    </Screen>
  )
}

export default EditTaxScreen
