import { EmptyData, Header, Screen } from "@components/index"
import SearchBar, { RefSearch } from "@components/search-bar/SearchBar"
import Text from "@components/text/text"
import VectorIcon from "@components/vectorIcon/vectorIcon"
import { useService } from "@hooks/service/useService"
import { translate } from "@i18n/translate"
import { PackageDTO } from "@models/backend/response/Package"
import { CategoryDTO } from "@models/backend/response/Service"
import { MAIN_SCREENS } from "@models/enum/screensName"

import { navigate } from "@navigators/navigation-utilities"
import { useFocusEffect } from "@react-navigation/native"
import { color } from "@theme/color"
import { spacing } from "@theme/spacing"
import { convertCurrency, getFilteredCategoryList } from "@utils/data"
import { convertMinsValue } from "@utils/time"
import { debounce, isEmpty } from "lodash"
import { Box, Fab, FlatList, Row, View } from "native-base"
import React, { useCallback, useEffect, useRef, useState } from "react"
import { Alert, TouchableOpacity } from "react-native"
import { styles } from "./styles"
interface PackageListScreenProps {}

const PackageListScreen = (props: PackageListScreenProps) => {
  const [searchText, setSearchText] = useState("")

  const { getCatList, catList, errCatList } = useService()
  const ref = useRef<RefSearch>(null)

  useEffect(() => {
    if (!isEmpty(errCatList)) {
      Alert.alert("Error", translate("errors.unexpected"))
    }
  }, [errCatList])

  useFocusEffect(
    useCallback(() => {
      getCatList(null)
    }, []),
  )

  const cancelAction = () => {
    setSearchText("")
  }

  const onPackagePress = (selectedPackage: Omit<PackageDTO, "services">) => {
    navigate(MAIN_SCREENS.packageDetail, { packageId: selectedPackage.id })
  }

  const RenderItem = ({ item, index }: { item: CategoryDTO; index: number }) => {
    const [isOpen, setOpen] = useState(true)
    if (isEmpty(item.packages)) return null
    return (
      <View my={spacing[1]}>
        <TouchableOpacity onPress={() => setOpen(!isOpen)}>
          <Row justifyContent={"space-between"}>
            <Text text={item.name} style={styles.categoryLabel} />
            <VectorIcon iconSet="ion" name={isOpen ? "chevron-up" : "chevron-down"} size={24} />
          </Row>
        </TouchableOpacity>
        <Box display={isOpen ? "flex" : "none"}>
          {item.packages
            .sort((a, b) => a.name.localeCompare(b.name))
            .map((catPackage) => {
              const { id, name, duration, price } = catPackage
              return (
                <TouchableOpacity
                  key={`${item.id}-${id}`}
                  onPress={() => onPackagePress(catPackage)}
                >
                  <Box
                    borderWidth={1}
                    borderRadius="2xl"
                    padding={spacing[1]}
                    mt={spacing[1]}
                    borderColor={color.palette.lightGrey}
                  >
                    <Row justifyContent={"space-between"}>
                      <Box>
                        <Text text={name} fontWeight="bold" />
                        <Text text={convertMinsValue(duration, "duration")} />
                      </Box>
                      <Text text={convertCurrency(price)} alignSelf="center" />
                    </Row>
                  </Box>
                </TouchableOpacity>
              )
            })}
        </Box>
      </View>
    )
  }

  const handleSearchBarChange = debounce(setSearchText, 300)

  return (
    <Screen>
      <Header headerTx="screens.headerTitle.packageList" leftIcon="back" />
      <SearchBar
        // searchAction={searchAction}
        cancelAction={cancelAction}
        ref={ref}
        onChangeText={handleSearchBarChange}
      />
      <FlatList
        padding={spacing[1]}
        ListEmptyComponent={<EmptyData />}
        data={getFilteredCategoryList(catList, searchText)}
        renderItem={(item) => <RenderItem {...item} />}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ flexGrow: 1 }}
      />
      <Fab
        onPress={() => navigate(MAIN_SCREENS.newPackage)}
        _pressed={{ opacity: 0.2 }}
        bottom={50}
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

export default PackageListScreen
