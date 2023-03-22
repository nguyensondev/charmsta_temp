import { Header } from "@components/header/header"
import { Screen } from "@components/index"
import SplitView from "@components/splitView"
import Text from "@components/text"
import VectorIcon from "@components/vectorIcon/vectorIcon"
import { useIsTablet } from "@contexts/isTabletContext"
import { useAuth } from "@hooks/auth"
import { useStoresInfo } from "@hooks/settings/useStoresInfo"
import { TxKeyPath } from "@i18n/i18n"
import { translate } from "@i18n/translate"
import { MAIN_SCREENS } from "@models/enum/screensName"
import { useStores } from "@models/index"
import SettingDetailNavigator, {
  IRefSettingDetailNavigator
} from "@navigators/main/splitViewNavigator/detail/Setting"
import { navigate } from "@navigators/navigation-utilities"
import { StackActions } from "@react-navigation/native"
import { color } from "@theme/color"
import { convertIntToWeekdayString } from "@utils/mathMetric"
import { debounce, get } from "lodash"
import { observer } from "mobx-react-lite"
import { ScrollView } from "native-base"
import React, { useCallback, useRef, useState } from "react"
import { Switch, TouchableOpacity, View } from "react-native"
import styles from "./styles"

const switchFields = [
  "offHoursBooking",
  "doubleBooking",
  "customServiceDuration",
  "customServiceCost",
]

const SettingsScreen = () => {
  const {
    //   loadingStores,
    //   stores,
    //   getStores,
    //   getStoreById,
    //   storeData,
    //   gettingStoreData,
    //   updating,
    updateStore,
  } = useStoresInfo()

  const { logout } = useAuth()
  const { isTablet } = useIsTablet()
  const {
    currentStoreStore: { CurrentStore: storeData, saveCurrentStore },
  } = useStores()

  const detailNavigatorRef = useRef<IRefSettingDetailNavigator>()

  const _navigate = (screenName: MAIN_SCREENS, params?: any) => {
    if (isTablet) {
      const { dispatch } = detailNavigatorRef.current
      dispatch(StackActions.replace(screenName, params))
    } else {
      navigate(screenName, params)
    }
  }

  const RenderHeader = useCallback(() => <Header headerText={"Settings"} leftIcon="back" />, [])

  const RenderContent1 = () => {
    return (
      <View>
        <View style={styles.headerLine}>
          <Text noOfLines={1} style={styles.headerSize} tx="settings.main.bookingPage" />
        </View>
        <TouchableOpacity
          onPress={() => _navigate(MAIN_SCREENS.storeDetail, { storeDetail: storeData })}
        >
          <View style={styles.viewCard}>
            <View style={styles.viewLeft}>
              <VectorIcon iconSet="ion" name="podium-outline" />
            </View>
            <View style={styles.viewCenter}>
              <Text noOfLines={1} style={styles.contentSize} tx="settings.main.companyDetail" />
            </View>
            <View style={styles.viewRight}>
              <VectorIcon color={color.alpha.black50} iconSet="ion" name="chevron-forward" />
            </View>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() =>
            _navigate(MAIN_SCREENS.companyHours, {
              storeDetail: storeData,
              timeZone: storeData.timezone,
            })
          }
        >
          <View style={styles.viewCard}>
            <View style={styles.viewLeft}>
              <VectorIcon iconSet="ion" name="time-outline" />
            </View>
            <View style={styles.viewCenter}>
              <Text noOfLines={1} style={styles.contentSize} tx="settings.main.businessHours" />
            </View>
            <View style={styles.viewRight}>
              <VectorIcon color={color.alpha.black50} iconSet="ion" name="chevron-forward" />
            </View>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => _navigate(MAIN_SCREENS.bookingPolicies, { storeDetail: storeData })}
        >
          <View style={styles.viewCard}>
            <View style={styles.viewLeft}>
              <VectorIcon iconSet="ion" name="document-text-outline" />
            </View>
            <View style={styles.viewCenter}>
              <Text noOfLines={1} style={styles.contentSize} tx="settings.main.bookingPolicies" />
            </View>
            <View style={styles.viewRight}>
              <VectorIcon color={color.alpha.black50} iconSet="ion" name="chevron-forward" />
            </View>
          </View>
        </TouchableOpacity>
      </View>
    )
  }

  const debounceUpdate = useCallback(
    debounce(() => {
      updateStore(storeData.id, storeData, false)
    }, 1000),
    [],
  )

  const SwitchField = (props: { value?: boolean; id: string }) => {
    const { value, id } = props
    const [isOn, setOn] = useState(value)

    const toggleSwitch = (value: boolean) => {
      setOn(() => {
        const updatedStoreData = {
          ...storeData,
          appointmentSetting: {
            ...storeData.appointmentSetting,
            [id]: value,
          },
        }
        saveCurrentStore(updatedStoreData)
        debounceUpdate()
        return value
      })
    }

    return (
      <View style={styles.viewCard}>
        <View style={styles.viewLeft}>
          <VectorIcon iconSet="ion" name="cash-outline" />
        </View>
        <View style={styles.viewCenter}>
          <Text noOfLines={1} style={styles.contentSize} tx={`settings.main.${id}` as TxKeyPath} />
        </View>
        <View style={styles.viewRight}>
          <Switch
            trackColor={{ false: "#767577", true: "#81b0ff" }}
            thumbColor={"#fff"}
            ios_backgroundColor="#fff"
            onValueChange={(value) => toggleSwitch(value)}
            value={isOn}
          />
        </View>
      </View>
    )
  }

  const {
    appointmentSlots,
    weekStartDay,
    customServiceCost,
    customServiceDuration,
    offHoursBooking,
    doubleBooking,
  } = storeData.appointmentSetting

  const RenderContent2 = useCallback(() => {
    return (
      <View>
        <View style={styles.headerLine}>
          <Text noOfLines={1} style={styles.headerSize} tx="settings.main.calendarSettings" />
        </View>

        {switchFields.map((item) => (
          <SwitchField
            key={`switch-${item}`}
            value={get(storeData, `appointmentSetting.${item}`)}
            id={item}
          />
        ))}

        <TouchableOpacity
          onPress={() => _navigate(MAIN_SCREENS.appointmentSlot, { storeDetail: storeData })}
        >
          <View style={styles.viewCard}>
            <View style={styles.viewLeft}>
              <VectorIcon iconSet="ion" name="calendar-outline" />
            </View>
            <View style={styles.viewCenter}>
              <Text noOfLines={1} style={styles.contentSize} tx="settings.main.appointmentSlot" />
            </View>
            <View style={styles.viewRight}>
              <View style={styles.viewSubRight}>
                <Text noOfLines={1} style={styles.contentSubSize}>
                  {translate("valueDisplay.mins", {
                    time: get(storeData, "appointmentSetting.appointmentSlots", 0),
                  })}
                </Text>
                <VectorIcon color={color.alpha.black50} iconSet="ion" name="chevron-forward" />
              </View>
            </View>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => _navigate(MAIN_SCREENS.weekStartDay, { storeDetail: storeData })}
        >
          <View style={styles.viewCard}>
            <View style={styles.viewLeft}>
              <VectorIcon iconSet="ion" name="today-outline" />
            </View>
            <View style={styles.viewCenter}>
              <Text noOfLines={1} style={styles.contentSize} tx="settings.main.weekStartDay" />
            </View>
            <View style={styles.viewRight}>
              <View style={styles.viewSubRight}>
                <Text noOfLines={1} style={styles.contentSubSize}>
                  {translate(
                    `valueDisplay.weekdays.${convertIntToWeekdayString(
                      storeData?.appointmentSetting.weekStartDay,
                    )}` as TxKeyPath,
                  )}
                </Text>
                <VectorIcon color={color.alpha.black50} iconSet="ion" name="chevron-forward" />
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    )
  }, [
    appointmentSlots,
    weekStartDay,
    customServiceCost,
    customServiceDuration,
    offHoursBooking,
    doubleBooking,
  ])

  return (
    <Screen preset="fixed">
      <RenderHeader />
      <SplitView
        master={
          <ScrollView>
            <RenderContent1 />
            <RenderContent2 />
          </ScrollView>
        }
        detail={<SettingDetailNavigator ref={detailNavigatorRef} />}
      />
    </Screen>
  )
}

export default observer(SettingsScreen)
