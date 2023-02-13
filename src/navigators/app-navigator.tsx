/**
 * The app navigator (formerly "AppNavigator" and "MainNavigator") is used for the primary
 * navigation flows of your app.
 * Generally speaking, it will contain an auth flow (registration, login, forgot password)
 * and a "main" flow which the user will use once logged in.
 */
import { useStores } from "@models/root-store"
import { DarkTheme, DefaultTheme, NavigationContainer } from "@react-navigation/native"
import { observer } from "mobx-react-lite"
import React from "react"
import { useColorScheme } from "react-native"
import AuthStack from "./auth"
import MainStack from "./main"
import { navigationRef, useBackButtonHandler } from "./navigation-utilities"

/**
 * This type allows TypeScript to know what routes are defined in this navigator
 * as well as what properties (if any) they might take when navigating to them.
 *
 * If no params are allowed, pass through `undefined`. Generally speaking, we
 * recommend using your MobX-State-Tree store(s) to keep application state
 * rather than passing state through navigation params.
 *
 * For more information, see this documentation:
 *   https://reactnavigation.org/docs/params/
 *   https://reactnavigation.org/docs/typescript#type-checking-the-navigator
 */
export type NavigatorParamList = {
  welcome: undefined
  demo: undefined
  demoList: undefined
  // 🔥 Your screens go here
}

const RootNavigator = observer(() => {
  const { authStore, userStore } = useStores()

  let authStatus = 0 // 0 is unauthenticated , 1 is authenticated

  authStatus =
    authStore &&
    authStore.Auth &&
    authStore.Auth.token &&
    authStore.Auth.token.length > 0 &&
    userStore &&
    userStore.User &&
    userStore.User.id > 0
      ? 1 // 1
      : 0

  if (authStatus === 1) {
    return <MainStack />
  } else {
    return <AuthStack />
  }
})

interface NavigationProps extends Partial<React.ComponentProps<typeof NavigationContainer>> {}

export const AppNavigator = (props: NavigationProps) => {
  const colorScheme = useColorScheme()

  useBackButtonHandler(canExit)
  return (
    <NavigationContainer
      ref={navigationRef}
      theme={colorScheme === "dark" ? DarkTheme : DefaultTheme}
      {...props}
    >
      <RootNavigator />
    </NavigationContainer>
  )
}

AppNavigator.displayName = "AppNavigator"

/**
 * A list of routes from which we're allowed to leave the app when
 * the user presses the back button on Android.
 *
 * Anything not on this list will be a standard `back` action in
 * react-navigation.
 *
 * `canExit` is used in ./app/app.tsx in the `useBackButtonHandler` hook.
 */
const exitRoutes = ["welcome"]
export const canExit = (routeName: string) => exitRoutes.includes(routeName)
