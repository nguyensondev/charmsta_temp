import { TextFieldCustom } from "@components/text-field"
import Text from "@components/text/text"
import VectorIcon from "@components/vectorIcon/vectorIcon"
import { useStaff } from "@hooks/staff"
import { StaffDTO } from "@models/backend/response/Staff"
import { color } from "@theme/color"
import { spacing } from "@theme/spacing"
import { debounce, isEmpty } from "lodash"
import { Box, FlatList } from "native-base"
import React, { useContext, useEffect, useLayoutEffect, useMemo, useState } from "react"
import { TouchableOpacity } from "react-native"
import { AdditionSelectContext } from "."
import { styles } from "./styles"

interface AddStaffsProps {}

const AddStaffs = (props: AddStaffsProps) => {
  const [staffIds, setStaffIds] = useState<number[]>([])
  const [searchText, setSearchText] = useState("")
  const { getStaff, staffs } = useStaff()
  const additionSelectCtx = useContext(AdditionSelectContext)
  const { saveAdditionSelect, additionSelect, prevSelected } = additionSelectCtx

  useEffect(() => {
    saveAdditionSelect({
      staffs: staffs.filter((staff) => staffIds.includes(staff.id)),
    })
  }, [staffIds])

  useLayoutEffect(() => {
    getStaff()
    if (!isEmpty(prevSelected?.staffs)) {
      setStaffIds(prevSelected.staffs.map((staff) => staff.id))
    }
  }, [])

  const renderHeader = () => {
    const onItemPress = () => {
      if (staffIds.length === staffs.length) {
        setStaffIds([])
      } else {
        setStaffIds(staffs.map((staff) => staff.id))
      }
    }

    return (
      <TouchableOpacity onPress={onItemPress}>
        <Box
          flexDir={"row"}
          justifyContent="space-between"
          p={spacing[1]}
          borderBottomWidth={1}
          borderColor={color.palette.lighterGrey}
        >
          <Text text="All Staffs" />
          {staffIds.length === staffs.length && <VectorIcon iconSet="ant" name="check" />}
        </Box>
      </TouchableOpacity>
    )
  }

  const _renderItem = ({ item, index }: { item: StaffDTO; index: number }) => {
    const onItemPress = () => {
      if (!staffIds.includes(item.id)) {
        setStaffIds((prev) => [...prev, item.id])
      } else {
        setStaffIds((prev) => prev.filter((id) => id !== item.id))
      }
    }

    return (
      <TouchableOpacity onPress={onItemPress}>
        <Box
          flexDir={"row"}
          justifyContent="space-between"
          p={spacing[1]}
          borderBottomWidth={1}
          borderColor={color.palette.lighterGrey}
        >
          <Text text={item.name} />
          {staffIds.includes(item.id) && <VectorIcon iconSet="ant" name="check" />}
        </Box>
      </TouchableOpacity>
    )
  }

  const debounceSearchChange = debounce((text) => {
    setSearchText(text)
  }, 500)

  const filteredStaffs = useMemo(
    () => (isEmpty(staffs) ? staffs : staffs.filter((staff) => staff.name.includes(searchText))),
    [searchText, staffs],
  )

  return (
    <>
      <TextFieldCustom
        placeholderTx="textInput.placeholder.search"
        onChangeText={debounceSearchChange}
        hideError
        style={styles.searchBar}
      />
      <FlatList data={filteredStaffs} renderItem={_renderItem} ListHeaderComponent={renderHeader} />
    </>
  )
}

export default AddStaffs
