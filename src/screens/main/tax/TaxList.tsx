import { Header, Screen } from "@components/index"
import { TextFieldCustom } from "@components/text-field"
import Text from "@components/text/text"
import { useTax } from "@hooks/tax"
import { TaxDTO } from "@models/backend/response/Tax"
import { MAIN_SCREENS } from "@models/enum/screensName"
import { MainNavigatorParamList } from "@models/navigator"
import { navigate } from "@navigators/navigation-utilities"
import { useFocusEffect } from "@react-navigation/native"
import { color } from "@theme/color"
import { spacing } from "@theme/spacing"
import { debounce, isEmpty } from "lodash"
import { Fab, FlatList, Row } from "native-base"
import React, { useCallback, useMemo, useState } from "react"
import { TouchableOpacity } from "react-native"

interface TaxListScreenProps {}

const TaxListScreen = (props: TaxListScreenProps) => {
  const { getTaxList, taxList } = useTax()
  const [searchText, setSearchText] = useState("")

  useFocusEffect(
    useCallback(() => {
      getTaxList()
    }, []),
  )

  const onSearchChange = useCallback(
    debounce((text: string) => setSearchText(text), 500),
    [searchText],
  )

  const renderHeader = useCallback(
    () => <TextFieldCustom placeholder="Enter tax name here" onChangeText={onSearchChange} />,
    [],
  )

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
    () => (isEmpty(searchText) ? taxList : taxList.filter(({ name }) => name.includes(searchText))),
    [searchText, taxList],
  )

  return (
    <Screen>
      <Header leftIcon="back" headerTx="screens.headerTitle.taxList" />
      <FlatList
        ListHeaderComponent={renderHeader}
        data={fitleredTaxList}
        renderItem={renderItem}
        px={spacing[1]}
      />
      {renderNewService()}
    </Screen>
  )
}

export default TaxListScreen
