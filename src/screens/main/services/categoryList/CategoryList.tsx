import { EmptyData } from "@components/empty"
import { Header } from "@components/header/header"
import Loading from "@components/loading/Loading"
import { Screen } from "@components/screen/screen"
import SearchBar from "@components/search-bar"
import { RefSearch } from "@components/search-bar/SearchBar"
import Text from "@components/text"
import { useService } from "@hooks/service/useService"
import { translate } from "@i18n/translate"
import { CategoryDTO } from "@models/backend/response/Service"
import { MAIN_SCREENS } from "@models/enum/screensName"

import { navigate } from "@navigators/navigation-utilities"
import { useFocusEffect } from "@react-navigation/native"
import { color } from "@theme/color"
import { debounce, isEmpty } from "lodash"
import { Fab } from "native-base"
import * as React from "react"
import { useCallback } from "react"
import { Alert, FlatList, TouchableOpacity, View } from "react-native"
import styles from "./styles"

const Item = ({ item }: { item: CategoryDTO }) => (
  <View style={styles.item}>
    <View style={styles.subContainerItem}>
      <View style={styles.viewNamePrice}>
        <Text ellipsizeMode="tail" numberOfLines={1} style={styles.serviceName}>
          {item.name}
        </Text>
      </View>
    </View>
  </View>
)

const CategoryListScreen = () => {
  const ref = React.useRef<RefSearch>(null)

  const { loadingCatList, getCatList, catList, errCatList } = useService()

  React.useEffect(() => {
    if (!isEmpty(errCatList)) {
      Alert.alert("Error", translate("errors.unexpected"))
    }
  }, [errCatList])

  useFocusEffect(
    useCallback(() => {
      getCatList("")
    }, []),
  )

  const cancelAction = () => {
    getCatList("")
  }

  const searchAction = debounce((text: string) => {
    // if (ref && ref.current) {

    getCatList(text.trim())
    // }
  }, 1000)

  const goDetail = (detail: CategoryDTO) => {
    navigate(MAIN_SCREENS.categoryDetail, { detail, editable: false })
  }

  const renderItem = ({ item }: { item: CategoryDTO }) => {
    return (
      <TouchableOpacity onPress={() => goDetail(item)}>
        <Item item={item} />
      </TouchableOpacity>
    )
  }

  const renderCatList = useCallback(() => {
    return (
      <View style={styles.viewServiceList}>
        {loadingCatList ? (
          <Loading color={"black"} />
        ) : catList.length === 0 ? (
          <EmptyData />
        ) : (
          <FlatList
            data={catList}
            renderItem={renderItem}
            keyExtractor={(item) => item.id.toString()}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    )
  }, [catList, loadingCatList])

  const renderNewCat = useCallback(() => {
    return (
      <Fab
        position={"absolute"}
        bottom={50}
        onPress={() => navigate(MAIN_SCREENS.newCategory)}
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
  return (
    <Screen style={styles.body}>
      <Header headerTx="screens.headerTitle.categoryList" leftIcon="back" />
      <SearchBar onChangeText={searchAction} cancelAction={cancelAction} ref={ref} />
      {renderCatList()}
      {renderNewCat()}
    </Screen>
  )
}

export default CategoryListScreen
