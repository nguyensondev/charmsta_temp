import { Fab, FlatList } from "native-base"
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { Alert, ListRenderItemInfo } from "react-native"

import { ButtonCustom, EmptyData, Header, Screen } from "@components/index"
import Text from "@components/text/text"
import { useStaff } from "@hooks/staff"
import { StaffDTO } from "@models/backend/response/Staff"
import { MAIN_SCREENS } from "@models/enum/screensName"

import SearchBar, { RefSearch } from "@components/search-bar/SearchBar"
import { translate } from "@i18n/translate"
import { goBack, navigate } from "@navigators/navigation-utilities"
import { useFocusEffect } from "@react-navigation/native"
import { color } from "@theme/color"
import { debounce, get, isEmpty } from "lodash"

const StaffListScreen = () => {
  const [searchText, setSearchText] = useState("")
  const { getStaff, staffs, page, totalPages, error } = useStaff()
  const searchBarRef = useRef<RefSearch>()
  const searchPhrase = get(searchBarRef.current, "searchPhrase", "")

  useEffect(() => {
    if (!isEmpty(error)) {
      Alert.alert("Error", translate("errors.unexpected"))
    }
  }, [error])

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

  const onSearchCancel = () => {
    //handle search bar cancel press
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

  const handleChangeText = (text: string) => {
    setSearchText(text)
  }

  const debounceChangeText = debounce(handleChangeText, 500)

  // const renderSearchBar = useCallback(() => {
  //   const handleChangeText = (text: string) => {
  //     setSearchText(text)
  //   }

  //   return (
  //     <TextFieldCustom
  //       style={{ paddingVertical: spacing[0] }}
  //       onChangeText={debounceChangeText}
  //       placeholder={"Input staff's name here"}
  //       hideError
  //     />
  //   )
  // }, [])

  const fitleredStaffs = useMemo(
    () => staffs.filter((staff) => staff.name.toLowerCase().includes(searchPhrase.toLowerCase())),
    [searchText, staffs],
  )

  return (
    <Screen>
      <Header headerTx={"screens.headerTitle.staffList"} leftIcon="back" onLeftPress={goBack} />
      <SearchBar
        onChangeText={debounceChangeText}
        ref={searchBarRef}
        cancelAction={onSearchCancel}
      />
      <FlatList
        ListEmptyComponent={<EmptyData />}
        data={fitleredStaffs}
        keyExtractor={(item) => item.id.toString()}
        renderItem={_renderItem}
        onEndReached={onEndReached}
        contentContainerStyle={{ flexGrow: 1 }}
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
