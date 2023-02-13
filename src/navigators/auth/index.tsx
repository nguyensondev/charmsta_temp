import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { StackNavigationProp } from "@react-navigation/stack"
import React, { useLayoutEffect, useState } from "react"

import GoBackButton from "@components/go-back-button/goBackButton"
import { translate } from "@i18n/translate"
import {
  ForgotPasswordScreen,
  OnboadingScreen,
  SignInScreen,
  SignUpScreen,
  StoreFormScreen,
} from "@screens/auth"
import { CompanyHoursScreen, TimeZonesScreen } from "@screens/main"
import LoadingModal from "@screens/modal/LoadingModal"

import { AUTH_SCREENS, COMMON_SCREENS } from "@models/enum/screensName"
import { AuthNavigatorParamList, CommonNavigatorParamList } from "@models/navigator"
import { SearchLocationScreen } from "@screens/common/location"
import { color } from "@theme/color"
import { load } from "@utils/storage"
import { isNull } from "lodash"

export type authScreenProp = StackNavigationProp<AuthNavigatorParamList & CommonNavigatorParamList>

const Stack = createNativeStackNavigator<AuthNavigatorParamList & CommonNavigatorParamList>()

const AuthStack = () => {
  const [initialRouteName, setInitialRouteName] = useState(null)
  useLayoutEffect(() => {
    load("@skipOnBoarding").then((res) => {
      setInitialRouteName(res === 1 ? "signIn" : "onboarding")
    })
  }, [])

  if (isNull(initialRouteName)) return null
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName={initialRouteName}
    >
      <Stack.Group>
        <Stack.Screen
          options={{ animation: "none" }}
          name={AUTH_SCREENS.onboarding}
          component={OnboadingScreen}
        />

        <Stack.Screen
          options={{ animation: "none" }}
          name={AUTH_SCREENS.signIn}
          component={SignInScreen}
        />
        <Stack.Screen
          name={AUTH_SCREENS.signUp}
          component={SignUpScreen}
          options={{
            headerShown: true,
            headerLeft: () => <GoBackButton />,
            headerTransparent: true,
            headerTitle: "",
          }}
        />
        <Stack.Screen
          name={AUTH_SCREENS.forgotPassword}
          component={ForgotPasswordScreen}
          options={{
            headerShown: true,
            headerLeft: () => <GoBackButton />,
            headerTransparent: true,
            headerTitle: "",
          }}
        />
        <Stack.Screen
          name={AUTH_SCREENS.storeForm}
          component={StoreFormScreen}
          options={{
            headerShown: true,
            headerShadowVisible: false,
            headerTitleAlign: "center",
            headerTitle: translate("auth.storeForm.headerTitle"),
            headerLeft: () => <GoBackButton color={color.palette.black} />,
          }}
        />
        <Stack.Screen name={AUTH_SCREENS.companyHours} component={CompanyHoursScreen} />
        <Stack.Screen name={AUTH_SCREENS.timeZone} component={TimeZonesScreen} />
        <Stack.Screen name={COMMON_SCREENS.searchLocation} component={SearchLocationScreen} />
        <Stack.Screen
          options={{
            presentation: "modal",
            headerShown: true,
            headerTitle: "",
          }}
          name={AUTH_SCREENS.modal}
          component={LoadingModal}
        />
      </Stack.Group>
    </Stack.Navigator>
  )
}

export default AuthStack
