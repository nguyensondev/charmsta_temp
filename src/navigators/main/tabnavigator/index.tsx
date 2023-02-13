import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import React from "react"

import TabIcon from "@components/tab-icon"
import { MAIN_SCREENS } from "@models/enum/screensName"
import { MainNavigatorParamList } from "@models/navigator"
import { RouteProp, useRoute } from "@react-navigation/native"
import { AccountMainScreen, CustomerListScreen, HomeScreen } from "@screens/index"
import { color } from "@theme/color"
import { get } from "lodash"
const Tab = createBottomTabNavigator()

function HomeTabs() {
  const route = useRoute<RouteProp<MainNavigatorParamList, MAIN_SCREENS.home>>()
  const initialRouteName = get(route.params, "initialRouteName", "Home")
  return (
    <Tab.Navigator
      initialRouteName={initialRouteName}
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: { backgroundColor: color.palette.blue },
      }}
    >
      <Tab.Screen
        options={{
          tabBarIcon: ({ focused }) => <TabIcon isFocused={focused} tabIndex={0} />,
          tabBarTestID: "tabHome",
        }}
        name="Home"
        component={HomeScreen}
      />
      {/* <Tab.Screen
        options={{
          tabBarIcon: ({ focused }) => <TabIcon isFocused={focused} tabIndex={1} />,
          tabBarTestID: "tabChat",
        }}
        name="Channels"
        component={StoreMenuScreen}
      /> */}
      <Tab.Screen
        options={{
          tabBarIcon: ({ focused }) => <TabIcon isFocused={focused} tabIndex={2} />,
          tabBarTestID: "tabNotification",
        }}
        name="Notification"
        component={CustomerListScreen}
      />
      <Tab.Screen
        options={{
          tabBarIcon: ({ focused }) => <TabIcon isFocused={focused} tabIndex={3} />,
          tabBarTestID: "tabAccount",
        }}
        name="Account"
        component={AccountMainScreen}
      />
    </Tab.Navigator>
  )
}

export default HomeTabs
