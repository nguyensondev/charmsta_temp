import { ButtonCustom, Header, Screen } from "@components/index"
import { TextFieldCustom } from "@components/text-field/textFieldCustom"
import { useDiscount } from "@hooks/discount"
import { translate } from "@i18n/translate"
import { NewDiscount } from "@models/backend/request/Discount"
import { DiscountDTO } from "@models/backend/response/Discount"
import { useStores } from "@models/index"
import { goBack } from "@navigators/navigation-utilities"
import { spacing } from "@theme/spacing"
import { convertYupErrorInner } from "@utils/yup/yup"
import { isEmpty } from "lodash"
import { FormControl, Row, ScrollView } from "native-base"
import React, { useEffect, useRef, useState } from "react"
import { Alert, StyleSheet } from "react-native"
import * as yup from "yup"

interface NewDiscountScreenProps {}

const schema = yup.object().shape({
  name: yup.string().required(),
  amount: yup.number().required().min(1),
})

const NewDiscountScreen = (props: NewDiscountScreenProps) => {
  const [errors, setErrors] = useState<{ name?: string; amount?: string }>({})
  const [amountType, setAmountType] = useState(false)
  const { loading, createDiscount, newDiscount, error } = useDiscount()

  const {
    currentStoreStore: {
      CurrentStore: { currency },
    },
  } = useStores()

  useEffect(() => {
    if (!isEmpty(error)) {
      Alert.alert("Error", translate("errors.unexpected"))
    }
  }, [error])

  const newDiscountRef = useRef<Partial<DiscountDTO>>({ percentage: false }).current

  useEffect(() => {
    if (!isEmpty(newDiscount)) {
      Alert.alert("Success", "Your discount have been created successful!", [
        { text: "Ok", onPress: goBack },
      ])
    }
  }, [newDiscount])

  const handleFieldChange = (key: keyof DiscountDTO, value?: string) => {
    switch (key) {
      case "percentage":
        setAmountType((prev) => {
          newDiscountRef.percentage = !prev
          return !prev
        })
        break
      case "amount":
        newDiscountRef.amount = isEmpty(value) ? 0 : parseFloat(value)
        break
      default:
        newDiscountRef[key as string] = value
        break
    }
  }

  const onCreate = () => {
    schema
      .validate(newDiscountRef, { abortEarly: false })
      .then(() => {
        createDiscount(newDiscountRef as NewDiscount)
      })
      .catch((err) => {
        setErrors(convertYupErrorInner(err.inner))
      })
  }

  const RenderBody = () => (
    <ScrollView px={spacing[1]}>
      <FormControl isInvalid={!!errors?.name}>
        <TextFieldCustom
          hideError
          labelTx="textInput.label.name"
          onChangeText={(text) => handleFieldChange("name", text)}
          defaultValue={newDiscountRef?.name}
        />
        <FormControl.ErrorMessage>{errors?.name}</FormControl.ErrorMessage>
      </FormControl>
      <FormControl isInvalid={!!errors?.amount}>
        <Row justifyContent={"space-between"}>
          <TextFieldCustom
            hideError
            labelTx="textInput.label.amount"
            keyboardType="decimal-pad"
            style={{ width: "65%" }}
            defaultValue={newDiscountRef?.amount?.toString()}
            onChangeText={(text) => handleFieldChange("amount", text)}
          />
          <TextFieldCustom
            hideError
            labelTx="textInput.label.type"
            style={{ width: "30%" }}
            isHasButton
            buttonClick={() => handleFieldChange("percentage")}
            value={amountType ? "%" : currency}
          />
        </Row>
        <FormControl.ErrorMessage>{errors?.amount}</FormControl.ErrorMessage>
      </FormControl>
      <FormControl>
        <TextFieldCustom
          hideError
          labelTx="textInput.label.description"
          defaultValue={newDiscountRef?.description}
          onChangeText={(text) => handleFieldChange("description", text)}
        />
      </FormControl>
    </ScrollView>
  )

  return (
    <Screen>
      <Header leftIcon="back" headerTx="screens.headerTitle.newDiscount" />
      <RenderBody />
      <ButtonCustom mb={spacing[1]} w="90%" onPress={onCreate} isLoading={loading}>
        {translate("button.create")}
      </ButtonCustom>
    </Screen>
  )
}

export default NewDiscountScreen

const styles = StyleSheet.create({
  container: {},
})
