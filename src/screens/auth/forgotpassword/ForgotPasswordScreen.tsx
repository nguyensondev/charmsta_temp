import * as React from "react"
import Text from "@components/text"
import { TextFieldCustom } from "@components/text-field"
import * as yup from "yup"
import { Box } from "native-base"
import { ButtonCustom } from "@components/button/buttonCustom"
import { useAuth } from "@hooks/auth"
import { styles } from "./styles"
import { color } from "@theme/color"
import { AuthLayout } from "../components"
import { isBoolean } from "lodash"
import { goBack } from "@navigators/navigation-utilities"

const schema = yup
  .string()
  .required("Email is required.")
  .min(3, "Minimum field length: 3")
  .max(320, "Maximum field length: 320")
  .email("Enter a valid email.")

const ForgotPasswordScreen = () => {
  const [email, setEmail] = React.useState("")
  const [error, setError] = React.useState(null)
  const { loading, forgotPassword, forgotPasswordStatus } = useAuth()
  React.useEffect(() => {
    if (isBoolean(forgotPasswordStatus)) {
      if (forgotPasswordStatus) {
        alert("Your account has been successfully reset.")
        goBack()
      }
    }
  }, [forgotPasswordStatus])

  const onSubmit = async () => {
    try {
      setError(null)
      await schema.validate(email)
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
