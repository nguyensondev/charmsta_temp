import MultipleSelectList from "@components/multiple-select-list/MultipleSelectList"
import { useCustomer } from "@hooks/customer"
import { useStaff } from "@hooks/staff"
import { CustomerDTO } from "@models/backend/response/Customer"
import { StaffDTO } from "@models/backend/response/Staff"
import { useFocusEffect } from "@react-navigation/native"
import styleConstructor from "@screens/main/calendar/styles"
import React, { useCallback, useState } from "react"
import { ScrollView, View } from "react-native"

interface FilterAppointmentProps {}

const statusData = [
  // { key: "all", value: "All" },
  { key: "booked", value: "Booked" },
  { key: "confirmed", value: "Confirmed" },
  { key: "arrived", value: "Arrived" },
  { key: "completed", value: "Completed" },
  { key: "canceled", value: "Canceled" },
]
const FilterAppointment = (props: FilterAppointmentProps) => {
  const [statuses, setStatuses] = useState([])
  const [selected, setSelected] = useState("")
  const styles = styleConstructor()
  const { getStaff, staffs } = useStaff()
  const { getCustomers, customers } = useCustomer()
  const convertStaffData = (data: StaffDTO[]) => {
    return data.map((it) => {
      return { key: it.id, value: it.name }
    })
  }
  const convertCustomerData = (data: CustomerDTO[]) => {
    return data.map((it) => {
      return { key: it.id, value: it.firstName + " " + it.lastName }
    })
  }

  console.log("alo3", selected)
  useFocusEffect(
    useCallback(() => {
      getStaff(0, 100)
    }, []),
  )

  useFocusEffect(
    useCallback(() => {
      getCustomers(0, "")
    }, []),
  )
  return (
    <ScrollView contentContainerStyle={{ paddingVertical: 10 }} nestedScrollEnabled={true}>
      <View style={styles.multipleSelect}>
        <MultipleSelectList
          placeholder="Select staff"
          setSelected={(val) => setSelected(val)}
          data={convertStaffData(staffs)}
          save="key"
          label="Staff"
        />
      </View>
      {/* <View style={styles.multipleSelect}> */}
      {/*   <MultipleSelectList */}
      {/*     placeholder="Select customer" */}
      {/*     setSelected={(val) => setSelected(val)} */}
      {/*     data={convertCustomerData(customers)} */}
      {/*     save="key" */}
      {/*     label="Customer" */}
      {/*   /> */}
      {/* </View> */}
      {/* <View style={styles.multipleSelect}> */}
      {/*   <MultipleSelectList */}
      {/*     searchPlaceholder="Search status" */}
      {/*     setSelected={setStatuses} */}
      {/*     data={statusData} */}
      {/*     defaultOption={statusData[0]} */}
      {/*     save="key" */}
      {/*     label="Status" */}
      {/*     placeholder="Select status" */}
      {/*   /> */}
      {/* </View> */}
    </ScrollView>
  )
}

export default FilterAppointment
