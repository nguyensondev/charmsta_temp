import { ButtonCustom } from "@components/button/buttonCustom"
import { Header } from "@components/header/header"
import { Screen } from "@components/index"
import SearchBar, { RefSearch } from "@components/search-bar/SearchBar"
import Text from "@components/text"
import VectorIcon from "@components/vectorIcon/vectorIcon"
import { SCREEN_WIDTH } from "@config/constants"
import { DATA_TIMEZONE } from "@config/timeZoneCountry"
import { TimeZoneDTO } from "@models/backend/response/Store"
import { MAIN_SCREENS } from "@models/enum/screensName"

import { useNavigation } from "@react-navigation/native"
import { color } from "@theme/color"
import { spacing } from "@theme/spacing"
import _ from "lodash"
import * as React from "react"
import { useCallback, useEffect, useState } from "react"
import { FlatList, TouchableOpacity, View } from "react-native"
import styles from "./styles"

const TimeZonesScreen = ({ route }) => {
  const { navigate } = useNavigation()
  const { timeZone, storeDetail } = route.params
  const timeZoneTemp = timeZone as TimeZoneDTO
  const dataTimeZone = DATA_TIMEZONE as unknown as TimeZoneDTO[]

  const [data, setData] = useState<TimeZoneDTO[]>(dataTimeZone)
  const [selected, setSelected] = useState<number>(-1)
  const ref = React.useRef<RefSearch>(null)

  const save = () => {
    const newData = selected > -1 ? DATA_TIMEZONE[selected] : timeZoneTemp

    navigate({
      name: MAIN_SCREENS.companyHours,
      params: { storeDetail, timeZone: newData as TimeZoneDTO },
      merge: true,
    } as never)
  }

  const cancelAction = () => {
    if (data.length !== dataTimeZone.length) {
      setData(dataTimeZone)
    }
  }

  const searchAction = () => {
    if (ref && ref.current) {
      const dataTemp = data
      const result = _.filter(dataTemp, function (obj) {
        return obj.countryName.indexOf(ref.current.searchPhrase.trim()) !== -1
      })
      if (result && result.length > 0) {
        setData(result)
      }
      // getCatList(ref.current.searchPhrase.trim())
    }
  }

  const RenderFooter = () => {
    return (
      <ButtonCustom
        disabled={false}
        isLoading={false}
        w="90%"
        // h={SELECT_HEIGHT}
        py={spacing[1]}
        marginBottom={spacing[2]}
        onPress={save}
      >
        <Text tx="common.save" style={{ color: color.palette.white }} />
      </ButtonCustom>
    )
  }

  useEffect(() => {
    if (timeZoneTemp) {
      for (let index = 0; index < data.length; index++) {
        for (let index1 = 0; index1 < data[index].group.length; index1++) {
          const found = data[index].group.some((r) => timeZoneTemp.group.includes(r))
          if (found) {
            setSelected(index)
          }
        }
      }
    }
  }, [])

  const RenderHeader = useCallback(() => <Header headerText={"Settings"} leftIcon="back" />, [])

  const renderEmpty = useCallback(() => {
    return (
      <View style={styles.empty}>
        <Text tx="common.empty" />
      </View>
    )
  }, [])

  const renderItem = useCallback(
    ({ item, index }: { item: TimeZoneDTO; index: number }) => {
      return (
        <TouchableOpacity
          onPress={() => {
            setSelected(index)
          }}
        >
          <View style={styles.viewContainTimeOff}>
            <View style={styles.viewParentCenterTimeOff}>
              <Text style={styles.txtDate}>{item.countryName + " Standard Time"}</Text>
              <Text
                numberOfLines={1}
                ellipsizeMode={"tail"}
                style={[styles.lblitemWorkingDays, { maxWidth: SCREEN_WIDTH * 0.7 }]}
              >
                {item.rawFormat}
              </Text>
            </View>

            <View style={styles.viewLstRightTimeOff}>
              <VectorIcon
                color={selected === index ? "black" : "white"}
                iconSet="ion"
                name="checkmark-sharp"
              />
            </View>
          </View>
        </TouchableOpacity>
      )
    },
    [selected],
  )

  return (
    <Screen>
      <RenderHeader />
      <SearchBar searchAction={searchAction} cancelAction={cancelAction} ref={ref} />
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item.continentName + item.rawFormat}
        showsVerticalScrollIndicator={false}
      />
      <RenderFooter />
    </Screen>
  )
}

export default TimeZonesScreen
