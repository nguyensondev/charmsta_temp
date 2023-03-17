import { Header, Screen } from "@components/index"
import { TextFieldCustom } from "@components/text-field"
import Text from "@components/text/text"
import { useUtility } from "@hooks/utility"
import { PredictionDTO } from "@models/backend/response/Ulities"
import { AUTH_SCREENS, COMMON_SCREENS, MAIN_SCREENS } from "@models/enum/screensName"
import {
  AuthNavigatorParamList,
  CommonNavigatorParamList,
  MainNavigatorParamList,
} from "@models/navigator"
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native"
import { StackNavigationProp } from "@react-navigation/stack"
import { spacing } from "@theme/spacing"
import { debounce } from "lodash"
import { FlatList, View } from "native-base"
import React, { useCallback } from "react"
import { TouchableOpacity } from "react-native"

interface SearchLocationScreenProps {}

const Item = ({
  item,
  onItemPress,
}: {
  item: PredictionDTO
  onItemPress: (prediction: PredictionDTO) => void
}) => {
  const { description, terms, types, structured_formatting } = item
  const placeType = types[types.length - 1]
  switch (placeType) {
    case "geocode":
      return (
        <TouchableOpacity onPress={() => onItemPress(item)}>
          <View borderWidth={1} padding={spacing[1]} borderRadius="2xl" mb={spacing[1]}>
            <Text noOfLines={1} text={description} />
          </View>
        </TouchableOpacity>
      )
    case "establishment":
      const { main_text, secondary_text } = structured_formatting
      return (
        <TouchableOpacity onPress={() => onItemPress(item)}>
          <View borderWidth={1} padding={spacing[1]} borderRadius="2xl" mb={spacing[1]}>
            <Text noOfLines={1} text={main_text} fontWeight="bold" />
            <Text noOfLines={1} text={secondary_text} />
          </View>
        </TouchableOpacity>
      )
    default:
      return null
  }
}

const SearchLocationScreen = (props: SearchLocationScreenProps) => {
  const { navigate, getState } = useNavigation<StackNavigationProp<MainNavigatorParamList>>()
  const {
    params: { fromScreen, type = "geocode" },
  } = useRoute<RouteProp<CommonNavigatorParamList, COMMON_SCREENS.searchLocation>>()
  const { searchLocation, predictions } = useUtility()
  const { routes, index: rootIndex } = getState()
  const handleSearch = debounce((text) => {
    searchLocation(text, type)
  }, 500)

  const onItemPress = (prediction: PredictionDTO) => {
    const { terms, structured_formatting } = prediction
    const { main_text, secondary_text } = structured_formatting
    const [country, state, city, ...address] = terms.reverse()
    let formattedAdress: any = {}
    if (type === "establishment") {
      formattedAdress["name"] = main_text
      address.pop()
    }

    formattedAdress = {
      ...formattedAdress,
      address: terms.length > 3 ? (type === "geocode" ? main_text : secondary_text) : "",
      city: city?.value,
      state: state?.value,
    }
    const previousParams = routes.find((route, index) => index === rootIndex - 1).params as any

    switch (fromScreen) {
      case AUTH_SCREENS.storeForm:
        // const previousParams = routes.find((route, index) => index === rootIndex - 1)
        //   .params as AuthNavigatorParamList[AUTH_SCREENS.storeForm]
        previousParams.data = {
          ...previousParams.data,
          store: { ...previousParams.data?.store, ...formattedAdress },
        } as AuthNavigatorParamList[AUTH_SCREENS.storeForm]
        navigate(fromScreen, previousParams as never)
        break
      case MAIN_SCREENS.editAccount:
        return navigate(fromScreen, {
          newAddress: formattedAdress.address,
        } as never)
      case MAIN_SCREENS.storeDetail:
        navigate(fromScreen, {
          storeDetail: { ...previousParams.storeDetail, ...formattedAdress },
        } as never)
        break
    }
  }

  const HeaderComponent = useCallback(
    () => <TextFieldCustom onChangeText={handleSearch} placeholder="Enter your address here" />,
    [],
  )

  return (
    <Screen>
      <Header leftIcon="back" />
      <FlatList
        px={spacing[1]}
        ListHeaderComponent={HeaderComponent}
        data={predictions}
        renderItem={({ item }) => <Item item={item} onItemPress={onItemPress} />}
        keyExtractor={(item) => item.place_id}
      />
    </Screen>
  )
}

export default SearchLocationScreen
