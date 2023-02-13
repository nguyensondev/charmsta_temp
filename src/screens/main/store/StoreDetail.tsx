import { Avatar, ButtonCustom, Header, Screen } from "@components/index"
import CustomModal, { IRefCustomModal } from "@components/modal/CustomModal"
import ImagePicker from "@components/modal/ImagePicker"
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
import { get, isEmpty, isMatch } from "lodash"
import { FlatList } from "native-base"
import React, { useEffect, useRef, useState } from "react"
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
  { id: "categories", label: "categories" },
  { id: "email", label: "email" },
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
  const { storeDetail } =
    useRoute<RouteProp<MainNavigatorParamList, MAIN_SCREENS.storeDetail>>().params
  const [isDiff, setDiff] = useState(false)
  const [errors, setErrors] = useState<Partial<{ [key: string]: string }>>({})
  const { loading: uploading, imageData, uploadingImage } = useUtility()
  const { updating, updateSuccess, updateStore } = useStoresInfo()
  const modalRef = useRef<IRefCustomModal>(null)
  const detailRef = useRef<Partial<StoreDTO>>({}).current

  useEffect(() => {
    if (updateSuccess) {
      goBack()
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
      setDiff(!isMatch(storeDetail, detailRef))
    }
  }

  const onSavePress = async () => {
    try {
      const invokingData = { ...storeDetail, ...detailRef }
      if (imageData?.url) {
        invokingData.image = imageData.url
      }
      await schema.validate(invokingData, { abortEarly: false })
      updateStore(storeDetail.id, invokingData as UpdateStore)
    } catch (err) {
      setErrors(convertYupErrorInner(err.inner))
    }
  }

  const renderHeaderComponent = () => (
    <Avatar
      source={{
        uri: detailRef?.image ? detailRef.image : storeDetail?.image,
        cache: "force-cache",
      }}
      onPress={onAvatarPress}
    />
  )

  const renderItem = ({ item }) => {
    const { id, label, ...rest } = item

    const handleFieldChange = (text: string) => {
      if (isEmpty(text)) {
        delete detailRef[id]
      } else {
        detailRef[id] = text
      }
      setDiff(!isMatch(storeDetail, detailRef))
    }

    switch (id) {
      case "currency":
        return (
          <TextFieldCurrency
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
            {...rest}
            errorMsg={errors[id]}
            alignSelf="center"
            labelTx={`textInput.label.${label}` as TxKeyPath}
            onChangeText={handleFieldChange}
            defaultValue={get(storeDetail, id, "")}
          />
        )
    }
  }

  return (
    <Screen>
      <Header headerTx="screens.headerTitle.companyDetail" leftIcon="back" onLeftPress={goBack} />
      <FlatList
        ListHeaderComponent={renderHeaderComponent}
        paddingX={spacing[1]}
        data={fields}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
      />
      <ButtonCustom
        w="90%"
        isLoading={updating}
        marginBottom={spacing[2]}
        disabled={!isDiff || uploading}
        onPress={onSavePress}
      >
        <Text tx="button.save" style={{ color: color.palette.white }} />
      </ButtonCustom>
      <CustomModal ref={modalRef} childView={<ImagePicker onImageSelect={onImageChange} />} />
    </Screen>
  )
}

export default StoreDetailScreen
