import { ButtonCustom } from "@components/button/buttonCustom"
import { Header } from "@components/header/header"
import { Screen } from "@components/index"
import Text from "@components/text/text"
import VectorIcon from "@components/vectorIcon/vectorIcon"
import { SELECT_HEIGHT, STAFF_TIME_FORMAT, TIME_12H_FORMAT } from "@config/constants"
import { useStaff } from "@hooks/staff"
import { IStaffTimeOff, StaffDTO } from "@models/backend/response/Staff"
import { navigate } from "@navigators/navigation-utilities"
import { color } from "@theme/color"
import { spacing } from "@theme/spacing"
import moment from "moment"
import { TextArea, View } from "native-base"
import React, { useCallback, useEffect, useState } from "react"
import { Switch, TouchableOpacity } from "react-native"
import DatePicker from "react-native-date-picker"
import styles from "./styles"

const TimeOffDetailScreen = ({ route }) => {
  const { staffDetail } = route.params

  const nextDay = new Date()
  nextDay.setDate(new Date().getDate() + 1)
  nextDay.setHours(0, 0, 0)
  const today = new Date()
  today.setHours(0, 0, 0)

  const [notes, setNotes] = useState("")
  const [isStartDate, setIsStartDate] = useState(true)
  const [date, setDate] = useState(today)
  const [todate, setToDate] = useState(nextDay)
  const [open, setOpen] = useState(false)
  const [allDay, setAllDay] = useState(true)
  const staffData = staffDetail as StaffDTO

  const { loading, editStaffStatus, editStaffProfile } = useStaff()

  const toggleSwitch = () => setAllDay((previousState) => !previousState)

  const save = () => {
    try {
      const collectData = {
        note: notes,
        staffId: staffData.id,
        startDate: date,
        endDate: todate,
        allDay,
        repeat: "",
        duration: 0,
        repeatOn: [],
        repeatEvery: 0,
      } as unknown as IStaffTimeOff

      staffData.timeOffs.push(collectData)
      editStaffProfile(staffData)
    } catch (error) {
      __DEV__ && console.log({ error })
    }
  }

  const openStartDate = () => {
    setIsStartDate(true)
    setOpen(true)
  }
  const openEndDate = () => {
    setIsStartDate(false)
    setOpen(true)
  }

  useEffect(() => {
    if (editStaffStatus) {
      alert("Update TimeOffs successful!")
      navigate({
        name: "timeOff",
        params: { staffDetail: staffData },
        merge: true,
      })
    }
  }, [editStaffStatus])

  const RenderHeader = useCallback(() => <Header headerText={"Time Off"} leftIcon="back" />, [])

  const RenderBody = () => {
    return (
      <View style={styles.childViewTime}>
        <View style={styles.itemWorkingDays}>
          <View>
            <Text style={styles.lblitemAllDays}>{"All Day"}</Text>
          </View>
          <Switch
            trackColor={{ false: "#767577", true: "#81b0ff" }}
            thumbColor={"#fff"}
            ios_backgroundColor="#fff"
            onValueChange={toggleSwitch}
            value={allDay}
          />
        </View>
        <View style={styles.viewTimeOff}>
          <View style={styles.viewLeftTimeOff}>
            <TouchableOpacity onPress={openStartDate}>
              <Text style={styles.txtDate}>{"Starts"}</Text>
              <Text>{moment(date).format(STAFF_TIME_FORMAT)}</Text>
              {!allDay && <Text>{moment(date).format(TIME_12H_FORMAT)}</Text>}
            </TouchableOpacity>
          </View>

          <View style={styles.viewCenterTimeOff}>
            <VectorIcon iconSet="ion" name="arrow-forward" />
          </View>

          <View style={styles.viewRightTimeOff}>
            <TouchableOpacity onPress={openEndDate}>
              <Text style={styles.txtDate}>{"Ends"}</Text>
              <Text>{moment(todate).format(STAFF_TIME_FORMAT)}</Text>
              {!allDay && <Text>{moment(todate).format(TIME_12H_FORMAT)}</Text>}
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.note}>
          <TextArea
            onChangeText={(text) => setNotes(text)}
            h={20}
            placeholder="Notes"
            w="100%"
            autoCompleteType={"off"}
          />
        </View>
      </View>
    )
  }

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
      <RenderBody />
      <RenderFooter />
      <DatePicker
        modal
        mode={allDay ? "date" : "datetime"}
        open={open}
        date={isStartDate ? date : todate}
        onConfirm={(date) => {
          setOpen(false)
          isStartDate ? setDate(date) : setToDate(date)
        }}
        onCancel={() => {
          setOpen(false)
        }}
      />
    </Screen>
  )
}

export default TimeOffDetailScreen
