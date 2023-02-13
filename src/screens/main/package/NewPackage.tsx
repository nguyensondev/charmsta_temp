import { ButtonCustom, Header, Screen } from "@components/index"
import { MultiServices } from "@components/multi-select"
import { TextFieldCustom } from "@components/text-field"
import Text from "@components/text/text"
import { SELECT_HEIGHT } from "@config/constants"
import { usePackage } from "@hooks/package"
import { useService } from "@hooks/service/useService"
import { TxKeyPath } from "@i18n/i18n"
import { CreatePackage } from "@models/backend/request/Package"
import { ServiceDTO } from "@models/backend/response/Service"
import { goBack } from "@navigators/navigation-utilities"
import { color } from "@theme/color"
import { spacing } from "@theme/spacing"
import { convertYupErrorInner } from "@utils/yup/yup"
import { debounce, isEmpty, isUndefined } from "lodash"
import { CheckIcon, ChevronDownIcon, FormControl, ScrollView, Select } from "native-base"
import React, { useEffect, useState } from "react"
import * as yup from "yup"
import { nativeBaseStyle } from "./styles"

interface NewPackageScreenProps {}

interface IDataForm {
  name: string
  categoryId: string
  services: ServiceDTO[]
  cost: string
  price: string
  retailPrice: string
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
      if (!isUndefined(value)) {
        return true
      }
      return false
    },
  }),
  retailPrice: yup.string().required(),
})

const NewPackageScreen = (props: NewPackageScreenProps) => {
  const [data, setData] = useState<Partial<IDataForm>>({})
  const [yupError, setYupError] = useState<{ [key: string]: string }>({})

  const { createPackage, newPackage } = usePackage()

  const { getCatList, catList } = useService()

  useEffect(() => {
    if (!isEmpty(newPackage)) {
      goBack()
    }
  }, [newPackage])

  useEffect(() => {
    getCatList(null)
  }, [])

  const handleFieldChange = (key: keyof IDataForm, value: any) => {
    setData((prev) => ({ ...prev, [key]: value }))
  }

  const onServicesChange = (selecteds: ServiceDTO[]) => {
    const price = selecteds
      .map((selected) => selected?.price || 0)
      .reduce((prev, curr, arr) => parseFloat(prev.toString()) + parseFloat(curr.toString()))
      .toString()
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
            formattedData.cost = parseFloat(data.price)
            break
          case "retailPrice":
            formattedData.price = parseFloat(data.retailPrice)
            break

          default:
            formattedData[key] = data[key]
        }
      })

      createPackage(formattedData as CreatePackage)
    } catch (err) {
      setYupError(convertYupErrorInner(err.inner))
    }
  }

  return (
    <Screen>
      <Header headerTx={"screens.headerTitle.newPackage" as TxKeyPath} leftIcon="back" />
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
            dropdownIcon={<ChevronDownIcon />}
            height={SELECT_HEIGHT}
            fontSize={18}
            _selectedItem={{
              bg: "teal.600",
              endIcon: <CheckIcon size="1" />,
            }}
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
            opacity={0.5}
            editable={false}
            value={data?.price}
            keyboardType="numeric"
          />
          <FormControl.ErrorMessage>{yupError?.cost}</FormControl.ErrorMessage>
        </FormControl>
        {/* retail price */}
        <FormControl isInvalid={!!yupError?.retailPrice}>
          <FormControl.Label {...nativeBaseStyle.form.inputLabel}>
            <Text tx="textInput.label.retailPrice" />
          </FormControl.Label>
          <TextFieldCustom
            {...defaultTextFieldProps}
            defaultValue={data?.retailPrice}
            keyboardType="numeric"
            onChangeText={(text) => debounceFieldChange("retailPrice", text)}
          />
          <FormControl.ErrorMessage>{yupError?.retailPrice}</FormControl.ErrorMessage>
        </FormControl>
        {/* services */}
        <FormControl isInvalid={!!yupError?.services}>
          <FormControl.Label {...nativeBaseStyle.form.inputLabel}>
            <Text tx="textInput.label.services" />
          </FormControl.Label>
          <MultiServices onSelected={onServicesChange} />
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

export default NewPackageScreen
