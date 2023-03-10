import { ButtonCustom, Header, Screen } from "@components/index"
import { MultiServices } from "@components/multi-select"
import { TextFieldCustom } from "@components/text-field"
import Text from "@components/text/text"
import { usePackage } from "@hooks/package"
import { useService } from "@hooks/service/useService"
import { TxKeyPath } from "@i18n/i18n"
import { CreatePackage } from "@models/backend/request/Package"
import { PackageDetailDTO } from "@models/backend/response/Package"
import { ServiceDTO } from "@models/backend/response/Service"
import { MAIN_SCREENS } from "@models/enum/screensName"
import { MainNavigatorParamList } from "@models/navigator"
import { navigate } from "@navigators/navigation-utilities"
import { RouteProp, useRoute } from "@react-navigation/native"
import { color } from "@theme/color"
import { spacing } from "@theme/spacing"
import { totalServicesPrice } from "@utils/data"
import { convertYupErrorInner } from "@utils/yup/yup"
import { debounce, get, isEmpty } from "lodash"
import { CheckIcon, ChevronDownIcon, FormControl, ScrollView, Select } from "native-base"
import React, { useEffect, useMemo, useState } from "react"
import * as yup from "yup"
import { nativeBaseStyle } from "./styles"

interface EditPackageScreenProps {}

interface IDataForm {
  id?: number
  name: string
  categoryId: string
  services: ServiceDTO[]
  retailPrice: string
  price: number
}

const defaultTextFieldProps = {
  hideError: true,
  style: {
    paddingBottom: 0,
  },
}

const schema = yup.object().shape({
  name: yup.string().required(),
  categoryId: yup.string().required(),
  services: yup.array().test({
    message: "Must contain at least one service",
    test: (value, context) => {
      if (!isEmpty(value[0])) {
        return true
      }
      return false
    },
  }),
  price: yup.string().required(),
})

const EditPackageScreen = (props: EditPackageScreenProps) => {
  const { params } = useRoute<RouteProp<MainNavigatorParamList, MAIN_SCREENS.editPackage>>()
  const [data, setData] = useState<Partial<IDataForm>>(
    get(params, "packageDetail", {}) as IDataForm,
  )
  const [yupError, setYupError] = useState<{ [key: string]: string }>({})

  const { editPackage, editedPackage } = usePackage()

  const { getCatList, catList } = useService()

  useEffect(() => {
    if (!isEmpty(editedPackage)) {
      navigate(MAIN_SCREENS.packageDetail, {
        packageId: data.id,
      } as MainNavigatorParamList[MAIN_SCREENS.packageDetail])
    }
  }, [editedPackage])

  useEffect(() => {
    getCatList(null)
  }, [])

  const handleFieldChange = (key: keyof IDataForm, value: any) => {
    setData((prev) => ({ ...prev, [key]: value }))
  }

  const onServicesChange = (selecteds: ServiceDTO[]) => {
    let price = selecteds
      .map((selected) => selected.price + (selected.price * (selected?.tax?.rate || 0)) / 100)
      .reduce((prev, curr, arr) => parseFloat(prev.toString()) + parseFloat(curr.toString()))
      .toFixed(2)
      .toString()
    price = price === "NaN" ? "0" : price

    handleFieldChange("price", price)
    handleFieldChange("retailPrice", price)
    debounceFieldChange("services", selecteds)
  }

  const debounceFieldChange = debounce(handleFieldChange, 500)

  const onSave = async () => {
    try {
      await schema.validate(data, { abortEarly: false })
      const formattedData = {} as CreatePackage
      Object.keys(data).forEach((key) => {
        switch (key) {
          case "name":
            formattedData.name = data.name.trim()
            break
          case "categoryId":
            formattedData.categoryId = parseInt(data.categoryId)
            break
          case "price":
            formattedData.cost = parseFloat(data.price.toString())
            break
          case "retailPrice":
            formattedData.price = parseFloat(data.retailPrice)
            break
          default:
            formattedData[key] = data[key]
        }
      })
      editPackage(data.id, formattedData as PackageDetailDTO)
    } catch (err) {
      setYupError(convertYupErrorInner(err.inner))
    }
  }

  const totalPrice = useMemo(() => totalServicesPrice(data.services) || 0, [data.services])

  return (
    <Screen>
      <Header headerTx={"screens.headerTitle.editPackage" as TxKeyPath} leftIcon="back" />
      <ScrollView px={spacing[1]}>
        {/* avatar */}
        {/* <Avatar /> */}
        {/* name */}
        <FormControl isInvalid={!!yupError?.name}>
          <FormControl.Label {...nativeBaseStyle.form.inputLabel}>
            <Text tx="textInput.label.name" />
          </FormControl.Label>
          <TextFieldCustom
            {...defaultTextFieldProps}
            defaultValue={data?.name}
            onChangeText={(text) => debounceFieldChange("name", text)}
          />
          <FormControl.ErrorMessage>{yupError?.name}</FormControl.ErrorMessage>
        </FormControl>
        {/* category */}
        <FormControl isInvalid={!!yupError?.categoryId}>
          <FormControl.Label {...nativeBaseStyle.form.inputLabel}>
            <Text tx="textInput.label.category" />
          </FormControl.Label>
          <Select
            paddingLeft={"1.5"}
            py={spacing[1]}
            fontSize={18}
            _selectedItem={{
              bg: "teal.600",
              endIcon: <CheckIcon size="5" />,
            }}
            dropdownIcon={<ChevronDownIcon />}
            borderWidth={0}
            borderBottomWidth={1}
            borderColor={color.palette.lighterGrey}
            borderRadius={0}
            selectedValue={data?.categoryId?.toString()}
            onValueChange={(value) => handleFieldChange("categoryId", value)}
          >
            {catList.map((category) => (
              <Select.Item
                key={category.id.toString()}
                label={category.name}
                value={category.id.toString()}
              />
            ))}
          </Select>
          <FormControl.ErrorMessage>{yupError?.categoryId}</FormControl.ErrorMessage>
        </FormControl>
        {/* price */}
        <FormControl isInvalid={!!yupError?.cost}>
          <FormControl.Label {...nativeBaseStyle.form.inputLabel}>
            <Text tx="textInput.label.price" />
          </FormControl.Label>
          <TextFieldCustom
            {...defaultTextFieldProps}
            isDisabled
            value={totalPrice.toString()}
            keyboardType="numeric"
          />
          <FormControl.ErrorMessage>{yupError?.price}</FormControl.ErrorMessage>
        </FormControl>
        {/* retailPrice */}
        <FormControl isInvalid={!!yupError?.price}>
          <FormControl.Label {...nativeBaseStyle.form.inputLabel}>
            <Text tx="textInput.label.retailPrice" />
          </FormControl.Label>
          <TextFieldCustom
            {...defaultTextFieldProps}
            defaultValue={data?.price.toString()}
            keyboardType="numeric"
            onChangeText={(text) => debounceFieldChange("retailPrice", text)}
          />
          <FormControl.ErrorMessage>{yupError?.price}</FormControl.ErrorMessage>
        </FormControl>
        {/* services */}
        <FormControl isInvalid={!!yupError?.services}>
          <FormControl.Label {...nativeBaseStyle.form.inputLabel}>
            <Text tx="textInput.label.services" />
          </FormControl.Label>
          <MultiServices defaultValues={data?.services} onSelected={onServicesChange} />
          <FormControl.ErrorMessage>{yupError?.services}</FormControl.ErrorMessage>
        </FormControl>
      </ScrollView>

      <ButtonCustom
        w="90%"
        marginBottom={spacing[2]}
        tx="button.save"
        // eslint-disable-next-line react-native/no-inline-styles
        textStyle={{ fontSize: 15 }}
        onPress={onSave}
      />
    </Screen>
  )
}

export default EditPackageScreen
