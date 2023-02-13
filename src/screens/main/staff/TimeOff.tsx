import { ButtonCustom } from "@components/button/buttonCustom"
import { Header } from "@components/header/header"
import { Screen } from "@components/index"
import Text from "@components/text/text"
import VectorIcon from "@components/vectorIcon/vectorIcon"
import { SELECT_HEIGHT, STAFF_TIME_FORMAT, TIME_12H_FORMAT } from "@config/constants"
import { useStaff } from "@hooks/staff"
import { IStaffTimeOff, StaffDTO } from "@models/backend/response/Staff"
import { MAIN_SCREENS } from "@models/enum/screensName"

import { navigate } from "@navigators/navigation-utilities"
import { color } from "@theme/color"
import { spacing } from "@theme/spacing"
import moment from "moment"
import { View } from "native-base"
import React, { useCallback, useState } from "react"
import { ScrollView } from "react-native"
import styles from "./styles"

const TimeOffScreen = ({ route }) => {
  const { staffDetail, editable } = route.params
  const staffData = staffDetail as StaffDTO
  const [data, setData] = useState<IStaffTimeOff[]>(staffData.timeOffs)

  const { loading } = useStaff()
  const save = () => {
    navigate(MAIN_SCREENS.timeOffDetail, { staffDetail })
  }

  const RenderItem = ({ item }: { item: IStaffTimeOff }) => {
    return (
      <View key={item.id} style={styles.viewContainTimeOff}>
        <View style={styles.viewLstLeftTimeOff}>
          <VectorIcon iconSet="ion" name="airplane" />
        </View>
        <View style={styles.viewParentCenterTimeOff}>
          <View style={styles.viewLstCenterTimeOff}>
            <View style={styles.viewLeftTimeOff}>
              <Text style={styles.txtDate}>{"Starts"}</Text>
              <Text>{moment(item.startDate).format(STAFF_TIME_FORMAT)}</Text>
              {!item.allDay && <Text>{moment(item.startDate).format(TIME_12H_FORMAT)}</Text>}
            </View>

            <View style={styles.viewCenterTimeOff}>
              <VectorIcon iconSet="ion" name="arrow-forward" />
            </View>

            <View style={styles.viewRightTimeOff}>
              <Text style={styles.txtDate}>{"Ends"}</Text>
              <Text>{moment(item.endDate).format(STAFF_TIME_FORMAT)}</Text>
              {!item.allDay && <Text>{moment(item.endDate).format(TIME_12H_FORMAT)}</Text>}
            </View>
          </View>
          <View>
            <Text style={styles.lblitemWorkingDays}>{item.note}</Text>
          </View>
        </View>
        <View style={styles.viewLstRightTimeOff}>
          <VectorIcon iconSet="ion" name="chevron-forward" />
        </View>
      </View>
    )
  }
  const RenderHeader = useCallback(() => <Header headerText={"Time"} leftIcon="back" />, [])

  const RenderBody = () => {
    return (
      <ScrollView style={styles.childViewTime}>
        {data.length > 0 ? (
          data.map((element: IStaffTimeOff) => {
            return <RenderItem key={element.id} item={element} />
          })
        ) : (
          <View style={styles.empty}>
            <Text tx="common.empty" />
          </View>
        )}
      </ScrollView>
    )
  }

  const RenderFooter = () => {
    return (
      <ButtonCustom
        display={editable ? "flex" : "none"}
        disabled={loading}
        isLoading={loading}
        w="90%"
        h={SELECT_HEIGHT}
        marginBottom={spacing[2]}
        onPress={save}
      >
        <Text style={{ color: color.palette.white }}>{"Create"}</Text>
      </ButtonCustom>
    )
  }

  return (
    <Screen>
      <RenderHeader />
      <RenderBody />
      <RenderFooter />
    </Screen>
  )
}

export default TimeOffScreen
