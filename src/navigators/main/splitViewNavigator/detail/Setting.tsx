import { withSystemBackFix } from "@hoc/splitView/withSystemBackFix"
import { MAIN_SCREENS } from "@models/enum/screensName"
import { MainNavigatorParamList } from "@models/navigator"
import {
  NavigationAction,
  NavigationContainer,
  NavigationContainerRefWithCurrent,
  useNavigation
} from "@react-navigation/native"
import { createStackNavigator } from "@react-navigation/stack"
import { CompanyHoursScreen, TimeZonesScreen } from "@screens/index"
import {
  BookingPoliciesScreen,
  BookingSlotSizeScreen,
  CancellationPolicyScreen,
  CustomerNotesScreen
} from "@screens/main/settings/BookingPolicies"
import { AppointmentSlotScreen, WeekStartDayScreen } from "@screens/main/settings/CalenderSettings"
import { StoreDetailScreen } from "@screens/main/store"
import React, { forwardRef, Ref, useImperativeHandle, useRef } from "react"
import { View } from "react-native"

interface ISettingDetailNavigator {}

export interface IRefSettingDetailNavigator {
  navigate: (name: string, params?: any) => void
  goBack: () => void
  dispatch: (action: NavigationAction) => void
}

const Stack = createStackNavigator<MainNavigatorParamList>()

const SettingDetailNavigator = (
  props: ISettingDetailNavigator,
  ref: Ref<IRefSettingDetailNavigator>,
) => {
  useNavigation: useNavigation()
  const SettingDetailNavigatorRef = useRef<NavigationContainerRefWithCurrent<any>>()
  useImperativeHandle(ref, () => {
    const { navigate, goBack, dispatch } = SettingDetailNavigatorRef.current

    return { navigate, goBack, dispatch }
  })
  return (
    <NavigationContainer independent ref={SettingDetailNavigatorRef}>
      <Stack.Navigator
        initialRouteName={MAIN_SCREENS.empty}
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen
          name={MAIN_SCREENS.empty}
          component={withSystemBackFix(() => (
            <View />
          ))}
        />
        <Stack.Screen
          name={MAIN_SCREENS.storeDetail}
          component={withSystemBackFix(StoreDetailScreen)}
        />
        <Stack.Screen
          name={MAIN_SCREENS.companyHours}
          component={withSystemBackFix(CompanyHoursScreen)}
        />
        <Stack.Screen
          name={MAIN_SCREENS.bookingPolicies}
          component={withSystemBackFix(BookingPoliciesScreen)}
        />
        <Stack.Screen
          name={MAIN_SCREENS.appointmentSlot}
          component={withSystemBackFix(AppointmentSlotScreen)}
        />
        <Stack.Screen
          name={MAIN_SCREENS.weekStartDay}
          component={withSystemBackFix(WeekStartDayScreen)}
        />
        <Stack.Screen
          name={MAIN_SCREENS.bookingSlotSize}
          component={withSystemBackFix(BookingSlotSizeScreen)}
        />
        <Stack.Screen
          name={MAIN_SCREENS.customerNotes}
          component={withSystemBackFix(CustomerNotesScreen)}
        />
        <Stack.Screen
          name={MAIN_SCREENS.cancellationPolicy}
          component={withSystemBackFix(CancellationPolicyScreen)}
        />
        <Stack.Screen name={MAIN_SCREENS.timeZone} component={withSystemBackFix(TimeZonesScreen)} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default forwardRef(SettingDetailNavigator)
