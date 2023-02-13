import { ButtonCustom, Header, Screen } from "@components/index"
import { TextFieldCustom } from "@components/text-field"
import { useDiscount } from "@hooks/discount"
import { translate } from "@i18n/translate"
import { MAIN_SCREENS } from "@models/enum/screensName"
import { useStores } from "@models/index"
import { MainNavigatorParamList } from "@models/navigator"
import { goBack, navigate } from "@navigators/navigation-utilities"
import { RouteProp, useRoute } from "@react-navigation/native"
import { color } from "@theme/color"
import { spacing } from "@theme/spacing"
import { Row, ScrollView } from "native-base"
import * as React from "react"
import { Alert, StyleSheet } from "react-native"

interface DiscountDetailScreenProps {}

const DiscountDetailScreen = (props: DiscountDetailScreenProps) => {
  const {
    params: { detail },
  } = useRoute<RouteProp<MainNavigatorParamList, MAIN_SCREENS.discountDetail>>()
  const { name, amount, percentage, description, id } = detail

  const { deleteDiscount, isDeleted } = useDiscount()
  const {
    currentStoreStore: {
      CurrentStore: { currency },
    },
  } = useStores()

  React.useEffect(() => {
    if (isDeleted) {
      Alert.alert("Deleted", "Your discount has been deleted successful")
      goBack()
    }
  }, [isDeleted])

  const onDeletePress = () => {
    Alert.alert("Warning", "Are you sure you want to delete this discount?", [
      { text: "No" },
      {
        text: "Yes",
        onPress: () => deleteDiscount(id),
        style: "destructive",
      },
    ])
  }

  const onEditPress = () => {
    navigate(MAIN_SCREENS.editDiscount, {
      detail,
    } as MainNavigatorParamList[MAIN_SCREENS.editDiscount])
  }

  const RenderBody = () => (
    <ScrollView px={spacing[1]}>
      <TextFieldCustom
        hideError
        labelTx="textInput.label.name"
        defaultValue={name}
        pointerEvents="none"
      />
      <Row justifyContent={"space-between"} pointerEvents="none">
        <TextFieldCustom
          pointerEvents="none"
          hideError
          labelTx="textInput.label.amount"
          style={{ width: "65%" }}
          defaultValue={amount.toString()}
        />
        <TextFieldCustom
          editable={false}
          hideError
          labelTx="textInput.label.type"
          style={{ width: "30%" }}
          isHasButton
          value={percentage ? "%" : currency}
        />
      </Row>
      <TextFieldCustom
        pointerEvents="none"
        hideError
        labelTx="textInput.label.description"
        defaultValue={description}
      />
    </ScrollView>
  )

  const RenderFooter = () => (
    <Row justifyContent={"space-evenly"} marginBottom={spacing[2]} px={spacing[1]}>
      <ButtonCustom
        backgroundColor={color.error}
        // textStyle={styles.deleteTxt}

        width={"48%"}
        onPress={onDeletePress}
      >
        {translate("button.delete")}
      </ButtonCustom>
      <ButtonCustom
        borderWidth={1}
        borderColor={color.palette.lightGrey}
        // textStyle={styles.editTxt}

        width={"48%"}
        onPress={onEditPress}
      >
        {translate("button.edit")}
      </ButtonCustom>
    </Row>
  )

  return (
    <Screen>
      <Header leftIcon="back" />
      <RenderBody />
      <RenderFooter />
    </Screen>
  )
}

export default DiscountDetailScreen

const styles = StyleSheet.create({
  container: {},
})
