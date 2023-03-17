import { EmptyData, Header, Screen } from "@components/index"
import SearchBar, { RefSearch } from "@components/search-bar/SearchBar"
import Text from "@components/text/text"
import { useTax } from "@hooks/tax"
import { translate } from "@i18n/translate"
import { TaxDTO } from "@models/backend/response/Tax"
import { MAIN_SCREENS } from "@models/enum/screensName"
import { MainNavigatorParamList } from "@models/navigator"
import { navigate } from "@navigators/navigation-utilities"
import { useFocusEffect } from "@react-navigation/native"
import { color } from "@theme/color"
import { spacing } from "@theme/spacing"
import { debounce, get, isEmpty } from "lodash"
import { Fab, Row } from "native-base"
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { Alert, FlatList, TouchableOpacity } from "react-native"
import { styles } from "./styles"

interface TaxListScreenProps {}

const TaxListScreen = (props: TaxListScreenProps) => {
  const [searchText, setSearchText] = useState("")
  const { getTaxList, taxList, error } = useTax()
  const searchBarRef = useRef<RefSearch>()
  const searchPhrase = get(searchBarRef.current, "searchPhrase", "")

  useEffect(() => {
    if (!isEmpty(error)) {
      Alert.alert("Error", translate("errors.unexpected"))
    }
  }, [error])

  useFocusEffect(
    useCallback(() => {
      getTaxList()
    }, []),
  )

  const onSearchChange = debounce((text: string) => setSearchText(text), 500)

  const onSearchCancel = () => {
    // handle search bar cancel action
  }

  // const renderHeader = useCallback(
  //   () => <TextFieldCustom placeholder="Enter tax name here" onChangeText={onSearchChange} />,
  //   [],
  // )

  const renderItem = ({ item }: { item: TaxDTO }) => {
    const { name, rate } = item

    const onItemPress = () => {
      navigate(MAIN_SCREENS.taxDetail, {
        detail: item,
      } as MainNavigatorParamList[MAIN_SCREENS.taxDetail])
    }

    return (
      <TouchableOpacity onPress={onItemPress}>
        <Row
          borderRadius={"2xl"}
          borderWidth={1}
          p={spacing[1]}
          mb={spacing[1]}
          justifyContent="space-between"
        >
          <Text text={name} fontWeight="bold" />
          <Text text={`${rate} %`} />
        </Row>
      </TouchableOpacity>
    )
  }

  const renderNewService = useCallback(() => {
    return (
      <Fab
        position={"absolute"}
        bottom={50}
        onPress={() => navigate(MAIN_SCREENS.newTax)}
        _pressed={{ opacity: 0.2 }}
        h={16}
        w={16}
        label={"+"}
        size="lg"
        rounded={"full"}
        backgroundColor={color.palette.black}
        renderInPortal={false}
      />
    )
  }, [])

  const fitleredTaxList = useMemo(
    () =>
      isEmpty(searchText)
        ? taxList
        : taxList.filter(({ name }) =>
            name.toLocaleLowerCase().includes(searchText.toLocaleLowerCase()),
          ),
    [searchText, taxList],
  )

  return (
    <Screen>
      <Header leftIcon="back" headerTx="screens.headerTitle.taxList" />
      <SearchBar ref={searchBarRef} onChangeText={onSearchChange} cancelAction={onSearchCancel} />
      <FlatList
        ListEmptyComponent={<EmptyData />}
        data={fitleredTaxList}
        renderItem={renderItem}
        style={styles.list}
        contentContainerStyle={styles.contentList}
      />
      {renderNewService()}
    </Screen>
  )
}

export default TaxListScreen
