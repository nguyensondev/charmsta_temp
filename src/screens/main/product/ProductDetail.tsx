import { RouteProp, useRoute } from "@react-navigation/native"
import { get, isEmpty, isMatch, isNumber } from "lodash"
import { ScrollView } from "native-base"
import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react"
import { KeyboardType } from "react-native"
import { Image } from "react-native-image-crop-picker"
import * as yup from "yup"

import { Avatar, ButtonCustom, Header, Screen } from "@components/index"
import CustomModal, { IRefCustomModal } from "@components/modal/CustomModal"
import ImagePicker from "@components/modal/ImagePicker"
import { TextFieldCustom } from "@components/text-field"
import Text from "@components/text/text"
import { useProduct } from "@hooks/product"
import { useUtility } from "@hooks/utility"
import { TxKeyPath } from "@i18n/i18n"
import { ProductDTO } from "@models/backend/response/Product"
import { MAIN_SCREENS } from "@models/enum/screensName"
import { MainNavigatorParamList } from "@models/navigator"
import { goBack, navigate, navigationRef } from "@navigators/navigation-utilities"
import { color } from "@theme/color"
import { spacing } from "@theme/spacing"
import { convertCurrency } from "@utils/data"
import { convertYupErrorInner } from "@utils/yup/yup"
import { SceneMapNameEnum } from "../selection"

const productsFields = [
  {
    id: "name",
    label: "productName",
  },
  {
    id: "cost",
    label: "cost",
    keyboardType: "numeric",
  },
  {
    id: "price",
    label: "price",
    keyboardType: "numeric",
  },
  {
    id: "stocks",
    label: "stocks",
    keyboardType: "numeric",
  },
  {
    id: "SKU",
    label: "SKU",
  },
  {
    id: "tax",
    label: "tax",
    isHasButton: true,
  },
  {
    id: "description",
    label: "description",
  },
]

const schema = yup.object().shape({
  name: yup.string().required(),
  cost: yup.string().required(),
  price: yup.string().required(),
  SKU: yup.string().nullable().required(),
  // photo: yup.string().required(),
})

const ProductDetailScreen = () => {
  const { params } = useRoute<RouteProp<MainNavigatorParamList, MAIN_SCREENS.productDetail>>()
  const { detail, editable } = params

  const [isEditable, setEditable] = useState(editable || false)
  const [isDiff, setIsDiff] = useState(false)
  const [errors, setErrors] = useState<any>({})
  const {
    loading,
    updateProduct,
    createProduct,
    updateProductStatus,
    createProductStatus,
    newProduct,
  } = useProduct()
  const { loading: uploading, imageData, uploadingImage } = useUtility()
  const modalRef = useRef<IRefCustomModal>(null)

  const productDetailRef = useRef<Partial<ProductDTO>>({})

  useLayoutEffect(() => {
    setIsDiff(!isMatch(detail, productDetailRef.current))
  }, [detail])

  useEffect(() => {
    if (createProductStatus) {
      alert("create product successful !")
      goBack()
    }
  }, [createProductStatus])

  useEffect(() => {
    if (updateProductStatus) {
      alert("update product successful !")
      navigationRef.setParams({
        ...params,
        detail: newProduct,
      } as never)
    }
  }, [updateProductStatus, newProduct])

  const screenStatus = useMemo<"save" | "cancel" | "edit" | "create">(() => {
    return isEditable ? (isEmpty(detail) ? "create" : isDiff ? "save" : "cancel") : "edit"
  }, [isDiff, isEditable])

  const onDetailChange = (id: string, text: string) => {
    switch (id) {
      case "price":
        productDetailRef.current.price = parseFloat(text)
        break
      case "cost":
        productDetailRef.current.cost = parseFloat(text)
        break
      default:
        productDetailRef.current[id] = text
    }
    setIsDiff(!isMatch(detail, productDetailRef.current))
  }

  const handleBottomButtonPress = async () => {
    try {
      const invokingData: ProductDTO = {
        ...detail,
        ...productDetailRef.current,
        photo: imageData?.url || detail?.photo,
        tax: detail?.tax,
      }

      switch (screenStatus) {
        case "cancel":
          return setEditable(false)
        case "create":
          await schema.validate(invokingData, { abortEarly: false })
          createProduct(invokingData)
          break
        case "save":
          await schema.validate(invokingData, { abortEarly: false })
          updateProduct(invokingData)
          break
        case "edit":
          return setEditable(true)
      }
    } catch (err) {
      if (err?.inner) {
        setErrors(convertYupErrorInner(err.inner))
      }
    }
  }

  const getProductValue = (id: string, value: any) => {
    switch (id) {
      case "stocks":
        return isNumber(value) ? String(value) : ""
      default:
        return value
    }
  }

  const onImageSelect = (image: Image) => {
    if (modalRef.current) {
      onDetailChange("photo", image.path)
      uploadingImage(image)
      modalRef.current.closeModal()
    }
  }
  const onAvatarPress = () => {
    modalRef.current.openModal()
  }

  const handleTextFieldPress = (id: string) => {
    switch (id) {
      case "tax":
        productDetailRef.current.tax = detail?.tax
        navigate(MAIN_SCREENS.additionSelect, {
          actionName: SceneMapNameEnum.selectTax,
          prevSelected: { tax: detail?.tax },
        } as MainNavigatorParamList[MAIN_SCREENS.additionSelect])
        break
    }
  }

  return (
    <Screen>
      <Header headerTx="screens.headerTitle.productDetail" leftIcon="back" onLeftPress={goBack} />
      <ScrollView paddingX={spacing[1]}>
        <Avatar
          rounded={"md"}
          isLoading={uploading}
          onPress={onAvatarPress}
          source={{
            uri: productDetailRef.current?.photo ? productDetailRef.current.photo : detail?.photo,
          }}
          errorMsg={errors.photo}
        />
        {productsFields.map((field) => {
          const { id, label, keyboardType, ...rest } = field
          let defaultValue = getProductValue(id, get(detail, id))
          if (typeof defaultValue === "number") {
            defaultValue = convertCurrency(defaultValue, isEditable)
          } else if (id === "tax") {
            var rightElementText = (defaultValue?.rate || "") + " %"
            defaultValue = defaultValue?.name
          }

          return (
            <TextFieldCustom
              {...rest}
              buttonClick={() => handleTextFieldPress(id)}
              editable={isEditable}
              key={id}
              keyboardType={keyboardType as KeyboardType}
              labelTx={`textInput.label.${label}` as TxKeyPath}
              rightElement={<Text text={rightElementText} />}
              defaultValue={defaultValue}
              onChangeText={(text) => onDetailChange(id, text)}
              errorMsg={errors[id]}
            />
          )
        })}
        {/* <ProductOptions /> */}
      </ScrollView>
      <ButtonCustom
        tx={`button.${screenStatus}`}
        isLoading={loading}
        disabled={uploading}
        w="90%"
        marginBottom={spacing[2]}
        onPress={handleBottomButtonPress}
      >
        <Text tx={`button.${screenStatus}`} style={{ color: color.palette.white }} />
      </ButtonCustom>

      <CustomModal ref={modalRef} childView={<ImagePicker onImageSelect={onImageSelect} />} />
    </Screen>
  )
}

export default ProductDetailScreen
