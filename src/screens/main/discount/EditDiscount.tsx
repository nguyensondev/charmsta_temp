import { ButtonCustom, Header, Screen } from "@components/index"
import { TextFieldCustom } from "@components/text-field"
import { useDiscount } from "@hooks/discount"
import { translate } from "@i18n/translate"
import { DiscountDTO } from "@models/backend/response/Discount"
import { MAIN_SCREENS } from "@models/enum/screensName"
import { useStores } from "@models/index"
import { MainNavigatorParamList } from "@models/navigator"
import { navigate } from "@navigators/navigation-utilities"
import { RouteProp, useRoute } from "@react-navigation/native"
import { spacing } from "@theme/spacing"
import { convertYupErrorInner } from "@utils/yup/yup"
import { isEmpty } from "lodash"
import { FormControl, Row, ScrollView } from "native-base"
import React, { useCallback, useEffect, useRef, useState } from "react"
import { Alert, StyleSheet } from "react-native"
import * as yup from "yup"

interface EditDiscountScreenProps {}

const schema = yup.object().shape({
  name: yup.string().required(),
  amount: yup.number().required().min(1),
})

const EditDiscountScreen = (props: EditDiscountScreenProps) => {
  const {
    params: { detail },
  } = useRoute<RouteProp<MainNavigatorParamList, MAIN_SCREENS.editDiscount>>()
  const { percentage, name, amount, description } = detail
  const [errors, setErrors] = useState<{ name?: string; amount?: string }>({})
  const [amountType, setAmountType] = useState(percentage)
  const { loading, editDiscount, newDiscount, error } = useDiscount()

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

  const editDiscountRef = useRef<Partial<DiscountDTO>>({ percentage: percentage }).current

  useEffect(() => {
    if (!isEmpty(newDiscount)) {
      Alert.alert("Success", "Your discount have been updated successful", [
        {
          text: "Ok",
          onPress: () => navigate(MAIN_SCREENS.discountDetail, { detail: newDiscount }),
        },
      ])
    }
  }, [newDiscount])

  const handleFieldChange = (key: keyof DiscountDTO, value?: string) => {
    switch (key) {
      case "percentage":
        setAmountType((prev) => !prev)
        break
      case "amount":
        editDiscountRef.amount = isEmpty(value) ? 0 : parseFloat(value)
        break
      default:
        editDiscountRef[key as string] = value
        break
    }
  }

  const onEdit = async () => {
    try {
      const editedDiscount = { ...detail, ...editDiscountRef, percentage: amountType }
      await schema.validate(editedDiscount, { abortEarly: false })
      editDiscount(editedDiscount)
    } catch (err) {
      setErrors(convertYupErrorInner(err.inner))
    }
  }

  const RenderBody = useCallback(
    () => (
      <ScrollView px={spacing[1]}>
        <FormControl isInvalid={!!errors?.name}>
          <TextFieldCustom
            hideError
            labelTx="textInput.label.name"
            onChangeText={(text) => handleFieldChange("name", text)}
            defaultValue={name}
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
              onChangeText={(text) => handleFieldChange("amount", text)}
              defaultValue={amount.toString()}
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
        <TextFieldCustom
          hideError
          labelTx="textInput.label.description"
          onChangeText={(text) => handleFieldChange("description", text)}
          defaultValue={description}
        />
      </ScrollView>
    ),
    [amountType, errors],
  )
  return (
    <Screen>
      <Header leftIcon="back" headerTx="screens.headerTitle.editDiscount" />
      <RenderBody />
      <ButtonCustom w="90%" mb={spacing[1]} onPress={onEdit} isLoading={loading}>
        {translate("button.confirm")}
      </ButtonCustom>
    </Screen>
  )
}

export default EditDiscountScreen

const styles = StyleSheet.create({
  container: {},
})
