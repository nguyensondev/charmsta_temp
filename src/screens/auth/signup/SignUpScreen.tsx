import { ButtonCustom } from "@components/button/buttonCustom"
import { TextFieldCustom } from "@components/text-field"
import { REGEXP } from "@config/constants"
import { SignUpEmail } from "@models/backend/request/Auth"
import { AUTH_SCREENS } from "@models/enum/screensName"
import { navigate } from "@navigators/navigation-utilities"
import { convertYupErrorInner } from "@utils/yup/yup"
import React, { memo, useRef, useState } from "react"
import * as yup from "yup"
import { AuthLayout } from "../components"

const schema = yup.object().shape({
  email: yup.string().email("Enter a valid email.").required("Email is required."),
  password: yup
    .string()
    .matches(
      REGEXP.password,
      "Password length must be between 6 and 12 characters, at least one character and one number",
    )
    .required("Password is required."),
  confirmPassword: yup
    .string()
    .test({
      message: "The confirmation password is not matched",
      test: (value, context) => {
        const { password, confirmPassword } = context.parent
        if (password === confirmPassword) {
          return true
        }
        return false
      },
    })
    .required("Confirmation password is required."),
})

const SignUpScreen = () => {
  const formData = useRef<
    Partial<{ email?: string; password?: string; confirmPassword?: string; fullName?: string }>
  >({}).current
  // const [formData, setFormData] = React.useState({
  // email: "",
  // password: "",
  // confirmPassword: "",
  // fullName: "",
  // })

  const [errors, setErrors] = useState<{
    fullName?: string
    email?: string
    password?: string
    confirmPassword?: string
  }>({})

  const handleFormDataChange = (key: string, value: string) => {
    if (Object.keys(errors).includes(key)) {
      setErrors((prev) => {
        delete prev[key]
        return prev
      })
    }

    formData[key] = value
  }

  const onNext = async () => {
    try {
      await schema.validate(formData, { abortEarly: false })
      const data = {
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
      } as SignUpEmail
      navigate(AUTH_SCREENS.storeForm, { data, providerName: "email" })
      setErrors({})
    } catch (err) {
      setErrors(convertYupErrorInner(err.inner))
    }
  }

  return (
    <AuthLayout>
      <TextFieldCustom
        defaultValue={formData?.fullName}
        errorMsg={errors?.fullName}
        onChangeText={(value) => handleFormDataChange("fullName", value)}
        placeholder="Name"
      />
      <TextFieldCustom
        defaultValue={formData?.email}
        errorMsg={errors?.email}
        keyboardType="email-address"
        onChangeText={(value) => handleFormDataChange("email", value)}
        placeholder="Email"
      />
      <TextFieldCustom
        defaultValue={formData?.password}
        errorMsg={errors?.password}
        onChangeText={(value) => handleFormDataChange("password", value)}
        isPassword
        placeholder="Password"
      />
      <TextFieldCustom
        defaultValue={formData?.confirmPassword}
        errorMsg={errors?.confirmPassword}
        onChangeText={(value) => handleFormDataChange("confirmPassword", value)}
        isPassword
        placeholder="Confirm Password"
      />
      <ButtonCustom onPress={onNext}>Next</ButtonCustom>
    </AuthLayout>
  )
}

export default memo(SignUpScreen)
