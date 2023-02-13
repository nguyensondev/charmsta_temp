import { RouteProp, useRoute } from "@react-navigation/native"
import { get, isEmpty, isMatch, isNumber, isObject, isString, omit } from "lodash"
import { FlatList } from "native-base"
import React, { useEffect, useRef, useState } from "react"
import DatePicker from "react-native-date-picker"
import { Image } from "react-native-image-crop-picker"
import * as yup from "yup"

import { ButtonCustom } from "@components/button/buttonCustom"
import { Avatar, Header } from "@components/index"
import CustomModal, { IRefCustomModal } from "@components/modal/CustomModal"
import ImagePicker from "@components/modal/ImagePicker"
import { Screen } from "@components/screen/screen"
import { TextFieldCustom, TextFieldDateTime, TextFieldPhone } from "@components/text-field"
import Text from "@components/text/text"
import { useCustomer } from "@hooks/customer"
import { useUtility } from "@hooks/utility"
import { TxKeyPath } from "@i18n/i18n"
import { Customer } from "@models/backend/request/Customer"
import { MAIN_SCREENS } from "@models/enum/screensName"
import { MainNavigatorParamList } from "@models/navigator"
import { goBack } from "@navigators/navigation-utilities"
import { color } from "@theme/color"
import { spacing } from "@theme/spacing"
import { convertYupErrorInner } from "@utils/yup/yup"

const profileFields = [
  { id: "firstName", key: "firstName", label: "First name", isOptional: true },
  { id: "lastName", key: "lastName", label: "Last name", isOptional: true },
  { id: "phoneNumber", key: "phoneNumber", label: "Phone number" },
  { id: "email", key: "email", label: "Email", isOptional: true },
  { id: "dob", key: "dob", label: "Date of birth", isOptional: true },
  { id: "address", key: "address.address", label: "Address", isOptional: true },
  { id: "address2", key: "address.address2", label: "Address 2", isOptional: true },
  { id: "city", key: "address.city", label: "City", isOptional: true },
  { id: "state", key: "address.state", label: "State", isOptional: true },
  { id: "zipcode", key: "address.zipcode", label: "Zipcode", isOptional: true },
]

const schema = yup.object().shape({
  phoneNumber: yup
    .string()
    .matches(/\d+/g, "Phone number is not correct")
    .required("Phone numer is required"),
  email: yup.string().email("Email format is not correct").nullable(),
})

const CustomerProfileScreen = () => {
  const { params } = useRoute<RouteProp<MainNavigatorParamList, MAIN_SCREENS.customerProfile>>()
  const { editable, customerProfile } = params
  const [isEditable, setEditable] = useState(editable || false)
  const [isDiff, setIsDiff] = useState(false)
  const [datePickerOpen, setDatePickerOpen] = useState(false)

  const [errors, setErrors] = useState({})
  const profileRef = useRef<Partial<Customer>>({})
  const imagePickerRef = useRef<IRefCustomModal>(null)

  const { updateCustomer, createCustomer, loading, createStatus, updateStatus } = useCustomer()

  const { uploadingImage, imageData, loading: uploading } = useUtility()

  useEffect(() => {
    if (createStatus) {
      alert("Create customer successful !")
      goBack()
    }
  }, [createStatus])

  useEffect(() => {
    if (updateStatus) {
      alert("Update customer successful !")
      goBack()
    }
  }, [updateStatus])

  const screenStatus = React.useMemo<"save" | "cancel" | "edit" | "create">(() => {
    return isEditable ? (!customerProfile?.id ? "create" : isDiff ? "save" : "cancel") : "edit"
  }, [isDiff, isEditable])

  const handleProfileChange = (id: string, value: string | number | { [key: string]: string }) => {
    switch (id) {
      case "address":
      case "address2":
      case "city":
      case "state":
      case "zipcode":
        profileRef.current.address = {
          ...profileRef.current.address,
          [id]: value,
        }
        break
      case "dob":
        if (isNumber(value)) {
          profileRef.current.dob = value
        }
        break
      case "phoneNumber":
        if (isObject(value)) {
          profileRef.current.phoneNumber = value.phoneNumber
          profileRef.current.isoCode = value.code.toLowerCase()
          profileRef.current.countryCode = `+${value.callingCode}`
        }
        break
      default:
        profileRef.current[id] = value
    }
    if (isEmpty(value) && isString(value)) {
      delete profileRef.current[id]
    }
    setIsDiff(!isMatch(customerProfile, profileRef.current))
  }

  const handleProfileButtonPress = async () => {
    try {
      const invokingData: Customer = {
        ...customerProfile,
        ...profileRef.current,
        avatar: imageData?.url || customerProfile?.avatar,
      }
      switch (screenStatus) {
        case "cancel":
          return setEditable(false)
        case "create":
          await schema.validate(invokingData, { abortEarly: false })
          createCustomer(invokingData)
          break
        case "save":
          await schema.validate(invokingData, { abortEarly: false })
          updateCustomer(omit(invokingData, "companyCustomer"))
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

  const renderFooterComponent = React.useCallback(() => {
    return (
      <ButtonCustom
        isLoading={loading}
        disabled={uploading}
        w="90%"
        marginBottom={spacing[2]}
        onPress={handleProfileButtonPress}
      >
        <Text tx={`button.${screenStatus}`} style={{ color: color.palette.white }} />
      </ButtonCustom>
    )
  }, [screenStatus, loading, uploading])

  const onAvatarPress = () => {
    if (imagePickerRef?.current) {
      imagePickerRef.current.openModal()
    }
  }

  const renderHeaderComponent = () => (
    <Avatar
      source={{
        uri: profileRef.current?.avatar ? profileRef.current.avatar : customerProfile?.avatar,
        cache: "force-cache",
      }}
      disabled={!isEditable}
      onPress={onAvatarPress}
      isLoading={uploading}
    />
  )

  const renderItem = ({ item, index }) => {
    switch (item.id) {
      case "dob":
        return (
          <TextFieldDateTime
            {...item}
            datePickerProps={{
              mode: "date",
            }}
            opacity={isEditable ? 1 : 0.6}
            paddingLeft={"1.5"}
            alignSelf="center"
            rounded={"md"}
            key={item.id}
            labelTx={`textInput.label.${item.id}` as TxKeyPath}
            defaultValue={get(customerProfile, "dob", null)}
            errorMsg={get(errors, item.key)}
            editable={isEditable}
            onValueChange={(value) => handleProfileChange(item.id, value)}
          />
        )
      case "phoneNumber":
        return (
          <TextFieldPhone
            {...item}
            opacity={isEditable ? 1 : 0.6}
            paddingLeft={"1.5"}
            alignSelf="center"
            rounded={"md"}
            key={item.id}
            labelTx={`textInput.label.${item.id}` as TxKeyPath}
            defaultValue={{
              callingCode: get(customerProfile, "countryCode"),
              code: get(customerProfile, "isoCode"),
              phoneNumber: get(customerProfile, "phoneNumber"),
            }}
            errorMsg={get(errors, item.key)}
            editable={isEditable}
            onChange={(data) => handleProfileChange(item.id, data)}
          />
        )
      default:
        return (
          <TextFieldCustom
            {...item}
            opacity={isEditable ? 1 : 0.6}
            paddingLeft={"1.5"}
            alignSelf="center"
            rounded={"md"}
            key={item.id}
            labelTx={`textInput.label.${item.id}` as TxKeyPath}
            defaultValue={get(customerProfile, item.key)}
            errorMsg={get(errors, item.key)}
            editable={isEditable}
            onChangeText={(value) => handleProfileChange(item.id, value)}
          />
        )
    }
  }

  const onImageSelect = (data: Image) => {
    if (imagePickerRef.current) {
      handleProfileChange("avatar", data.path)
      uploadingImage(data)
      imagePickerRef.current.closeModal()
    }
  }

  return (
    <Screen>
      <Header
        leftIcon="back"
        onLeftPress={goBack}
        headerTx={"screens.headerTitle.customerProfile"}
      />
      <FlatList
        paddingX={spacing[1]}
        paddingTop={spacing[1]}
        data={profileFields}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={renderHeaderComponent}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
      />
      {renderFooterComponent()}
      <CustomModal ref={imagePickerRef} childView={<ImagePicker onImageSelect={onImageSelect} />} />
      <DatePicker
        date={new Date()}
        mode="date"
        modal
        open={datePickerOpen}
        onConfirm={() => setDatePickerOpen(false)}
        onCancel={() => setDatePickerOpen(false)}
      />
    </Screen>
  )
}

export default CustomerProfileScreen
