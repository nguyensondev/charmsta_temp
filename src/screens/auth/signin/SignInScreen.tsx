import { appleAuth } from "@invertase/react-native-apple-authentication"
import auth, { FirebaseAuthTypes } from "@react-native-firebase/auth"
import { GoogleSignin } from "@react-native-google-signin/google-signin"
import { isEmpty, isNull } from "lodash"
import { Box, useToast } from "native-base"
import React, { useCallback, useContext, useEffect, useLayoutEffect, useState } from "react"
import { Alert, Linking, Platform, TouchableOpacity, View } from "react-native"
import { AccessToken, LoginManager, Settings } from "react-native-fbsdk-next"
import * as yup from "yup"

import { ButtonCustom } from "@components/button/buttonCustom"
import Text from "@components/text"
import { TextFieldCustom } from "@components/text-field"
import VectorIcon from "@components/vectorIcon/vectorIcon"
import { facebook, googleServices } from "@config/index"
import { ILoadingContext, LoadingContext } from "@contexts/loadingContext"
import { useAuth } from "@hooks/auth"
import { AUTH_SCREENS } from "@models/enum/screensName"
import { useStores } from "@models/root-store"
import { goBack, navigate } from "@navigators/navigation-utilities"
import { useFocusEffect } from "@react-navigation/native"
import { color } from "@theme/color"
import { spacing } from "@theme/spacing"
import { consoleLog } from "@utils/debug"
import { convertYupErrorInner } from "@utils/yup/yup"
import { AuthLayout } from "../components"
import { styles } from "./styles"

const schema = yup.object().shape({
  email: yup.string().email("Enter a valid email.").required("Email is required."),
  password: yup
    .string()
    .min(5, "Password must be at least 5 characters long.")
    .required("Password is required."),
})

const SignInScreen = () => {
  const [formData, setForm] = useState({
    email: "",
    password: "",
  })
  const { show } = useToast()
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({})
  const {
    login,
    continueWithSocial,
    loading,
    setLoading,
    socialContinueStatusCode,
    registerData,
    errors: { signInErr },
  } = useAuth()
  const {
    userStore: { saveUser, eraseUser },
    authStore: { resetAuth, Auth },
  } = useStores()
  const loadingCtx = useContext<ILoadingContext>(LoadingContext)

  useFocusEffect(
    useCallback(() => {
      if (Auth?.token) {
        resetAuth()
        eraseUser()
      }
      if (GoogleSignin.isSignedIn()) {
        GoogleSignin.signOut()
      }
    }, []),
  )

  useLayoutEffect(() => {
    if (loading) {
      loadingCtx.open()
    } else {
      loadingCtx.close()
    }
  }, [loading])

  useLayoutEffect(() => {
    if (!isEmpty(signInErr)) {
      switch (signInErr.status) {
        case 403:
          return Alert.alert("Error", "Your password is not correct, please try another")
        case 400:
          return Alert.alert(
            "Warning",
            "Your account has been deleted, please contact support for more infomation",
          )
        case 503:
        case 500:
          return Alert.alert("Error", "Your email is not available", [
            { text: "Cancel" },
            { text: "Sign up", onPress: onSignUpPress },
          ])
      }
    }
  }, [signInErr])

  useEffect(() => {
    if (facebook && facebook.appId) Settings.setAppID(facebook?.appId)
    LoginManager.setLoginBehavior(Platform.OS === "ios" ? "browser" : "web_only")
    GoogleSignin.configure({
      scopes: [], // what API you want to access on behalf of the user, default is email and profile
      webClientId: googleServices.webClientId, // client ID of type WEB for your server (needed to verify user ID and offline access)
      // offlineAccess: true, // if you want to access Google API on behalf of the user FROM YOUR SERVER
      // hostedDomain: "", // specifies a hosted domain restriction
      // forceCodeForRefreshToken: true, // [Android] related to `serverAuthCode`, read the docs link below *.
      // accountName: "", // [Android] specifies an account name on the device that should be used
      iosClientId: googleServices.iosClientId, // [iOS] if you want to specify the client ID of type iOS (otherwise, it is taken from GoogleService-Info.plist)
      // googleServicePlistPath: "", // [iOS] if you renamed your GoogleService-Info file, new name here, e.g. GoogleService-Info-Staging
      // openIdRealm: "", // [iOS] The OpenID2 realm of the home web server. This allows Google to include the user's OpenID Identifier in the OpenID Connect ID token.
      // profileImageSize: 120, // [iOS] The desired height (and width) of the profile image. Defaults to 120px
    })
  }, [])

  useEffect(() => {
    if (!isNull(socialContinueStatusCode) && !isNull(registerData)) {
      switch (socialContinueStatusCode) {
        case 2000:
          if (registerData.userInfo.company.name === "softyn72") {
            navigate(AUTH_SCREENS.storeForm, { providerName: "social", registerData })
          } else {
            // alert("Login successful")
            show({
              render: () => (
                <Box bg="emerald.500" px="2" py="1" rounded="sm" mb={5}>
                  <Text text="Login successful" />
                </Box>
              ),
            })
            saveUser(registerData.userInfo)
          }
          return
        default:
          return alert("Network error, please try again.")
      }
    }
  }, [socialContinueStatusCode, registerData])

  const handleTextChange = (key: string, value: string) => {
    setForm((prev) => {
      if (Object.keys(errors).includes(key)) {
        delete errors[key]
      }
      return { ...prev, [key]: value }
    })
  }

  const handleFirebaseSignInWithCredential = async (
    credentialName: "apple" | "facebook" | "google",
    credential: {
      providerId: string
      token: string
      secret: string
    },
  ) => {
    const { user } = await auth().signInWithCredential(credential)
    if (user) {
      const currentIdToken = await auth().currentUser.getIdToken(true)
      continueWithSocial(credentialName, user.toJSON() as FirebaseAuthTypes.User, currentIdToken)
    }
  }

  const onSignIn = async () => {
    try {
      setLoading(true)
      setErrors({})
      await schema.validate(formData, { abortEarly: false })
      login(formData)
    } catch (err) {
      setErrors(convertYupErrorInner(err.inner))
    } finally {
      setLoading(false)
    }
  }

  const onGooglePress = async () => {
    try {
      const { idToken } = await GoogleSignin.signIn()
      const googleCredential = auth.GoogleAuthProvider.credential(idToken)

      await handleFirebaseSignInWithCredential("google", googleCredential)
    } catch (err) {
      goBack()
      consoleLog("continue with google error: ", err)
    }
    // Sign-in the user with the credential
  }

  const onApplePress = async () => {
    try {
      const res = await appleAuth.performRequest({
        requestedOperation: appleAuth.Operation.LOGIN,
        requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
      })
      if (!res.identityToken) {
        throw new Error("Apple Sign-In failed - no identify token returned")
      }
      const { identityToken, nonce } = res
      const appleCredential = auth.AppleAuthProvider.credential(identityToken, nonce)
      // Sign the user in with the credential
      await handleFirebaseSignInWithCredential("apple", appleCredential)
    } catch (err) {
      goBack()
    }
  }

  const onFacebookPress = async () => {
    const result = await LoginManager.logInWithPermissions(["email", "public_profile"])
    if (!result.isCancelled) {
      const { accessToken } = await AccessToken.getCurrentAccessToken()
      const facebookCredential = auth.FacebookAuthProvider.credential(accessToken)
      await handleFirebaseSignInWithCredential("facebook", facebookCredential)
    } else {
      goBack()
    }
  }

  const onForgotPasswordPress = () => {
    navigate(AUTH_SCREENS.forgotPassword)
  }

  const onSignUpPress = () => {
    navigate(AUTH_SCREENS.signUp)
  }

  const onLegalPress = () => {
    Linking.openURL("https://uzmos.com/term-and-condition/")
    // eraseUser()
    // auth().signOut()
    // LoginManager.logOut()
    // GoogleSignin.signOut()
  }

  return (
    <AuthLayout>
      {/* login form */}
      <>
        <TextFieldCustom
          onChangeText={(value) => handleTextChange("email", value)}
          placeholderTextColor="black"
          placeholder="Email"
          keyboardType="email-address"
          errorMsg={errors?.email}
        />
        <TextFieldCustom
          onChangeText={(value) => handleTextChange("password", value)}
          placeholderTextColor="black"
          placeholder="Password"
          isPassword
          errorMsg={errors?.password}
        />
        <Box flexDirection="row" justifyContent="space-between">
          <TouchableOpacity onPress={onForgotPasswordPress}>
            <Text style={styles.textUnderline}>Forgot Password</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onSignUpPress}>
            <Text style={styles.textUnderline}>Sign Up</Text>
          </TouchableOpacity>
        </Box>
        <ButtonCustom onPress={onSignIn} marginY={spacing[2]}>
          Sign in
        </ButtonCustom>
      </>
      {/* login form */}
      {/* other login */}
      <>
        <Box alignItems="center">
          <Text>or continue with</Text>
          <View style={styles.socialBtnContainer}>
            {appleAuth.isSupported && (
              <VectorIcon
                color={color.palette.white}
                style={styles.icon}
                size={24}
                iconSet="ion"
                name="logo-apple"
                onPress={onApplePress}
              />
            )}
            <VectorIcon
              color={color.palette.white}
              style={styles.icon}
              size={24}
              iconSet="ion"
              name="logo-google"
              onPress={onGooglePress}
            />
            <VectorIcon
              color={color.palette.white}
              style={styles.icon}
              size={24}
              iconSet="ion"
              name="logo-facebook"
              onPress={onFacebookPress}
            />
          </View>
        </Box>
        <Text style={styles.termConditionPhrase}>
          By creating an account you agree to our{" "}
          <Text style={styles.textUnderline} onPress={onLegalPress}>
            Privacy Policy
          </Text>{" "}
          and{" "}
          <Text style={styles.textUnderline} onPress={onLegalPress}>
            Terms of use
          </Text>
          .
        </Text>
      </>
      {/* other login */}
    </AuthLayout>
  )
}

export default SignInScreen
