import { Avatar, ButtonCustom, Header, Screen } from "@components/index"

import CustomModal, { IRefCustomModal } from "@components/modal/CustomModal"
import ImagePicker from "@components/modal/ImagePicker"
import { TextFieldCustom } from "@components/text-field"
import { useUser } from "@hooks/user"
import { useUtility } from "@hooks/utility"
import { UpdateUser } from "@models/backend/request/User"
import { COMMON_SCREENS, MAIN_SCREENS } from "@models/enum/screensName"
import { useStores } from "@models/index"
import { User } from "@models/mobx/user/user"
import { CommonNavigatorParamList, MainNavigatorParamList } from "@models/navigator"
import { navigate, navigationRef } from "@navigators/navigation-utilities"
import { RouteProp, StackActions, useRoute } from "@react-navigation/native"
import { spacing } from "@theme/spacing"
import { convertYupErrorInner } from "@utils/yup/yup"
import { get, omit } from "lodash"
import { observer } from "mobx-react-lite"
import { FormControl, ScrollView } from "native-base"
import React, { useEffect, useLayoutEffect, useRef, useState } from "react"
import { Alert } from "react-native"
import { Image } from "react-native-image-crop-picker"
import * as yup from "yup"
import { styles } from "./styles"
interface EditAccountScreenProps {}

const schema = yup.object().shape({
  fullName: yup.string().required(),
  email: yup.string().email().required(),
  phoneNumber: yup.string().required(),
})

const EditAccountScreen = (props: EditAccountScreenProps) => {
  const { params } = useRoute<RouteProp<MainNavigatorParamList, MAIN_SCREENS.editAccount>>()
  const newAddress = get(params, "newAddress", "")
  const { User } = useStores().userStore
  const { image, fullName, email, address, phoneNumber } = User
  const [avatar, setAvatar] = useState(image)
  const [errors, setErrors] = useState({})
  const userProfile = useRef<Partial<User>>({}).current
  const imagePickerRef = useRef<IRefCustomModal>()
  const { uploadingImage, imageData, loading } = useUtility()
  const { updateUserProfile, updateSuccess, loading: updating } = useUser()

  useLayoutEffect(() => {
    if (updateSuccess) {
      Alert.alert("Update success", "Your profile have been updated successful!", [
        { text: "Ok", onPress: () => navigationRef.dispatch(StackActions.popToTop()) },
      ])
    }
  }, [updateSuccess])

  useEffect(() => {
    if (newAddress) {
      userProfile.address = newAddress
    }
  }, [newAddress])

  useLayoutEffect(() => {
    if (imageData?.url) {
      setAvatar(imageData.url)
      userProfile.image = imageData.url
    }
  }, [imageData])

  const onAvatarPress = () => {
    if (imagePickerRef.current) {
      imagePickerRef.current.openModal()
    }
  }

  const handleFieldChange = (id: string, text: string) => {
    userProfile[id] = text
  }

  const onImageSelect = (data: Image) => {
    if (data?.path) {
      uploadingImage(data)
      setAvatar(data.path)
      imagePickerRef.current.closeModal()
    }
  }

  const onSubmit = async () => {
    try {
      const updateData = omit({ ...User, ...userProfile }, "company", "isActive", "permissionsId")
      await schema.validate(updateData, { abortEarly: false })
      updateUserProfile(updateData as UpdateUser)
    } catch (err) {
      setErrors(convertYupErrorInner(err.inner))
    }
  }

  return (
    <Screen>
      <Header headerTx="screens.headerTitle.editAccount" leftIcon="back" />
      <ScrollView>
        <Avatar source={{ uri: avatar }} isLoading={loading} size={140} onPress={onAvatarPress} />
        <FormControl px={spacing[1]}>
          <TextFieldCustom
            defaultValue={fullName}
            onChangeText={(text) => handleFieldChange("fullName", text)}
            labelTx="textInput.label.name"
            errorMsg={get(errors, "fullName")}
          />
          <TextFieldCustom
            defaultValue={email}
            onChangeText={(text) => handleFieldChange("email", text)}
            labelTx="textInput.label.email"
            errorMsg={get(errors, "email")}
            isDisabled
          />
          <TextFieldCustom
            defaultValue={phoneNumber}
            onChangeText={(text) => handleFieldChange("phoneNumber", text)}
            labelTx="textInput.label.phoneNumber"
            errorMsg={get(errors, "phoneNumber")}
          />
          <TextFieldCustom
            value={newAddress || address}
            isHasButton
            buttonClick={() =>
              navigate(COMMON_SCREENS.searchLocation, {
                fromScreen: MAIN_SCREENS.editAccount,
              } as CommonNavigatorParamList[COMMON_SCREENS.searchLocation])
            }
            labelTx="textInput.label.address"
            errorMsg={get(errors, "address")}
          />
        </FormControl>
      </ScrollView>
      <ButtonCustom
        onPress={onSubmit}
        tx="button.save"
        textStyle={styles.buttonLabel}
        isLoading={updating || loading}
        mb={spacing[1]}
      />
      {/* <ButtonCustom onPress={onSubmit} tx="button.save" textStyle={styles.saveBtn} /> */}
      <CustomModal ref={imagePickerRef} childView={<ImagePicker onImageSelect={onImageSelect} />} />
    </Screen>
  )
}

export default observer(EditAccountScreen)
