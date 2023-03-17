import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { StackNavigationProp } from "@react-navigation/stack"
import React, { useEffect, useLayoutEffect, useMemo } from "react"

import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client"
import { api } from "@config/index"
import { useUser } from "@hooks/user"
import { COMMON_SCREENS, MAIN_SCREENS } from "@models/enum/screensName"
import { useStores } from "@models/index"
import { CurrentStore } from "@models/mobx/current_store/CurrentStore"
import { CommonNavigatorParamList, MainNavigatorParamList } from "@models/navigator"
import { SearchLocationScreen } from "@screens/common/location"
import {
  BreaksScreen,
  CategoryDetailScreen,
  CategoryListScreen,
  CompanyHoursScreen,
  CustomerListScreen,
  LabelListScreen,
  NewCategoryScreen,
  NewLabelsScreen,
  NewServiceScreen,
  PrivacyMainScreen,
  ServiceDetailScreen,
  ServiceListScreen,
  SettingsScreen,
  TimeOffDetailScreen,
  TimeOffScreen,
  TimeZonesScreen,
  WorkingDaysScreen
} from "@screens/main"
import { AccountProfileScreen } from "@screens/main/account"
import EditAccountScreen from "@screens/main/account/EditAccount"
import {
  AppointmentDetailScreen,
  CancelAppointmentScreen,
  CheckoutScreen,
  EditAppointmentScreen,
  NewAppointmentScreen
} from "@screens/main/appointment"
import { CustomerImportScreen, CustomerProfileScreen } from "@screens/main/customer"
import {
  DiscountDetailScreen,
  DiscountListScreen,
  EditDiscountScreen,
  NewDiscountScreen
} from "@screens/main/discount"
import {
  EditPackageScreen,
  NewPackageScreen,
  PackageDetailScreen,
  PackageListScreen
} from "@screens/main/package"
import {
  CardPaymentScreen,
  CashPaymentScreen,
  OtherPaymentScreen,
  PaymentTypeScreen
} from "@screens/main/payment"
import { ProductDetailScreen, ProductListScreen } from "@screens/main/product"
import SelectionScreen from "@screens/main/selection"
import EditServiceScreen from "@screens/main/services/service/EditService"
import {
  BookingPoliciesScreen,
  BookingSlotSizeScreen,
  CancellationPolicyScreen,
  CustomerNotesScreen
} from "@screens/main/settings/BookingPolicies"
import { AppointmentSlotScreen } from "@screens/main/settings/CalenderSettings"
import WeekStartDayScreen from "@screens/main/settings/CalenderSettings/WeekStartDay"
import ChangePasswordScreen from "@screens/main/settings/ChangePassword"
import { StaffListScreen } from "@screens/main/staff"
import StaffProfileScreen from "@screens/main/staff/StaffProfile"
import { StoreDetailScreen, StoreMenuScreen } from "@screens/main/store"
import { EditTaxScreen, NewTaxScreen, TaxDetailScreen, TaxListScreen } from "@screens/main/tax"
import { getStoreByIdApi, getStoresApi } from "@services/api/Store"
import HomeTabs from "./tabnavigator"

export type mainScreenProp = StackNavigationProp<MainNavigatorParamList & CommonNavigatorParamList>

const Stack = createNativeStackNavigator<MainNavigatorParamList & CommonNavigatorParamList>()

const MainStack = () => {
  const { getUserProfile } = useUser()
  const { currentStoreStore, authStore } = useStores()
  const { saveCurrentStore } = currentStoreStore

  useEffect(() => {
    getStoresApi().then(({ data }) => {
      if (data.length > 0) {
        getStoreByIdApi(data[0].id).then(({ data }) => {
          saveCurrentStore(data as CurrentStore)
        })
      }
    })
  }, [])

  useLayoutEffect(() => {
    getUserProfile()
  }, [])

  const client = useMemo(
    () =>
      new ApolloClient({
        uri: api.url + "/graphql",
        cache: new InMemoryCache(),
        headers: {
          Authorization: `Bearer ${authStore.Auth.token}`,
        },
      }),
    [authStore.Auth.token],
  )

  return (
    <ApolloProvider client={client}>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
        initialRouteName={MAIN_SCREENS.home}
      >
        <Stack.Screen
          options={{
            headerShown: false,
          }}
          name={MAIN_SCREENS.home}
          component={HomeTabs}
        />
        <Stack.Screen name={MAIN_SCREENS.customerList} component={CustomerListScreen} />
        <Stack.Screen name={MAIN_SCREENS.customerProfile} component={CustomerProfileScreen} />
        <Stack.Screen name={MAIN_SCREENS.customerImport} component={CustomerImportScreen} />
        <Stack.Screen name={MAIN_SCREENS.categoryList} component={CategoryListScreen} />
        <Stack.Screen name={MAIN_SCREENS.newCategory} component={NewCategoryScreen} />
        <Stack.Screen name={MAIN_SCREENS.categoryDetail} component={CategoryDetailScreen} />
        <Stack.Screen name={MAIN_SCREENS.serviceList} component={ServiceListScreen} />
        <Stack.Screen name={MAIN_SCREENS.newService} component={NewServiceScreen} />
        <Stack.Screen name={MAIN_SCREENS.serviceDetail} component={ServiceDetailScreen} />
        {/* <Stack.Group screenOptions={{ presentation: "modal" }}> */}
        <Stack.Screen name={MAIN_SCREENS.appointmentDetail} component={AppointmentDetailScreen} />
        <Stack.Screen name={MAIN_SCREENS.newAppointment} component={NewAppointmentScreen} />
        <Stack.Screen name={MAIN_SCREENS.editAppointment} component={EditAppointmentScreen} />
        <Stack.Screen name={MAIN_SCREENS.additionSelect} component={SelectionScreen} />
        <Stack.Screen name={MAIN_SCREENS.cancelAppointment} component={CancelAppointmentScreen} />
        {/* </Stack.Group> */}
        <Stack.Screen name={MAIN_SCREENS.checkout} component={CheckoutScreen} />
        <Stack.Screen name={MAIN_SCREENS.staffList} component={StaffListScreen} />
        <Stack.Screen name={MAIN_SCREENS.staffProfile} component={StaffProfileScreen} />
        <Stack.Screen name={MAIN_SCREENS.productList} component={ProductListScreen} />
        <Stack.Screen name={MAIN_SCREENS.productDetail} component={ProductDetailScreen} />
        <Stack.Screen name={MAIN_SCREENS.workingDays} component={WorkingDaysScreen} />
        <Stack.Screen name={MAIN_SCREENS.breaks} component={BreaksScreen} />
        <Stack.Screen name={MAIN_SCREENS.timeOff} component={TimeOffScreen} />
        <Stack.Screen name={MAIN_SCREENS.settings} component={SettingsScreen} />
        <Stack.Screen name={MAIN_SCREENS.timeOffDetail} component={TimeOffDetailScreen} />
        <Stack.Group key={"Settings"}>
          <Stack.Screen name={MAIN_SCREENS.storeDetail} component={StoreDetailScreen} />
          <Stack.Screen name={MAIN_SCREENS.bookingPolicies} component={BookingPoliciesScreen} />
          <Stack.Screen name={MAIN_SCREENS.bookingSlotSize} component={BookingSlotSizeScreen} />
          <Stack.Screen name={MAIN_SCREENS.customerNotes} component={CustomerNotesScreen} />
          <Stack.Screen
            name={MAIN_SCREENS.cancellationPolicy}
            component={CancellationPolicyScreen}
          />
          <Stack.Screen name={MAIN_SCREENS.appointmentSlot} component={AppointmentSlotScreen} />
          <Stack.Screen name={MAIN_SCREENS.weekStartDay} component={WeekStartDayScreen} />
        </Stack.Group>
        <Stack.Screen name={MAIN_SCREENS.companyHours} component={CompanyHoursScreen} />
        <Stack.Screen name={MAIN_SCREENS.timeZone} component={TimeZonesScreen} />
        <Stack.Screen name={MAIN_SCREENS.labelList} component={LabelListScreen} />
        <Stack.Screen name={MAIN_SCREENS.newLabel} component={NewLabelsScreen} />
        <Stack.Screen name={MAIN_SCREENS.packageList} component={PackageListScreen} />
        <Stack.Screen name={MAIN_SCREENS.newPackage} component={NewPackageScreen} />
        <Stack.Screen name={MAIN_SCREENS.packageDetail} component={PackageDetailScreen} />
        <Stack.Screen name={MAIN_SCREENS.editPackage} component={EditPackageScreen} />
        <Stack.Screen name={MAIN_SCREENS.privacy} component={PrivacyMainScreen} />
        <Stack.Screen name={MAIN_SCREENS.storeMenu} component={StoreMenuScreen} />
        <Stack.Screen name={MAIN_SCREENS.editAccount} component={EditAccountScreen} />
        <Stack.Screen name={MAIN_SCREENS.accountProfile} component={AccountProfileScreen} />
        <Stack.Screen name={MAIN_SCREENS.changePassword} component={ChangePasswordScreen} />
        <Stack.Screen name={MAIN_SCREENS.paymentType} component={PaymentTypeScreen} />
        <Stack.Screen name={MAIN_SCREENS.cashPayment} component={CashPaymentScreen} />
        <Stack.Screen name={MAIN_SCREENS.cardPayment} component={CardPaymentScreen} />
        <Stack.Screen name={MAIN_SCREENS.otherPayment} component={OtherPaymentScreen} />
        <Stack.Screen name={MAIN_SCREENS.editService} component={EditServiceScreen} />
        <Stack.Screen name={MAIN_SCREENS.taxList} component={TaxListScreen} />
        <Stack.Screen name={MAIN_SCREENS.newTax} component={NewTaxScreen} />
        <Stack.Screen name={MAIN_SCREENS.taxDetail} component={TaxDetailScreen} />
        <Stack.Screen name={MAIN_SCREENS.editTax} component={EditTaxScreen} />
        <Stack.Screen name={MAIN_SCREENS.discountList} component={DiscountListScreen} />
        <Stack.Screen name={MAIN_SCREENS.newDiscount} component={NewDiscountScreen} />
        <Stack.Screen name={MAIN_SCREENS.discountDetail} component={DiscountDetailScreen} />
        <Stack.Screen name={MAIN_SCREENS.editDiscount} component={EditDiscountScreen} />
        <Stack.Screen name={COMMON_SCREENS.searchLocation} component={SearchLocationScreen} />
      </Stack.Navigator>
    </ApolloProvider>
  )
}

export default MainStack
