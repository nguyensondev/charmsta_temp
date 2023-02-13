import { Header } from "@components/header/header"
import Loading from "@components/loading/Loading"
import { Screen } from "@components/screen/screen"
import SearchBar from "@components/search-bar"
import { RefSearch } from "@components/search-bar/SearchBar"
import Text from "@components/text"
import VectorIcon from "@components/vectorIcon/vectorIcon"
import { useService } from "@hooks/service/useService"
import { CategoryDTO, ServiceDTO } from "@models/backend/response/Service"
import { MAIN_SCREENS } from "@models/enum/screensName"

import { navigate } from "@navigators/navigation-utilities"
import { useFocusEffect } from "@react-navigation/native"
import { color } from "@theme/color"
import { spacing } from "@theme/spacing"
import { convertCurrency, getFilteredCategoryList } from "@utils/data"
import { debounce, isEmpty, isNull, omit } from "lodash"
import { Box, Fab, FlatList, Row, View } from "native-base"
import React, { useCallback, useRef, useState } from "react"
import { Image, TouchableOpacity } from "react-native"
import styles from "./styles"

const Item = ({ item }: { item: ServiceDTO }) => (
  <View style={[styles.item, { backgroundColor: item.color }]}>
    <View style={styles.containerItem}>
      <Image
        style={styles.serviceImage}
        source={{ uri: !isNull(item.photo) ? item.photo : null }}
      />
    </View>
    <View style={styles.subContainerItem}>
      <View style={styles.viewNamePrice}>
        <Text ellipsizeMode="tail" numberOfLines={1} style={styles.serviceName}>
          {item.name}
        </Text>
        <Text style={styles.servicePrice}>{convertCurrency(item.price)}</Text>
      </View>

      <Text style={styles.serviceTime}>{item.serviceDuration + " minutes"}</Text>
    </View>
  </View>
)

const RenderItem = ({ item, index }: { item: CategoryDTO; index: number }) => {
  const [isOpen, setOpen] = useState(true)
  const goDetail = (detail: ServiceDTO, category: CategoryDTO) => {
    navigate(MAIN_SCREENS.serviceDetail, {
      detail,
      category: omit(category, "services", "packages"),
    })
  }

  if (isEmpty(item.services)) return null
  return (
    <View my={spacing[1]}>
      <TouchableOpacity onPress={() => setOpen(!isOpen)}>
        <Row justifyContent={"space-between"}>
          <Text text={item.name} style={styles.categoryLabel} />
          <VectorIcon iconSet="ion" name={isOpen ? "chevron-up" : "chevron-down"} size={24} />
        </Row>
      </TouchableOpacity>
      <Box display={isOpen ? "flex" : "none"} mt={spacing[1] / 2}>
        {item.services
          .sort((a, b) => a.name.localeCompare(b.name))
          .map((cateService) => (
            <TouchableOpacity
              key={`${item.id}-${cateService.id}`}
              onPress={() => goDetail(cateService, item)}
            >
              <Item item={cateService} />
            </TouchableOpacity>
          ))}
      </Box>
    </View>
  )
}

const ServiceListScreen = () => {
  const [searchText, setSearchText] = useState("")
  const ref = useRef<RefSearch>(null)

  const {
    loadingServiceList,
    getServiceList,
    serviceList,
    pagination,
    getCatList,
    catList,
    loadingCatList,
  } = useService()

  useFocusEffect(
    useCallback(() => {
      getCatList("")
    }, []),
  )

  const cancelAction = () => {
    setSearchText("")
  }

  const searchAction = () => {
    if (ref && ref.current) {
      getServiceList(ref.current.searchPhrase.trim(), 0)
    }
  }

  const renderEmpty = useCallback(() => {
    return (
      <View style={styles.empty}>
        <Text tx="common.empty" />
      </View>
    )
  }, [])

  const renderServiceList = () => {
    return (
      <View style={styles.viewServiceList}>
        {loadingCatList && isEmpty(catList) ? (
          <Loading color={"black"} />
        ) : catList.length === 0 ? (
          renderEmpty()
        ) : (
          <FlatList
            px={spacing[1]}
            data={getFilteredCategoryList(catList, searchText)}
            renderItem={(item) => <RenderItem {...item} />}
            keyExtractor={(item) => item.id.toString()}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    )
  }

  const renderNewService = useCallback(() => {
    return (
      <Fab
        position={"absolute"}
        bottom={50}
        onPress={() => navigate(MAIN_SCREENS.newService)}
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

  // const renderButtonCategory = useCallback(() => {
  //   return (
  //     <ButtonCustom
  //       isLoading={false}
  //       disabled={false}
  //       w="90%"
  //       marginTop={spacing[1]}
  //       onPress={handleCategoryButtonPress}
  //     >
  //       <Text text={"Category"} style={{ color: color.palette.white }} />
  //     </ButtonCustom>
  //   )
  // }, [])

  // const handleCategoryButtonPress = async () => {
  //   navigate(MAIN_SCREENS.categoryList)
  // }

  const handleSearchBarChange = debounce(setSearchText, 300)

  return (
    <Screen style={styles.body}>
      <Header headerTx="screens.headerTitle.serviceList" leftIcon="back" />
      <SearchBar
        searchAction={searchAction}
        cancelAction={cancelAction}
        ref={ref}
        onChangeText={handleSearchBarChange}
      />
      {/* {renderButtonCategory()} */}
      {renderServiceList()}
      {renderNewService()}
    </Screen>
  )
}

export default ServiceListScreen
