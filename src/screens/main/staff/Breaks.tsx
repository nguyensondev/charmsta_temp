import { ButtonCustom } from "@components/button/buttonCustom"
import { Header } from "@components/header/header"
import { Screen } from "@components/index"
import Text from "@components/text/text"
import VectorIcon from "@components/vectorIcon/vectorIcon"
import { SELECT_HEIGHT } from "@config/constants"
import { useStaff } from "@hooks/staff"
import { translate } from "@i18n/translate"
import { IStaffBreakTime, StaffDTO } from "@models/backend/response/Staff"
import { MAIN_SCREENS } from "@models/enum/screensName"

import { goBack, navigate } from "@navigators/navigation-utilities"
import { color } from "@theme/color"
import { spacing } from "@theme/spacing"
import _, { isEmpty } from "lodash"
import moment from "moment"
import { View } from "native-base"
import React, { useCallback, useEffect, useState } from "react"
import { Alert, ScrollView, TouchableOpacity } from "react-native"
import DatePicker from "react-native-date-picker"
import styles from "./styles"

const getInitData = (staffId: number) => {
  return [
    {
      day: 0,
      staffId,
    },
    {
      day: 1,
      staffId,
    },
    {
      day: 2,
      staffId,
    },
    {
      day: 3,
      staffId,
    },
    {
      day: 4,
      staffId,
    },
    {
      day: 5,
      staffId,
    },
    {
      day: 6,
      staffId,
    },
  ] as IStaffBreakTime[]
}

const BreaksScreen = ({ route }) => {
  const { staffDetail, editable } = route.params
  const today = new Date()
  const [timePickerFromOpen, setTimePickerFromOpen] = useState(false)
  const [timePickerToOpen, setTimePickerToOpen] = useState(false)
  const [selectDay, setSelectDay] = useState(-1)
  const [frTime, setFrTime] = useState("")
  const [toTime, setToTime] = useState("")
  const staffData = staffDetail as StaffDTO

  const [data, setData] = useState<IStaffBreakTime[]>(
    staffData.breakTimes && staffData.breakTimes.length === 0
      ? getInitData(staffData.id)
      : staffData.breakTimes,
  )

  const { loading, editStaffStatus, editStaffProfile, error } = useStaff()

  useEffect(() => {
    if (!isEmpty(error)) {
      Alert.alert("Error", translate("errors.unexpected"))
    }
  }, [error])

  const setBreaksFromTime = (frTime: string) => {
    setData(
      [...data].map((object) => {
        if (object.day === selectDay) {
          return {
            ...object,
            fromHour: frTime,
          }
        } else return object
      }),
    )
  }

  const setBreaksToTime = (toTime: string) => {
    setData(
      [...data].map((object) => {
        if (object.day === selectDay) {
          return {
            ...object,
            toHour: toTime,
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

  const openPicker = (frHour: string, toHour: string, day: number) => {
    if (!timePickerFromOpen && !timePickerToOpen) {
      setSelectDay(day)
      if (frHour) setFrTime(frHour)
      if (toHour) setToTime(toHour)
      setTimePickerToOpen(true)
      setTimeout(() => {
        setTimePickerFromOpen(true)
      }, 10)
    }
  }

  const save = () => {
    try {
      const dif = _.differenceWith(data, staffData.breakTimes, _.isEqual)
      if (dif && dif.length > 0) {
        staffData.breakTimes = data
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
      alert("Update BreaksTime successful!")
      navigate({
        name: MAIN_SCREENS.staffProfile,
        params: { detail: staffData, editable: false },
        merge: true,
      })
    }
  }, [editStaffStatus])

  const RenderItem = ({ item }: { item: IStaffBreakTime }) => {
    return (
      <View key={item.id} style={styles.itemBreaks}>
        <View style={styles.itemSubBreaks}>
          <Text style={styles.lblitemWorkingDays}>{convertDay(item.day)}</Text>
          <TouchableOpacity
            disabled={!editable}
            onPress={() => openPicker(item.fromHour, item.toHour, item.day)}
            style={styles.btnBreaks}
          >
            <Text>{"+ Break"}</Text>
          </TouchableOpacity>
        </View>
        {item.fromHour && item.toHour && item.fromHour !== "08:00" && item.toHour !== "18:00" && (
          <View style={styles.itemViewTime}>
            <VectorIcon iconSet="ion" name={"cafe"} />
            <Text style={styles.lblitemTimeWorkingDays}>
              {item.fromHour + " -> " + item.toHour}
            </Text>
          </View>
        )}
      </View>
    )
  }
  const RenderHeader = useCallback(() => <Header headerText={staffData.name} leftIcon="back" />, [])

  const RenderBody = () => {
    return (
      <ScrollView style={styles.childViewTime}>
        {data.map((element: IStaffBreakTime, index) => {
          return <RenderItem key={index} item={element} />
        })}
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
        <Text tx="common.save" style={{ color: color.palette.white }} />
      </ButtonCustom>
    )
  }

  const feTime =
    frTime && frTime.length > 0 && frTime !== "08:00"
      ? new Date(
          today.getFullYear(),
          today.getMonth(),
          today.getDate(),
          parseInt(frTime.split(":")[0]),
          parseInt(frTime.split(":")[1]),
          0,
        )
      : new Date(today.getFullYear(), today.getMonth(), today.getDate(), 9, 0, 0)

  const tTime =
    toTime && toTime.length > 0 && toTime !== "18:00"
      ? new Date(
          today.getFullYear(),
          today.getMonth(),
          today.getDate(),
          parseInt(toTime.split(":")[0]),
          parseInt(toTime.split(":")[1]),
          0,
        )
      : new Date(today.getFullYear(), today.getMonth(), today.getDate(), 19, 0, 0)

  return (
    <Screen>
      <RenderHeader />
      <RenderBody />
      <RenderFooter />
      <DatePicker
        key={1}
        date={feTime}
        mode="time"
        modal
        open={timePickerFromOpen}
        onConfirm={(date) => {
          setTimePickerFromOpen(false)
          setBreaksFromTime(moment(date).format("HH:mm"))
        }}
        title={"From Time"}
        onCancel={() => {
          setTimePickerFromOpen(false)
        }}
      />
      <DatePicker
        key={2}
        date={tTime}
        mode="time"
        modal
        open={timePickerToOpen}
        onConfirm={(date) => {
          setTimePickerToOpen(false)
          setBreaksToTime(moment(date).format("H:mm"))
        }}
        title={"To Time"}
        onCancel={() => {
          setTimePickerToOpen(false)
        }}
      />
    </Screen>
  )
}

export default BreaksScreen
