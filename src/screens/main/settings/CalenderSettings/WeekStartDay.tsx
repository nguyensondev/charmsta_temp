import { ButtonCustom, Header, Screen } from "@components/index"
import Text from "@components/text/text"
import VectorIcon from "@components/vectorIcon/vectorIcon"
import { useStoresInfo } from "@hooks/settings/useStoresInfo"
import { TxKeyPath } from "@i18n/i18n"
import { translate } from "@i18n/translate"
import { MAIN_SCREENS } from "@models/enum/screensName"
import { MainNavigatorParamList } from "@models/navigator"
import { goBack } from "@navigators/navigation-utilities"
import { RouteProp, useRoute } from "@react-navigation/native"
import { color } from "@theme/color"
import { spacing } from "@theme/spacing"
import { convertIntToWeekdayString } from "@utils/mathMetric"
import { get } from "lodash"
import { FlatList, Pressable } from "native-base"
import React, { useCallback, useState } from "react"

const days = Array.from(Array(7).keys()).map((item) => ({
  label: translate(`valueDisplay.weekdays.${convertIntToWeekdayString(item)}` as TxKeyPath),
  value: item,
}))
interface IWeekStartDayScreenProps {}

const WeekStartDayScreen = (props: IWeekStartDayScreenProps) => {
  const route = useRoute<RouteProp<MainNavigatorParamList, MAIN_SCREENS.bookingSlotSize>>()
  const { storeDetail } = route.params
  const weekStartDay = get(storeDetail, "appointmentSetting.weekStartDay", null)
  const [selectedDate, setSelectedDate] = useState(weekStartDay)
  const { updateStore } = useStoresInfo()

  const onSave = () => {
    updateStore(storeDetail.id, {
      ...storeDetail,
      appointmentSetting: { ...storeDetail.appointmentSetting, weekStartDay: selectedDate },
    })
    goBack()
  }

  const renderItem = useCallback(
    ({ item }) => {
      const { label, value } = item

      const onItemPress = () => {
        setSelectedDate(value)
      }

      return (
        <Pressable
          flexDirection={"row"}
          justifyContent="space-between"
          onPress={onItemPress}
          borderBottomWidth={1}
          borderColor={color.palette.lightGrey}
          padding={spacing[1]}
        >
          <Text text={label} />
          {value === selectedDate && <VectorIcon iconSet="ion" name="checkmark" size={20} />}
        </Pressable>
      )
    },
    [selectedDate],
  )

  return (
    <Screen>
      <Header leftIcon="back" onLeftPress={goBack} headerTx="screens.headerTitle.weekStartDay" />
      <FlatList data={days} keyExtractor={(item) => item.label} renderItem={renderItem} />

      <ButtonCustom w="90%" marginBottom={spacing[1]} onPress={onSave}>
        <Text tx="button.save" style={{ color: color.palette.white }} />
      </ButtonCustom>
    </Screen>
  )
}

export default WeekStartDayScreen
