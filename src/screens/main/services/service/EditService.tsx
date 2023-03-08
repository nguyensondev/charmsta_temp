import { Avatar } from "@components/avatar/avatar"
import { Header } from "@components/header/header"
import { ButtonCustom } from "@components/index"
import CustomModal, { IRefCustomModal } from "@components/modal/CustomModal"
import ImagePicker from "@components/modal/ImagePicker"
import { Screen } from "@components/screen/screen"
import { TextFieldColor, TextFieldCustom } from "@components/text-field"
import Text from "@components/text/text"
import { useService } from "@hooks/service/useService"
import { useUtility } from "@hooks/utility"
import { translate } from "@i18n/translate"
import { NewService } from "@models/backend/request/Service"
import { ServiceDTO } from "@models/backend/response/Service"
import { StaffDTO } from "@models/backend/response/Staff"
import { MAIN_SCREENS } from "@models/enum/screensName"
import { MainNavigatorParamList } from "@models/navigator"
import { navigate } from "@navigators/navigation-utilities"
import { RouteProp, useRoute } from "@react-navigation/native"
import { SceneMapNameEnum } from "@screens/main/selection"
import { color } from "@theme/color"
import { spacing } from "@theme/spacing"
import { convertCurrency } from "@utils/data"
import { convertYupErrorInner } from "@utils/yup/yup"
import { get, isEmpty, omit } from "lodash"
import { CheckIcon, ChevronDownIcon, FormControl, ScrollView, Select, View } from "native-base"
import React, { useEffect, useLayoutEffect, useRef, useState } from "react"
import { Alert, KeyboardTypeOptions } from "react-native"
import { Image } from "react-native-image-crop-picker"
import * as yup from "yup"

interface IEditServiceScreen {}

const profileFields = [
  {
    id: "name",
    key: "name",
    label: "Service name",
    keyboardType: "default",
    // value: detail.name,
  },
  {
    id: "serviceDuration",
    key: "serviceDuration",
    label: "Duration",
    keyboardType: "numeric",
    // value: detail.serviceDuration,
  },
  {
    id: "price",
    key: "price",
    label: "Price",
    keyboardType: "numeric",
    // value: detail.price,
  },
  {
    id: "category",
    key: "categoryId",
    label: "Category",
    keyboardType: "numeric",
    // value: detail.price,
  },
  {
    id: "color",
    key: "color",
    label: "Color",
    isOptional: true,
    // keyboardType: "default",
  },
  {
    id: "staffs",
    key: "staffs",
    label: "Staffs",
    isOptional: true,
    // keyboardType: "default",
  },
  {
    id: "tax",
    key: "tax",
    label: "Tax",
    isOptional: true,
    isHasButton: true,
    keyboardType: "default",
  },
]

const schema = yup.object().shape({
  cost: yup.number().required("Cost is required"),
  serviceDuration: yup.number().required("Duration is required"),
  name: yup.string().required("Service name is required"),
  categoryId: yup.number().required("Category is required"),
})

const EditServiceScreen: React.FC<IEditServiceScreen> = () => {
  const { params } = useRoute<RouteProp<MainNavigatorParamList, MAIN_SCREENS.editService>>()
  const { detail } = params
  const [errors, setErrors] = useState({})
  const modalRef = useRef<IRefCustomModal>()
  const [editedService, setEditedService] = useState<Partial<ServiceDTO>>(detail)
  const serviceRef = useRef<Partial<NewService>>({})
  const { errEditService, newService, editSerivce, loading, getCatList, catList } = useService()
  const { imageData, uploadingImage, loading: uploading } = useUtility()

  useEffect(() => {
    if (!isEmpty(errEditService)) {
      Alert.alert("Error", translate("errors.unexpected"))
    }
  }, [errEditService])

  useEffect(() => {
    getCatList("")
  }, [])

  useLayoutEffect(() => {
    if (imageData?.url) {
      serviceRef.current.photo = imageData.url
    }
  }, [imageData])

  useEffect(() => {
    if (newService) {
      Alert.alert("Success", "Service have been edited successful", [
        {
          text: "Ok",
          onPress: () =>
            navigate(MAIN_SCREENS.serviceDetail, {
              detail: newService,
              category: omit(
                catList.find((cat) => cat.id === newService.categoryId),
                "services",
                "packages",
              ),
            } as MainNavigatorParamList[MAIN_SCREENS.serviceDetail]),
        },
      ])
    }
  }, [newService])

  useEffect(() => {
    return () => {
      if (serviceRef && serviceRef.current) {
        serviceRef.current = null
      }
    }
  }, [])

  const handleAvatarSelect = (image: Image) => {
    if (image?.path) {
      detail.photo = image.path
      uploadingImage(image)
      modalRef?.current.closeModal()
    }
  }

  const handleProfileChange = (id: string, value: string) => {
    switch (id) {
      case "name":
        serviceRef.current.name = value
        break
      case "serviceDuration":
        serviceRef.current.serviceDuration = parseInt(value)
        break
      case "price":
        serviceRef.current.cost = parseFloat(value)
        serviceRef.current.price = parseFloat(value)
        break
      case "categoryId":
        serviceRef.current.categoryId = parseInt(value)
        break
      default:
        serviceRef.current[id] = value
        break
    }

    if (isEmpty(value) || detail[id] === serviceRef.current[id]) {
      delete serviceRef.current[id]
    }
  }

  const onSavePress = async () => {
    try {
      const invokingData = {
        ...detail,
        ...serviceRef.current,
        staffs: detail.staffs,
        tax: detail.tax,
      } as ServiceDTO

      if (!isEmpty(serviceRef.current)) {
        await schema.validate(invokingData, { abortEarly: false })
        editSerivce(invokingData)
      }
    } catch (err) {
      setErrors(convertYupErrorInner(err.inner))
    }
  }

  const onStaffsPress = () => {
    serviceRef.current.staffs = detail?.staffs
    navigate(MAIN_SCREENS.additionSelect, {
      actionName: SceneMapNameEnum.editServiceStaffs,
      prevSelected: { staffs: detail?.staffs },
    } as MainNavigatorParamList[MAIN_SCREENS.additionSelect])
  }

  const renderItem = ({ item }) => {
    switch (item.id) {
      case "color":
        return (
          <TextFieldColor
            {...item}
            style={{ marginHorizontal: spacing[4] }}
            key={item.id}
            label={item.label}
            defaultValue={get(detail, item.key)}
            errorMsg={errors[item.id]}
            onValueChange={(color) => handleProfileChange(item.id, color)}
          />
        )
      case "price":
        return (
          <FormControl isInvalid={errors[item.key]}>
            <TextFieldCustom
              {...item}
              keyboardType={item.keyboardType as KeyboardTypeOptions}
              style={{ marginHorizontal: spacing[4] }}
              opacity={1}
              paddingLeft={"1.5"}
              alignSelf="center"
              rounded={"md"}
              key={item.id}
              label={item.label}
              defaultValue={convertCurrency(get(detail, item.key), true)}
              // editable={true}
              onChangeText={(value) => handleProfileChange(item.id, value)}
            />
            <FormControl.ErrorMessage>{errors[item.key]}</FormControl.ErrorMessage>
          </FormControl>
        )
      case "staffs":
        return (
          <FormControl isInvalid={errors[item.key]}>
            <TextFieldCustom
              {...item}
              isHasButton
              buttonClick={onStaffsPress}
              keyboardType={item.keyboardType as KeyboardTypeOptions}
              style={{ marginHorizontal: spacing[4] }}
              opacity={1}
              numberOfLines={1}
              paddingLeft={"1.5"}
              alignSelf="center"
              rounded={"md"}
              key={item.id}
              label={item.label}
              defaultValue={get(detail, item.key, [])
                ?.map((staff: StaffDTO) => staff.name)
                .join(", ")}
              onChangeText={(value) => handleProfileChange(item.id, value)}
            />
            <FormControl.ErrorMessage>{errors[item.key]}</FormControl.ErrorMessage>
          </FormControl>
        )
      case "tax":
        return (
          <FormControl isInvalid={errors[item.key]}>
            <TextFieldCustom
              {...item}
              keyboardType={item.keyboardType as KeyboardTypeOptions}
              style={{ marginHorizontal: spacing[4] }}
              buttonClick={() => {
                serviceRef.current.tax = detail.tax
                return navigate(MAIN_SCREENS.additionSelect, {
                  actionName: SceneMapNameEnum.selectTax,
                  prevSelected: { tax: detail?.tax },
                } as MainNavigatorParamList[MAIN_SCREENS.additionSelect])
              }}
              label={item.label}
              value={get(detail, "tax.name", "")}
              rightElement={<Text text={get(detail, "tax.rate", "") + " %"} />}
            />
            <FormControl.ErrorMessage>{errors[item.key]}</FormControl.ErrorMessage>
          </FormControl>
        )
      case "category":
        return (
          <View mx={spacing[1]} pb={spacing[1]}>
            <Text preset="fieldLabel" tx="textInput.label.category" />
            <Select
              paddingLeft={"1.5"}
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
              defaultValue={detail?.categoryId?.toString()}
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
          </View>
        )
      default:
        return (
          <FormControl isInvalid={errors[item.key]}>
            <TextFieldCustom
              {...item}
              keyboardType={item.keyboardType as KeyboardTypeOptions}
              style={{ marginHorizontal: spacing[4] }}
              opacity={1}
              paddingLeft={"1.5"}
              alignSelf="center"
              rounded={"md"}
              key={item.id}
              label={item.label}
              defaultValue={get(detail, item.key)?.toString()}
              // editable={true}
              onChangeText={(value) => handleProfileChange(item.id, value)}
              errorMsg={errors[item.id]}
            />
            <FormControl.ErrorMessage>{errors[item.key]}</FormControl.ErrorMessage>
          </FormControl>
        )
    }
  }

  return (
    <Screen>
      <Header headerTx={"screens.headerTitle.editService"} leftIcon="back" />
      <ScrollView paddingTop={spacing[1]}>
        <Avatar
          source={{ uri: detail?.photo }}
          isLoading={uploading}
          alignSelf="center"
          size={130}
          onPress={() => {
            modalRef?.current.openModal()
          }}
        />
        {profileFields.map((item) => renderItem({ item }))}
      </ScrollView>
      <ButtonCustom isLoading={loading} w="90%" marginBottom={spacing[1]} onPress={onSavePress}>
        {translate("button.save")}
      </ButtonCustom>
      <CustomModal ref={modalRef} childView={<ImagePicker onImageSelect={handleAvatarSelect} />} />
    </Screen>
  )
}

export default EditServiceScreen
