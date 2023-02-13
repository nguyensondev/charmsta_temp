import { ButtonCustom, Header, Screen } from "@components/index"
import { TextFieldCustom } from "@components/text-field"
import { useUser } from "@hooks/user"
import { useStores } from "@models/index"
import { navigationRef } from "@navigators/navigation-utilities"
import auth from "@react-native-firebase/auth"
import { StackActions } from "@react-navigation/native"
import { spacing } from "@theme/spacing"
import { convertYupErrorInner } from "@utils/yup/yup"
import { get, isEmpty } from "lodash"
import { FormControl, ScrollView } from "native-base"
import React, { useLayoutEffect, useRef, useState } from "react"
import { Alert } from "react-native"
import * as yup from "yup"

interface ChangePasswordScreenProps {}

interface IDataChangePassword {
  oldPassword: string
  newPassword: string
  confirmPassword: string
}

const commonInputProps = { isPassword: true, hideError: true }

const schema = yup.object().shape({
  oldPassword: yup.string().min(5, "Password must be at least 6 characters long.").required(),
  newPassword: yup
    .string()
    .min(5, "Password must be at least 6 characters long.")
    .max(12, "Password maximum length is 12 characters.")
    .matches(/^[a-zA-Z0-9!@#$%^&]{6,12}$/, "Password length must be between 6 and 12 characters")
    .required(),
  confirmPassword: yup
    .string()
    .test({
      message: "Passwords do not match",
      test: (value, context) => {
        const {
          parent: { newPassword },
        } = context
        return newPassword === value
      },
    })
    .required(),
})

const ChangePasswordScreen = (props: ChangePasswordScreenProps) => {
  const [errors, setErrors] = useState({})
  const data = useRef<Partial<IDataChangePassword>>({}).current
  const {
    userStore: { User },
  } = useStores()
  const { updateUserProfile, updateSuccess, error } = useUser()

  useLayoutEffect(() => {
    if (!isEmpty(error)) {
      if (error?.status) {
        switch (error.status) {
          case 403:
            return Alert.alert("Error", "Your old password is not correct")
        }
      }
    }
  }, [error])

  useLayoutEffect(() => {
    if (updateSuccess) {
      Alert.alert("Success", "You password has been changed successful", [
        { text: "Ok", onPress: () => navigationRef.dispatch(StackActions.popToTop()) },
      ])
    }
  }, [updateSuccess])

  const handleInputChange = (id: string, text: string) => {
    data[id] = text
  }

  const onSubmit = () => {
    setErrors({})
    schema
      .validate(data, { abortEarly: false })
      .then(({ newPassword, oldPassword }: IDataChangePassword) => {
        const { id, fullName, address, phoneNumber, image } = User
        updateUserProfile({
          id,
          fullName,
          address,
          phoneNumber,
          newPassword,
          oldPassword,
          image,
        })

        auth().currentUser.updatePassword(newPassword)
      })
      .catch((err) => {
        setErrors(convertYupErrorInner(err.inner))
      })
  }

  return (
    <Screen>
      <Header leftIcon="back" />
      <ScrollView flex={1} px={spacing[1]}>
        <FormControl isInvalid={get(errors, "oldPassword", false)}>
          <TextFieldCustom
            {...commonInputProps}
            onChangeText={(text) => handleInputChange("oldPassword", text)}
            labelTx="textInput.label.oldPassword"
          />
          <FormControl.ErrorMessage>{get(errors, "oldPassword")}</FormControl.ErrorMessage>
        </FormControl>
        <FormControl isInvalid={get(errors, "newPassword", false)}>
          <TextFieldCustom
            {...commonInputProps}
            onChangeText={(text) => handleInputChange("newPassword", text)}
            labelTx="textInput.label.newPassword"
          />
          <FormControl.ErrorMessage>{get(errors, "newPassword")}</FormControl.ErrorMessage>
        </FormControl>

        <FormControl isInvalid={get(errors, "confirmPassword", false)}>
          <TextFieldCustom
            {...commonInputProps}
            onChangeText={(text) => handleInputChange("confirmPassword", text)}
            labelTx="textInput.label.confirmPassword"
          />
          <FormControl.ErrorMessage>{get(errors, "confirmPassword")}</FormControl.ErrorMessage>
        </FormControl>
      </ScrollView>
      <ButtonCustom
        mb={spacing[1]}
        tx={"button.confirm"}
        textStyle={{ fontSize: 15 }}
        onPress={onSubmit}
      />
    </Screen>
  )
}

export default ChangePasswordScreen
