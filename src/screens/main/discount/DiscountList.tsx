import { Header, Screen } from "@components/index"
import Text from "@components/text/text"
import { useDiscount } from "@hooks/discount"
import { DiscountDTO } from "@models/backend/response/Discount"
import { MAIN_SCREENS } from "@models/enum/screensName"
import { MainNavigatorParamList } from "@models/navigator"
import { navigate } from "@navigators/navigation-utilities"
import { useFocusEffect } from "@react-navigation/native"
import { color } from "@theme/color"
import { spacing } from "@theme/spacing"
import { convertCurrency } from "@utils/data"
import { Column, Fab, Row, ScrollView } from "native-base"
import React, { useCallback } from "react"
import { TouchableOpacity } from "react-native"
import { isEmpty } from "validate.js"
import { nativeBaseStyles } from "./styles"

interface DiscountListScreenProps {}

const DiscountListScreen = (props: DiscountListScreenProps) => {
  const { getDiscounts, discounts } = useDiscount()

  useFocusEffect(
    useCallback(() => {
      getDiscounts()
    }, []),
  )
  const onFabPress = () => {
    navigate(MAIN_SCREENS.newDiscount)
  }

  const RenderItem = ({ item }: { item: DiscountDTO }) => {
    const { name, amount, description, percentage } = item

    const onItemPress = () => {
      navigate(MAIN_SCREENS.discountDetail, {
        detail: item,
      } as MainNavigatorParamList[MAIN_SCREENS.discountDetail])
    }

    return (
      <TouchableOpacity onPress={onItemPress}>
        <Row {...nativeBaseStyles.discountItemContainer}>
          <Column>
            <Text fontWeight={"bold"} text={name} />
            {!isEmpty(description) ? <Text text={description} noOfLines={1} /> : null}
          </Column>
          <Text
            fontWeight={"bold"}
            text={percentage ? amount.toString() + " %" : convertCurrency(amount)}
            alignSelf="center"
          />
        </Row>
      </TouchableOpacity>
    )
  }

  return (
    <Screen>
      <Header leftIcon="back" headerTx="screens.headerTitle.discountList" />
      <ScrollView px={spacing[1]} scrollEnabled>
        {discounts.map((discount) => (
          <RenderItem key={discount.id.toString()} item={discount} />
        ))}
      </ScrollView>
      <Fab
        bottom={50}
        onPress={onFabPress}
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

export default DiscountListScreen
