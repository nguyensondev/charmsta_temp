import { ButtonCustom, Header, Screen } from "@components/index"
import { TextFieldCustom } from "@components/text-field"
import Text from "@components/text/text"
import { useTax } from "@hooks/tax"
import { translate } from "@i18n/translate"
import { INewTax } from "@models/backend/request/Tax"
import { goBack } from "@navigators/navigation-utilities"
import { spacing } from "@theme/spacing"
import { convertYupErrorInner } from "@utils/yup/yup"
import { isEmpty } from "lodash"
import { FormControl, ScrollView } from "native-base"
import React, { useEffect, useRef, useState } from "react"
import { Alert } from "react-native"
import * as yup from "yup"
interface NewTaxScreenProps {}

const schema = yup.object().shape({
  name: yup.string().required(),
  rate: yup.number().required(),
})

const NewTaxScreen = (props: NewTaxScreenProps) => {
  const [errors, setErrors] = useState<{ name?: string; rate?: string }>({})
  const newTaxRef = useRef<Partial<INewTax>>({}).current
  const { createTax, loading, newTax, error } = useTax()

  useEffect(() => {
    if (!isEmpty(error)) {
      Alert.alert("Error", translate("errors.unexpected"))
    }
  }, [error])

  useEffect(() => {
    if (!isEmpty(newTax)) {
      Alert.alert("Success", "Your tax have been created", [
        {
          text: "Ok",
          onPress: goBack,
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
      await schema.validate(newTaxRef, { abortEarly: false })
      createTax(newTaxRef as INewTax)
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
          />
          <FormControl.ErrorMessage>{errors?.rate}</FormControl.ErrorMessage>
        </FormControl>
      </ScrollView>
      <ButtonCustom isLoading={loading} onPress={onConfirmPress} mb={spacing[1]}>
        {translate("button.confirm")}
      </ButtonCustom>
    </Screen>
  )
}

export default NewTaxScreen
