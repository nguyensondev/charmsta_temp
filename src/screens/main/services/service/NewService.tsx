import { ButtonCustom } from "@components/button/buttonCustom"
import { Header } from "@components/header/header"
import { Avatar, TextFieldProps } from "@components/index"
import CustomModal, { IRefCustomModal } from "@components/modal/CustomModal"
import ImagePicker from "@components/modal/ImagePicker"
import { Screen } from "@components/screen/screen"
import Text from "@components/text"
import { TextFieldColor, TextFieldCustom } from "@components/text-field"
import { useService } from "@hooks/service/useService"
import { useUtility } from "@hooks/utility"
import { NewService } from "@models/backend/request/Service"
import { MAIN_SCREENS } from "@models/enum/screensName"
import { MainNavigatorParamList } from "@models/navigator"
import { goBack, navigate } from "@navigators/navigation-utilities"
import { RouteProp, useRoute } from "@react-navigation/native"
import { SceneMapNameEnum } from "@screens/main/selection"
import { color } from "@theme/color"
import { spacing } from "@theme/spacing"
import { convertYupErrorInner } from "@utils/yup/yup"
import { get } from "lodash"
import { CheckIcon, ChevronDownIcon, FormControl, Select } from "native-base"
import * as React from "react"
import { useCallback, useEffect, useRef, useState } from "react"
import { FlatList, KeyboardTypeOptions } from "react-native"
import { Image } from "react-native-image-crop-picker"
import * as yup from "yup"

const profileFields = [
  { id: "name", key: "name", label: "Service name", keyboardType: "default" },
  { id: "serviceDuration", key: "serviceDuration", label: "Duration", keyboardType: "numeric" },
  { id: "cost", key: "cost", label: "Cost", keyboardType: "numeric" },
  { id: "category", key: "categoryId", label: "Category" },
  {
    id: "color",
    key: "color",
    label: "Color",
    isOptional: true,
    keyboardType: "default",
  },
  {
    id: "tax",
    key: "tax",
    label: "Tax",
    isOptional: true,
    keyboardType: "default",
    isHasButton: true,
  },
] as Array<TextFieldProps & { id: string; key: string }>

const schema = yup.object().shape({
  cost: yup.number().required("Cost is required"),
  serviceDuration: yup.number().required("Duration is required"),
  name: yup.string().required("Service name is required"),
  categoryId: yup.number().required("Category is required"),
})

const NewServiceScreen = () => {
  const { params } = useRoute<RouteProp<MainNavigatorParamList, MAIN_SCREENS.newService>>()
  const detail = get(params, "detail")
  const [errors, setErrors] = useState({})
  const serviceRef = useRef<Partial<NewService>>({})
  const imagePickModalRef = useRef<IRefCustomModal>()

  const { addNewService, loadingNewService, errNewService, newService, getCatList, catList } =
    useService()
  const { loading: uploading, imageData, uploadingImage } = useUtility()

  useEffect(() => {
    getCatList("")
  }, [])

  useEffect(() => {
    // if (!isNull(detail)) {
    serviceRef.current = { ...serviceRef.current, ...detail }
    // }
  }, [detail])

  useEffect(() => {
    if (newService) {
      goBack()
    }
  }, [newService])

  useEffect(() => {
    return () => {
      if (serviceRef && serviceRef.current) {
        serviceRef.current = null
      }
    }
  }, [])

  useEffect(() => {
    if (errNewService) {
      alert(errNewService.message)
    }
  }, [errNewService])

  const handleImageSelect = (image: Image) => {
    if (serviceRef?.current && image?.path) {
      serviceRef.current.photo = image.path
      uploadingImage(image)
      imagePickModalRef.current.closeModal()
    }
  }

  const handleProfileChange = (id: string, value: any) => {
    switch (id) {
      case "name":
        serviceRef.current.name = value
        break
      case "serviceDuration":
        serviceRef.current.serviceDuration = parseInt(value)
        break
      case "cost":
        serviceRef.current.cost = parseFloat(value)
        serviceRef.current.price = parseFloat(value)
        break
      case "color":
        serviceRef.current.color = value
        break
      case "categoryId":
        serviceRef.current.categoryId = parseInt(value)
    }
  }

  const handleButtonPress = async () => {
    if (serviceRef.current) {
      try {
        const invokingData = { ...serviceRef.current, ...detail }
        const result = await schema.validate(invokingData, { abortEarly: false })
        if (result) {
          setErrors({})
          if (imageData?.url) {
            invokingData.photo = imageData.url
          }

          navigate(MAIN_SCREENS.additionSelect, {
            actionName: SceneMapNameEnum.newService,
            prevSelected: invokingData,
          } as MainNavigatorParamList[MAIN_SCREENS.additionSelect])
          // addNewService(serviceRef.current)
        }
      } catch (error) {
        setErrors(convertYupErrorInner(error.inner))
      }
    }
  }

  const renderFooterComponent = useCallback(() => {
    return (
      <ButtonCustom
        disabled={loadingNewService || uploading}
        isLoading={loadingNewService}
        w="90%"
        marginBottom={spacing[2]}
        onPress={handleButtonPress}
      >
        <Text tx="button.next" style={{ color: color.palette.white }} />
      </ButtonCustom>
    )
  }, [loadingNewService, uploading])

  const onAvatarPress = () => {
    if (imagePickModalRef?.current) {
      imagePickModalRef.current.openModal()
    }
  }

  const renderHeaderComponent = () => {
    return (
      <Avatar
        source={{
          uri: serviceRef.current?.photo ? serviceRef.current.photo : null,
          cache: "force-cache",
        }}
        onPress={onAvatarPress}
        isLoading={uploading}
      />
    )
  }

  const renderItem = ({ item }) => {
    switch (item.id) {
      case "color":
        return (
          <TextFieldColor
            {...item}
            style={{ marginHorizontal: spacing[4] }}
            label={item.label}
            defaultValue={get(serviceRef.current, item.key)}
            errorMsg={errors[item.key]}
            onValueChange={(color) => handleProfileChange(item.id, color)}
          />
        )
      case "tax":
        return (
          <TextFieldCustom
            {...item}
            keyboardType={item.keyboardType as KeyboardTypeOptions}
            style={{ marginHorizontal: spacing[4] }}
            buttonClick={() =>
              navigate(MAIN_SCREENS.additionSelect, {
                actionName: SceneMapNameEnum.selectTax,
                prevSelected: { tax: detail?.tax },
              } as MainNavigatorParamList[MAIN_SCREENS.additionSelect])
            }
            label={item.label}
            value={get(detail, "tax.name", "")}
            rightElement={<Text text={get(detail, "tax.rate", "") + " %"} />}
            onChangeText={(value) => handleProfileChange(item.id, value)}
            errorMsg={errors[item.key]}
          />
        )
      case "category":
        return (
          <FormControl px={spacing[1]} isInvalid={!!errors[item.key]}>
            <Text preset="fieldLabel" tx="textInput.label.category" />
            <Select
              paddingX={"1.5"}
              fontSize={18}
              _selectedItem={{
                bg: "teal.600",
                endIcon: <CheckIcon size="5" />,
              }}
              dropdownIcon={<ChevronDownIcon />}
              borderWidth={0}
              borderBottomWidth={1}
              borderColor={!!errors[item.key] ? color.error : color.palette.lighterGrey}
              borderRadius={0}
              selectedValue={serviceRef.current?.categoryId?.toString()}
              onValueChange={(value) => handleProfileChange("categoryId", value)}
            >
              {catList.map((category) => (
                <Select.Item
                  key={category.id.toString()}
                  label={category.name}
                  value={category.id.toString()}
                />
              ))}
            </Select>
            <FormControl.ErrorMessage>{errors[item.key]}</FormControl.ErrorMessage>
          </FormControl>
        )
      default:
        return (
          <TextFieldCustom
            {...item}
            keyboardType={item.keyboardType as KeyboardTypeOptions}
            style={{ marginHorizontal: spacing[4] }}
            label={item.label}
            value={get(serviceRef.current, item.key)}
            onChangeText={(value) => handleProfileChange(item.id, value)}
            errorMsg={errors[item.id]}
          />
        )
    }
  }

  return (
    <Screen>
      <Header headerTx="screens.headerTitle.newService" leftIcon="back" />
      <FlatList
        data={profileFields}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={renderHeaderComponent}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
      />
      {renderFooterComponent()}
      <CustomModal
        ref={imagePickModalRef}
        childView={<ImagePicker onImageSelect={handleImageSelect} />}
      />
    </Screen>
  )
}

export default NewServiceScreen
