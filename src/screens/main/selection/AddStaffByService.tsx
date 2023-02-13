import { TextFieldCustom } from "@components/text-field"
import Text from "@components/text/text"
import VectorIcon from "@components/vectorIcon/vectorIcon"
import { useStaff } from "@hooks/staff"
import { StaffByServiceDTO, StaffDTO } from "@models/backend/response/Staff"
import { color } from "@theme/color"
import { spacing } from "@theme/spacing"
import { debounce } from "lodash"
import { Box, FlatList } from "native-base"
import React, { useContext, useEffect, useLayoutEffect, useState } from "react"
import { TouchableOpacity } from "react-native"
import { AdditionSelectContext } from "."
import { styles } from "./styles"

interface AddStaffByServiceProps {}

const AddStaffByService = (props: AddStaffByServiceProps) => {
  const [staff, setStaff] = useState<Partial<StaffDTO>>({})
  const [searchText, setSearchText] = useState("")
  const { getStaffByService, staffsByService, getStaffByServicesAndPackages } = useStaff()
  const additionSelectCtx = useContext(AdditionSelectContext)
  const { service, services } = additionSelectCtx.additionSelect

  useEffect(() => {
    additionSelectCtx.saveAdditionSelect({
      staff,
    })
  }, [staff])

  useLayoutEffect(() => {
    if (service?.id) {
      getStaffByService(service.id, searchText)
    } else {
      getStaffByServicesAndPackages(services.packages, services.services)
    }
  }, [service, searchText, services])

  const _renderItem = ({ item, index }: { item: StaffByServiceDTO; index: number }) => {
    const onItemPress = () => {
      setStaff(item)
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
          {staff.id === item.id && <VectorIcon iconSet="ant" name="check" />}
        </Box>
      </TouchableOpacity>
    )
  }

  const debounceSearchChange = debounce((text) => {
    setSearchText(text)
  }, 500)

  return (
    <>
      <TextFieldCustom
        placeholderTx="textInput.placeholder.search"
        onChangeText={debounceSearchChange}
        style={styles.searchBar}
        hideError
      />
      <FlatList data={staffsByService} renderItem={_renderItem} />
    </>
  )
}

export default AddStaffByService
