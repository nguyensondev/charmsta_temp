import { ButtonCustom } from "@components/button/buttonCustom"
import Text from "@components/text"
import { TextFieldCustom } from "@components/text-field"
import { useAuth } from "@hooks/auth"
import { translate } from "@i18n/translate"
import { goBack } from "@navigators/navigation-utilities"
import { color } from "@theme/color"
import { isBoolean, isEmpty } from "lodash"
import { Box } from "native-base"
import React, { useEffect, useLayoutEffect, useState } from "react"
import { Alert } from "react-native"
import * as yup from "yup"
import { AuthLayout } from "../components"
import { styles } from "./styles"

const schema = yup
  .string()
  .required("Email is required.")
  .min(3, "Minimum field length: 3")
  .max(320, "Maximum field length: 320")
  .email("Enter a valid email.")

const ForgotPasswordScreen = () => {
  const [email, setEmail] = useState("")
  const [error, setError] = useState(null)
  const { loading, forgotPassword, forgotPasswordStatus, errors } = useAuth()

  useLayoutEffect(() => {
    if (!isEmpty(errors.forgetPasswordErr)) {
      Alert.alert("Error", translate("errors.unexpected"))
    }
  }, [errors.forgetPasswordErr])

  useEffect(() => {
    if (isBoolean(forgotPasswordStatus)) {
      if (forgotPasswordStatus) {
        alert("Your account has been successfully reset.")
        goBack()
      } else {
        alert("Your email address is incorrect.")
      }
    }
  }, [forgotPasswordStatus])

  const onSubmit = async () => {
    try {
      setError(null)
      await schema.validate("" || email)
      forgotPassword(email)
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <AuthLayout>
      <Box flex={1} alignItems={"center"}>
        <Text style={styles.headerTitle}>Forgotten Password ?</Text>
        <Text>Enter your email to reset your password:</Text>
        <TextFieldCustom
          onChangeText={(text) =>
            setEmail(() => {
              setError(null)
              return text
            })
          }
          placeholder="Email"
          errorMsg={error}
        />
        <ButtonCustom isLoading={loading} onPress={onSubmit}>
          <Text style={{ color: color.palette.white }}>Submit</Text>
        </ButtonCustom>
      </Box>
    </AuthLayout>
  )
}

export default ForgotPasswordScreen
