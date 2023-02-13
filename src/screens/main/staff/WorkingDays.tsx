import { ButtonCustom } from "@components/button/buttonCustom"
import { Header } from "@components/header/header"
import { Screen } from "@components/index"
import Text from "@components/text/text"
import { SELECT_HEIGHT } from "@config/constants"
import { useStaff } from "@hooks/staff"
import { IStaffWorkingHour, StaffDTO } from "@models/backend/response/Staff"
import { goBack, navigate } from "@navigators/navigation-utilities"
import { color } from "@theme/color"
import { spacing } from "@theme/spacing"
import _ from "lodash"
import { View } from "native-base"
import React, { useCallback, useEffect, useState } from "react"
import { Switch } from "react-native"
import styles from "./styles"

const WorkingDaysScreen = ({ route }) => {
  const { staffDetail } = route.params
  const staffData = staffDetail as StaffDTO
  const [data, setData] = useState<IStaffWorkingHour[]>(staffData?.workingHours)

  const { loading, editStaffStatus, editStaffProfile } = useStaff()

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
      const dif = _.differenceWith(staffData.workingHours, data, _.isEqual)
      if (dif && dif.length > 0) {
        staffData.workingHours = data
        editStaffProfile(staffData)
      } else {
        goBack()
      }
    } catch (error) {
      __DEV__ && console.log({ error })
    }
  }

  useEffect(() => {
    if (editStaffStatus) {
      alert("Update WorkingDays successful!")
      navigate({
        name: "staffProfile",
        params: { detail: staffData, editable: false },
        merge: true,
      })
    }
  }, [editStaffStatus])

  const RenderItem = ({ item }: { item: IStaffWorkingHour }) => {
    return (
      <View key={item.id} style={styles.itemWorkingDays}>
        <View>
          <Text style={styles.lblitemWorkingDays}>{convertDay(item.day)}</Text>
          <Text style={styles.lblitemTimeWorkingDays}>{item.fromHour + " -> " + item.toHour}</Text>
        </View>
        <Switch
          trackColor={{ false: "#767577", true: "#81b0ff" }}
          thumbColor={"#fff"}
          ios_backgroundColor="#fff"
          onValueChange={() => toggleSwitch(item.day, item.open)}
          value={item.open}
        />
      </View>
    )
  }
  const RenderHeader = useCallback(() => <Header headerText={staffData.name} leftIcon="back" />, [])
  const RenderFooter = () => {
    return (
      <ButtonCustom
        disabled={loading}
        isLoading={loading}
        w="90%"
        h={SELECT_HEIGHT}
        marginBottom={spacing[2]}
        onPress={save}
      >
        <Text tx="common.save" style={{ color: color.palette.white }} />
      </ButtonCustom>
    )
  }

  return (
    <Screen>
      <RenderHeader />
      <View style={styles.childViewTime}>
        {data.map((element: IStaffWorkingHour) => {
          return <RenderItem key={element.id} item={element} />
        })}
      </View>
      <RenderFooter />
    </Screen>
  )
}

export default WorkingDaysScreen
