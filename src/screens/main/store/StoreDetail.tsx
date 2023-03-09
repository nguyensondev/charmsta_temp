import { Avatar, ButtonCustom, Header, Screen } from "@components/index"
import CustomModal, { IRefCustomModal } from "@components/modal/CustomModal"
import ImagePicker from "@components/modal/ImagePicker"
import OptionsPicker from "@components/modal/OptionsPicker"
import { TextFieldCurrency, TextFieldCustom } from "@components/text-field"
import Text from "@components/text/text"
import { useStoresInfo } from "@hooks/settings/useStoresInfo"
import { useUtility } from "@hooks/utility"
import { TxKeyPath } from "@i18n/i18n"
import { UpdateStore } from "@models/backend/request/Store"
import { StoreDTO } from "@models/backend/response/Store"
import { MAIN_SCREENS } from "@models/enum/screensName"
import { MainNavigatorParamList } from "@models/navigator"
import { goBack } from "@navigators/navigation-utilities"
import { RouteProp, useRoute } from "@react-navigation/native"
import { color } from "@theme/color"
import { spacing } from "@theme/spacing"
import { convertYupErrorInner } from "@utils/yup/yup"
import { get, isEmpty } from "lodash"
import { FlatList } from "native-base"
import React, { useEffect, useMemo, useRef, useState } from "react"
import { Alert } from "react-native"
import { Image } from "react-native-image-crop-picker"
import * as yup from "yup"
const schema = yup.object().shape({
  bookingPage: yup.string().nullable().required(),
  name: yup.string().required(),
  categories: yup.string().required(),
  email: yup.string().required(),
  phoneNumber: yup.string().required(),
  currency: yup.string().required(),
  address: yup.string().required(),
  address2: yup.string().nullable(),
  city: yup.string().required(),
  state: yup.string().required(),
  zipcode: yup.string().required(),
})

const fields = [
  { id: "bookingPage", label: "bookingPage" },
  { id: "name", label: "storeName" },
  { id: "categories", label: "categories", isHasButton: true },
  { id: "email", label: "email", keyboardType: "email-address" },
  { id: "phoneNumber", label: "phoneNumber" },
  { id: "currency", label: "currency" },
  { id: "website", label: "website", isOptional: true },
  { id: "address", label: "address1" },
  { id: "address2", label: "address2", isOptional: true },
  { id: "city", label: "city" },
  { id: "state", label: "state" },
  { id: "zipcode", label: "zipcode" },
]
const StoreDetailScreen = () => {
  const {
    params: { storeDetail },
  } = useRoute<RouteProp<MainNavigatorParamList, MAIN_SCREENS.storeDetail>>()
  const [changedDetail, setChangedDetail] = useState<Partial<StoreDTO>>({})
  const [errors, setErrors] = useState<Partial<{ [key: string]: string }>>({})
  const { loading: uploading, imageData, uploadingImage } = useUtility()
  const { updating, updateSuccess, updateStore } = useStoresInfo()
  const { getCategorySuggestion, categorySuggestions } = useUtility()
  const modalRef = useRef<IRefCustomModal>(null)
  const categoryModalRef = useRef<IRefCustomModal>(null)
  const detailRef = useRef<Partial<StoreDTO>>({}).current

  useEffect(() => {
    getCategorySuggestion()
  }, [])

  useEffect(() => {
    if (updateSuccess) {
      Alert.alert("Success", "Your store detail has been updated successful")
      setErrors({})
      // goBack()
    }
  }, [updateSuccess])

  const onAvatarPress = () => {
    if (modalRef.current) {
      modalRef.current.openModal()
    }
  }

  const onImageChange = (image: Image) => {
    if (image?.path) {
      detailRef.image = image.path
      uploadingImage(image)
      modalRef.current.closeModal()
    }
  }

  const onSavePress = async () => {
    try {
      const invokingData = { ...storeDetail, ...detailRef, ...changedDetail }
      if (imageData?.url) {
        invokingData.image = imageData.url
      }
      await schema.validate(invokingData, { abortEarly: false })
      updateStore(storeDetail.id, invokingData as UpdateStore)
    } catch (err) {
      setErrors(convertYupErrorInner(err.inner))
    }
  }

  const RenderHeaderComponent = () => (
    <Avatar
      source={{
        uri: detailRef?.image ? detailRef.image : storeDetail?.image,
        cache: "force-cache",
      }}
      onPress={onAvatarPress}
    />
  )

  const RenderItem = ({ item }) => {
    const { id, label, ...rest } = item

    const handleFieldChange = (text: string) => {
      if (isEmpty(text)) {
        delete detailRef[id]
      } else {
        detailRef[id] = text
      }
    }

    const handleFieldPress = (id: string) => {
      switch (id) {
        case "categories":
          categoryModalRef.current.openModal()
          break
        default:
          break
      }
    }

    switch (id) {
      case "currency":
        return (
          <TextFieldCurrency
            key={id}
            labelTx={`textInput.label.${id}` as TxKeyPath}
            onSelectCurrency={(data) => {
              handleFieldChange(data.code)
            }}
            {...rest}
            errorMsg={errors[id]}
            defaultValue={get(storeDetail, "currency", "USD")}
          />
        )

      default:
        return (
          <TextFieldCustom
            key={id}
            {...rest}
            errorMsg={errors[id]}
            buttonClick={() => handleFieldPress(id)}
            alignSelf="center"
            labelTx={`textInput.label.${label}` as TxKeyPath}
            onChangeText={handleFieldChange}
            defaultValue={
              rest.isHasButton && !!changedDetail[id] ? changedDetail[id] : storeDetail[id]
            }
            // value={rest.isHasButton && !!changedDetail[id] ? get(changedDetail, id, "") : null}
          />
        )
    }
  }

  const categorySuggestionArr = useMemo(
    () =>
      categorySuggestions.map((item) => ({
        label: item.value,
        function: () => {
          setChangedDetail((prev) => ({ ...prev, categories: item.value }))
          categoryModalRef.current?.closeModal()
        },
      })),
    [categorySuggestions],
  )

  return (
    <Screen>
      <Header headerTx="screens.headerTitle.companyDetail" leftIcon="back" onLeftPress={goBack} />
      <FlatList
        ListHeaderComponent={() => <RenderHeaderComponent />}
        paddingX={spacing[1]}
        data={fields}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <RenderItem item={item} />}
      />

      <ButtonCustom
        w="90%"
        isLoading={updating}
        marginBottom={spacing[2]}
        disabled={uploading}
        onPress={onSavePress}
      >
        <Text tx="button.save" style={{ color: color.palette.white }} />
      </ButtonCustom>
      <CustomModal ref={modalRef} childView={<ImagePicker onImageSelect={onImageChange} />} />
      <CustomModal
        ref={categoryModalRef}
        childView={
          <OptionsPicker
            options={categorySuggestionArr}
            onClose={categoryModalRef.current?.closeModal}
            scrollable
          />
        }
      />
    </Screen>
  )
}

const StoreDetailScreenA = () => {
  return (
    <Screen>
      <Header headerTx="screens.headerTitle.companyDetail" leftIcon="back" onLeftPress={goBack} />
      <TextFieldCustom />
      <TextFieldCustom />
      <TextFieldCustom />
      <TextFieldCustom />
      <TextFieldCustom />
      <TextFieldCustom />
      <TextFieldCustom />
      <TextFieldCustom />
      <TextFieldCustom />
      <TextFieldCustom />
      <TextFieldCustom />
      <TextFieldCurrency />
      <ButtonCustom
        w="90%"
        // isLoading={updating}
        marginBottom={spacing[2]}
        // disabled={uploading}
        // onPress={onSavePress}
      >
        <Text tx="button.save" style={{ color: color.palette.white }} />
      </ButtonCustom>
    </Screen>
  )
}

export default StoreDetailScreen
