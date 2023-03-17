import { useFocusEffect } from "@react-navigation/native"
import { Box, Fab, FlatList } from "native-base"
import React, { useCallback, useEffect, useRef } from "react"
import { Alert, Image, TouchableOpacity } from "react-native"

import { EmptyData, Header, Screen } from "@components/index"
import Loading from "@components/loading/Loading"
import SearchBar, { RefSearch } from "@components/search-bar/SearchBar"
import Text from "@components/text/text"
import { useProduct } from "@hooks/product"
import { MAIN_SCREENS } from "@models/enum/screensName"

import { translate } from "@i18n/translate"
import { goBack, navigate } from "@navigators/navigation-utilities"
import { color } from "@theme/color"
import { spacing } from "@theme/spacing"
import { debounce, isEmpty } from "lodash"
import { styles } from "./styles"

const ProductListScreen = () => {
  const { loading, products, getProducts, pagination, error } = useProduct()
  const searchBarRef = useRef<RefSearch>()

  useEffect(() => {
    if (!isEmpty(error)) {
      Alert.alert("Error", translate("errors.unexpected"))
    }
  }, [error])

  useFocusEffect(
    useCallback(() => {
      getProducts(searchBarRef.current.searchPhrase, pagination.page)
    }, []),
  )
  const cancelAction = () => {
    getProducts("", 0)
  }

  const searchAction = debounce((text: string) => {
    // if (searchBarRef && searchBarRef.current) {
    getProducts(text.trim(), 0)
    // }
  }, 1000)
  const handleLoadMore = () => {
    if (pagination.page < pagination.totalPages) {
      getProducts(searchBarRef.current.searchPhrase.trim(), pagination.page + 1)
    }
  }

  const _renderItem = ({ item }) => {
    const { name, photo, stocks } = item

    const onItemPress = () => {
      navigate(MAIN_SCREENS.productDetail, { detail: item })
    }

    return (
      <TouchableOpacity onPress={onItemPress}>
        <Box
          borderWidth={1}
          borderColor={"gray.400"}
          marginBottom={spacing[1]}
          marginX={spacing[1]}
          padding={spacing[1] / 2}
          borderRadius="md"
          flexDir="row"
          alignItems="center"
        >
          <Image
            source={{
              uri: photo,
            }}
            style={styles.productItemImage}
          />
          <Box paddingLeft={spacing[1]} flex={1}>
            <Text text={name} />
            <Text
              tx={"product.productList.item.quantity"}
              txOptions={{
                quantity: stocks,
              }}
            />
          </Box>
        </Box>
      </TouchableOpacity>
    )
  }

  return (
    <Screen>
      <Header headerTx="screens.headerTitle.productList" leftIcon="back" onLeftPress={goBack} />
      <SearchBar ref={searchBarRef} onChangeText={searchAction} cancelAction={cancelAction} />
      {loading && isEmpty(products) ? (
        <Loading color={"black"} />
      ) : (
        <FlatList
          ListEmptyComponent={<EmptyData />}
          onEndReached={handleLoadMore}
          paddingTop={spacing[1]}
          data={products}
          renderItem={_renderItem}
          contentContainerStyle={{ flexGrow: 1 }}
        />
      )}
      <Fab
        onPress={() => navigate(MAIN_SCREENS.productDetail, { editable: true })}
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

export default ProductListScreen
