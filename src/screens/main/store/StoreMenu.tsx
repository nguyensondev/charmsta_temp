import { Header, Screen } from "@components/index"
import Text from "@components/text/text"
import { TxKeyPath } from "@i18n/i18n"
import { MAIN_SCREENS } from "@models/enum/screensName"

import { navigate } from "@navigators/navigation-utilities"
import { color } from "@theme/color"
import { spacing } from "@theme/spacing"
import { Box, FlatList } from "native-base"
import * as React from "react"
import { TouchableOpacity } from "react-native"
import { styles } from "./styles"

interface StoreMenuScreenProps {}

const StoreMenuScreen = (props: StoreMenuScreenProps) => {
  const storeMenu: { screenName: string }[] = [
    { screenName: MAIN_SCREENS.staffList },
    { screenName: MAIN_SCREENS.productList },
    { screenName: MAIN_SCREENS.serviceList },
    { screenName: MAIN_SCREENS.labelList },
    { screenName: MAIN_SCREENS.categoryList },
    { screenName: MAIN_SCREENS.packageList },
    { screenName: MAIN_SCREENS.taxList },
    { screenName: MAIN_SCREENS.discountList },
  ].sort((a, b) => a.screenName.localeCompare(b.screenName))

  const _renderItem = ({ item: { screenName } }) => {
    const onItemPress = () => {
      navigate(screenName)
    }

    return (
      <TouchableOpacity onPress={onItemPress}>
        <Box padding={spacing[1]}>
          <Text tx={`screens.headerTitle.${screenName}` as TxKeyPath} />
        </Box>
      </TouchableOpacity>
    )
  }

  return (
    <Screen>
      <Header headerText="Store menu" leftIcon="back" />
      <FlatList
        data={storeMenu}
        contentContainerStyle={styles.menuContentContainer}
        ItemSeparatorComponent={() => (
          <Box borderBottomWidth={1} borderBottomColor={color.palette.lightGrey} />
        )}
        renderItem={_renderItem}
        keyExtractor={(item) => item.screenName}
      />
    </Screen>
  )
}

export default StoreMenuScreen
