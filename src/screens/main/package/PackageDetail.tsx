import { ButtonCustom, Header, Screen } from "@components/index"
import { MultiServices } from "@components/multi-select"
import { TextFieldCustom } from "@components/text-field"
import Text from "@components/text/text"
import { usePackage } from "@hooks/package"
import { TxKeyPath } from "@i18n/i18n"
import { translate } from "@i18n/translate"
import { MAIN_SCREENS } from "@models/enum/screensName"
import { MainNavigatorParamList } from "@models/navigator"
import { goBack, navigate } from "@navigators/navigation-utilities"
import { RouteProp, useFocusEffect, useRoute } from "@react-navigation/native"
import { color } from "@theme/color"
import { spacing } from "@theme/spacing"
import { convertCurrency, totalServicesPrice } from "@utils/data"
import { CheckIcon, FormControl, Row, ScrollView, Select, View } from "native-base"
import React, { useCallback, useLayoutEffect, useMemo } from "react"
import { Alert } from "react-native"
import { nativeBaseStyle, styles } from "./styles"
interface PackageDetailScreenProps {}

const defaultTextFieldProps = {
  paddingLeft: "1.5",
  hideError: true,
  style: {
    paddingBottom: 0,
  },
}

const PackageDetailScreen = (props: PackageDetailScreenProps) => {
  const { params } = useRoute<RouteProp<MainNavigatorParamList, MAIN_SCREENS.packageDetail>>()
  const { packageId } = params

  const { getPackageDetail, packageDetail, deletePackage, deletePackageStatus } = usePackage()
  const { categoryId, category, cost, name, services, price } = packageDetail
  useLayoutEffect(() => {
    if (deletePackageStatus) {
      goBack()
    }
  }, [deletePackageStatus])

  useFocusEffect(
    useCallback(() => {
      getPackageDetail(packageId)
    }, []),
  )

  const onDeletePress = () => {
    Alert.alert("Delete package", "Are you sure want to delete?", [
      { text: translate("button.no") },
      { text: translate("button.yes"), onPress: () => deletePackage(packageId) },
    ])
  }

  const onEditPress = () => {
    navigate(MAIN_SCREENS.editPackage, {
      packageDetail,
    } as MainNavigatorParamList[MAIN_SCREENS.editPackage])
  }

  const RenderFooter = () => (
    <Row justifyContent={"space-evenly"} marginBottom={spacing[2]} px={spacing[1]}>
      <ButtonCustom
        backgroundColor={color.error}
        textStyle={styles.deleteTxt}
        tx="button.delete"
        width={"48%"}
        onPress={onDeletePress}
      />
      <ButtonCustom
        backgroundColor={"transparent"}
        borderWidth={1}
        borderColor={color.palette.lightGrey}
        textStyle={styles.editTxt}
        tx="button.edit"
        width={"48%"}
        onPress={onEditPress}
      />
    </Row>
  )

  const totalPrice = useMemo(() => totalServicesPrice(services), [services])

  return (
    <Screen>
      <Header headerTx={"screens.headerTitle.packageDetail" as TxKeyPath} leftIcon="back" />
      <ScrollView px={spacing[1]}>
        {/* avatar */}
        {/* <Avatar /> */}
        {/* name */}
        <FormControl pointerEvents="none">
          <FormControl.Label {...nativeBaseStyle.form.inputLabel}>
            <Text tx="textInput.label.name" />
          </FormControl.Label>
          <TextFieldCustom {...defaultTextFieldProps} value={name} />
        </FormControl>
        {/* category */}
        <FormControl pointerEvents="none">
          <FormControl.Label {...nativeBaseStyle.form.inputLabel}>
            <Text tx="textInput.label.category" />
          </FormControl.Label>
          <Select
            py={spacing[1]}
            fontSize={18}
            paddingLeft={"1.5"}
            _selectedItem={{
              bg: "teal.600",
              endIcon: <CheckIcon size="5" />,
            }}
            borderWidth={0}
            borderBottomWidth={1}
            borderColor={color.palette.lighterGrey}
            borderRadius={0}
            selectedValue={categoryId?.toString()}
            dropdownIcon={<View />}
          >
            <Select.Item
              key={category?.id?.toString()}
              label={category?.name}
              value={category?.id?.toString()}
            />
          </Select>
        </FormControl>
        {/* price */}
        <FormControl pointerEvents="none">
          <FormControl.Label {...nativeBaseStyle.form.inputLabel}>
            <Text tx="textInput.label.price" />
          </FormControl.Label>
          <TextFieldCustom
            {...defaultTextFieldProps}
            keyboardType="numeric"
            value={convertCurrency(totalPrice)}
          />
        </FormControl>
        {/* retail price */}
        <FormControl pointerEvents="none">
          <FormControl.Label {...nativeBaseStyle.form.inputLabel}>
            <Text tx="textInput.label.retailPrice" />
          </FormControl.Label>
          <TextFieldCustom
            {...defaultTextFieldProps}
            keyboardType="numeric"
            value={convertCurrency(price)}
          />
        </FormControl>
        {/* services */}
        <FormControl pointerEvents="none">
          <FormControl.Label {...nativeBaseStyle.form.inputLabel}>
            <Text tx="textInput.label.services" />
          </FormControl.Label>
          <MultiServices defaultValues={services} displayOnly />
        </FormControl>
      </ScrollView>
      <RenderFooter />
    </Screen>
  )
}

export default PackageDetailScreen
