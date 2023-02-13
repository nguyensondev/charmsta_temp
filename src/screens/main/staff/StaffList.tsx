import { Fab, FlatList } from "native-base"
import React, { useCallback, useMemo, useState } from "react"
import { ListRenderItemInfo } from "react-native"

import { ButtonCustom, Header, Screen } from "@components/index"
import { TextFieldCustom } from "@components/text-field"
import Text from "@components/text/text"
import { useStaff } from "@hooks/staff"
import { StaffDTO } from "@models/backend/response/Staff"
import { MAIN_SCREENS } from "@models/enum/screensName"

import { goBack, navigate } from "@navigators/navigation-utilities"
import { useFocusEffect } from "@react-navigation/native"
import { color } from "@theme/color"
import { spacing } from "@theme/spacing"
import { debounce } from "lodash"

const StaffListScreen = () => {
  const [searchText, setSearchText] = useState("")
  const { getStaff, staffs, page, totalPages } = useStaff()

  useFocusEffect(
    useCallback(() => {
      getStaff()
    }, []),
  )

  const onEndReached = () => {
    if (page < totalPages) {
      getStaff(page + 1)
    }
  }

  const _renderItem = ({ item }: ListRenderItemInfo<StaffDTO>) => {
    const { name } = item

    const onStaffPress = () => {
      // handle staff press event
      navigate(MAIN_SCREENS.staffProfile, { detail: item })
    }

    return (
      <ButtonCustom
        onPress={onStaffPress}
        rounded={"none"}
        w="full"
        backgroundColor={color.palette.white}
        borderBottomColor={color.palette.lighterGrey}
        borderBottomWidth={"1"}
        justifyContent="flex-start"
      >
        <Text text={name} marginY="1" />
      </ButtonCustom>
    )
  }

  const renderSearchBar = useCallback(() => {
    const handleChangeText = (text: string) => {
      setSearchText(text)
    }

    const debounceChangeText = debounce(handleChangeText, 500)

    return (
      <TextFieldCustom
        style={{ paddingVertical: spacing[0] }}
        onChangeText={debounceChangeText}
        placeholder={"Input staff's name here"}
        hideError
      />
    )
  }, [])

  const fitleredStaffs = useMemo(
    () => staffs.filter((staff) => staff.name.toLowerCase().includes(searchText.toLowerCase())),
    [searchText, staffs],
  )

  return (
    <Screen>
      <Header headerTx={"screens.headerTitle.staffList"} leftIcon="back" onLeftPress={goBack} />
      <FlatList
        ListHeaderComponent={renderSearchBar}
        stickyHeaderIndices={[0]}
        data={fitleredStaffs}
        keyExtractor={(item) => item.id.toString()}
        renderItem={_renderItem}
        onEndReached={onEndReached}
      />
      <Fab
        bottom={50}
        onPress={() => navigate(MAIN_SCREENS.staffProfile, { editable: true })}
        _pressed={{ opacity: 0.2 }}
        h={16}
        w={16}
        label={"+"}
        size="lg"
        rounded={"full"}
        backgroundColor={color.palette.black}
        renderInPortal={false}
      />
    </Screen>
  )
}

export default StaffListScreen
