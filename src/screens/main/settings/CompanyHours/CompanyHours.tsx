import { ButtonCustom } from "@components/button/buttonCustom"
import { Header } from "@components/header/header"
import { Screen } from "@components/index"
import Text from "@components/text/text"
import VectorIcon from "@components/vectorIcon/vectorIcon"
import { useStoresInfo } from "@hooks/settings/useStoresInfo"
import { UpdateStore } from "@models/backend/request/Store"
import { RegisterDTO } from "@models/backend/response/Auth"
import { OpenHoursDTO, StoreDTO, TimeZoneDTO } from "@models/backend/response/Store"
import { MAIN_SCREENS } from "@models/enum/screensName"
import { useStores } from "@models/index"

import { goBack, navigationRef } from "@navigators/navigation-utilities"
import { color } from "@theme/color"
import { spacing } from "@theme/spacing"
import _, { get, isEmpty } from "lodash"

import { useNavigation } from "@react-navigation/native"
import { convertMinsValue } from "@utils/time"
import moment from "moment-timezone"
import { ScrollView, View } from "native-base"
import React, { useCallback, useEffect, useState } from "react"
import { Alert, Switch, TouchableOpacity, TouchableWithoutFeedback } from "react-native"
import DatePicker from "react-native-date-picker"
import styles from "./styles"
const CompanyHoursScreen = ({ route }) => {
  const navigation = useNavigation()
  const { storeDetail, timeZone } = route.params
  const registerData = get<Partial<Omit<RegisterDTO, "accessToken">>>(
    route.params,
    "registerData",
    {},
  )
  const store = storeDetail as StoreDTO
  const timeZoneTemp = timeZone as TimeZoneDTO
  const currentTimeZone =
    store.timezone && isEmpty(registerData) ? store.timezone : moment.tz.guess()

  const offSet = timeZone
    ? parseInt(timeZoneTemp.rawOffsetInMinutes) / 60
    : moment.tz(currentTimeZone).format("Z")
  const currentTime = timeZone ? timeZoneTemp.name : currentTimeZone

  const [data, setData] = useState<OpenHoursDTO[]>(store.openHours || [])
  const [modifyId, setModifyId] = useState(null)

  const { loadingCompanyHour, companyHour, updateCompanyHour } = useStoresInfo()
  const { userStore } = useStores()

  const navTimeZone = () => {
    navigation.navigate(
      MAIN_SCREENS.timeZone as never,
      {
        storeDetail,
        timeZone: timeZone ? timeZoneTemp : ({ group: [currentTimeZone] } as any),
      } as never,
    )
  }

  const toggleSwitch = (day: number, prev: boolean) => {
    setData(
      [...data].map((object) => {
        if (object.day === day) {
          return {
            ...object,
            open: !prev,
          }
        } else return object
      }),
    )
  }

  const convertDay = (day: number) => {
    switch (day) {
      case 0:
        return "Sunday"
      case 1:
        return "Monday"
      case 2:
        return "Tuesday"
      case 3:
        return "Wednesday"
      case 4:
        return "Thursday"
      case 5:
        return "Friday"
      case 6:
        return "Saturday"
      default:
        return "Monday"
    }
  }

  const save = () => {
    try {
      const dif = _.differenceWith(data, store.openHours, _.isEqual)
      const invokingData = {
        ...store,
        openHours: data,
        timezone: timeZone ? timeZoneTemp.name : currentTimeZone,
      }

      if ((dif && dif.length > 0) || currentTimeZone !== currentTime) {
        updateCompanyHour(store.id, invokingData as UpdateStore)
      } else {
        if (navigationRef.canGoBack()) {
          goBack()
        } else {
          updateCompanyHour(store.id, invokingData as UpdateStore)

          userStore.saveUserId(registerData.userInfo.id)
          Alert.alert("Alert", "Register successful!", [
            {
              text: "OK",
              onPress: () =>
                navigationRef.reset({ index: 0, routes: [{ name: MAIN_SCREENS.home }] }),
            },
          ])
        }
      }
    } catch (error) {
      __DEV__ && console.log({ error })
    }
  }

  useEffect(() => {
    if (companyHour) {
      if (navigationRef.canGoBack()) {
        alert("Update Company Hours successful!")
      } else {
        userStore.saveUserId(registerData.userInfo.id)
        Alert.alert("Alert", "Register successful!", [
          {
            text: "OK",
            onPress: () => navigationRef.reset({ index: 0, routes: [{ name: MAIN_SCREENS.home }] }),
          },
        ])
      }
    }
  }, [companyHour])

  const RenderItem = ({ item }: { item: OpenHoursDTO }) => {
    return (
      <TouchableWithoutFeedback
        onPress={() => {
          setModifyId(item.id)
        }}
      >
        <View key={item.id} style={styles.itemWorkingDays}>
          <View>
            <Text style={styles.lblitemWorkingDays}>{convertDay(item.day)}</Text>
            <Text style={styles.lblitemTimeWorkingDays}>
              {item.fromHour + " -> " + item.toHour}
            </Text>
          </View>
          <Switch
            trackColor={{ false: "#767577", true: "#81b0ff" }}
            thumbColor={"#fff"}
            ios_backgroundColor="#fff"
            onValueChange={() => toggleSwitch(item.day, item.open)}
            value={item.open}
          />
        </View>
      </TouchableWithoutFeedback>
    )
  }
  const RenderHeader = useCallback(
    () => <Header headerText={"Company Hours"} leftIcon="back" />,
    [],
  )
  const RenderFooter = () => {
    return (
      <ButtonCustom
        disabled={loadingCompanyHour}
        isLoading={loadingCompanyHour}
        w="90%"
        // h={SELECT_HEIGHT}
        // paddingY={spacing[2]}
        marginBottom={spacing[1]}
        onPress={save}
      >
        <Text tx="common.save" style={{ color: color.palette.white }} />
      </ButtonCustom>
    )
  }

  const RenderTimeZone = () => {
    return (
      <TouchableOpacity onPress={navTimeZone}>
        <View style={styles.viewContainTimeOff}>
          <View style={styles.viewParentCenterTimeOff}>
            <Text style={styles.txtDate}>{"Central Standard Time"}</Text>
            <Text style={styles.lblitemWorkingDays}>
              {"(UTC" + offSet + ") Time (" + currentTime + ")"}
            </Text>
          </View>
          <View style={styles.viewLstRightTimeOff}>
            <VectorIcon iconSet="ion" name="chevron-forward" />
          </View>
        </View>
      </TouchableOpacity>
    )
  }

  const handleTimeChange = (key: keyof OpenHoursDTO, date: Date) => {
    const mins = date.getMinutes() + date.getHours() * 60
    setData((cur) =>
      cur.map((data) => {
        if (data.id === modifyId) {
          return { ...data, [key]: convertMinsValue(mins) }
        } else {
          return data
        }
      }),
    )
    if (key === "toHour") setModifyId(null)
  }

  return (
    <Screen>
      <RenderHeader />
      <RenderTimeZone />
      <ScrollView style={styles.childViewTime}>
        {data.map((element: OpenHoursDTO) => {
          return <RenderItem key={element.id} item={element} />
        })}
      </ScrollView>
      <RenderFooter />
      <DatePicker
        date={new Date()}
        mode="time"
        modal
        open={!!modifyId}
        onConfirm={(date) => handleTimeChange("toHour", date)}
        title={"To Time"}
        onCancel={() => {
          setModifyId(null)
        }}
      />
      <DatePicker
        date={new Date()}
        mode="time"
        modal
        open={!!modifyId}
        onConfirm={(date) => handleTimeChange("fromHour", date)}
        title={"From Time"}
        onCancel={() => {}}
      />
    </Screen>
  )
}

export default CompanyHoursScreen
