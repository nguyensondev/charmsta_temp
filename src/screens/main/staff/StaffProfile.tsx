import { RouteProp, useRoute } from "@react-navigation/native"
import { get, isEmpty, isMatch } from "lodash"
import { FlatList, Row } from "native-base"
import React, { useEffect, useRef, useState } from "react"
import { Image } from "react-native-image-crop-picker"
import * as yup from "yup"

import { Avatar, ButtonCustom, Header, Screen } from "@components/index"
import CustomModal, { IRefCustomModal } from "@components/modal/CustomModal"
import ImagePicker from "@components/modal/ImagePicker"
import { TextFieldCustom } from "@components/text-field"
import Text from "@components/text/text"
import { useStaff } from "@hooks/staff"
import { useUtility } from "@hooks/utility"
import { TxKeyPath } from "@i18n/i18n"
import { translate } from "@i18n/translate"
import { StaffDTO } from "@models/backend/response/Staff"
import { MAIN_SCREENS } from "@models/enum/screensName"
import { MainNavigatorParamList } from "@models/navigator"
import { goBack, navigate } from "@navigators/navigation-utilities"
import { color } from "@theme/color"
import { spacing } from "@theme/spacing"
import { convertYupErrorInner } from "@utils/yup/yup"
import { Alert } from "react-native"
import { SceneMapNameEnum } from "../selection"

const schema = yup.object().shape({
  name: yup.string().trim().required("Name is required"),
  avatar: yup.string().required("Avatar is required"),
  phoneNumber: yup
    .string()
    .matches(/\d+/g, "Phone number format is not correct")
    .required("Phone number is required"),
  email: yup.string().email("Email format is not correct").nullable(),
})

const staffFields = [
  { id: "name", label: "name" },
  { id: "phoneNumber", label: "phoneNumber" },
  { id: "email", label: "email", isOptional: true },
  { id: "workingDays", label: "Working Days", isOptional: true, isHasButton: true },
  { id: "breaks", label: "Breaks", isOptional: true, isHasButton: true, editable: true },
  { id: "timeOff", label: "Time Off", isOptional: true, isHasButton: true, editable: true },
  { id: "services", label: "Services", isHasButton: true },
]

const newStaffFields = [
  { id: "name", label: "name" },
  { id: "phoneNumber", label: "phoneNumber" },
  { id: "email", label: "email", isOptional: true },
]
const StaffProfileScreen = () => {
  const route = useRoute<RouteProp<MainNavigatorParamList, MAIN_SCREENS.staffProfile>>()
  const { detail, editable, updated } = route.params

  const [isEditable, setEditable] = useState<boolean>(editable || false)
  const [isDiff, setIsDiff] = useState<boolean>(false)
  const [errors, setErrors] = useState<any>({})
  const {
    loading,
    loadingDelete,
    createStaffProfile,
    editStaffProfile,
    editStaffStatus,
    createStaffStatus,
    deleteStaffStatus,
    deleteStaffProfile,
    updateStaffServices,
  } = useStaff()
  const { uploadingImage, loading: uploading, imageData } = useUtility()
  const staffRef = useRef<Partial<StaffDTO>>({})
  const imagePickerRef = useRef<IRefCustomModal>(null)
  useEffect(() => {
    if (createStaffStatus) {
      alert("Create staff successful !")
      goBack()
    }
  }, [createStaffStatus])

  useEffect(() => {
    if (editStaffStatus) {
      if (updated) {
        updateStaffServices(detail.id, detail.services)
      }
      Alert.alert("Success", "Update staff successful !", [{ text: "Ok", onPress: goBack }])
    }
  }, [editStaffStatus])

  useEffect(() => {
    if (deleteStaffStatus) {
      alert("Delete staff successful !")
      goBack()
    }
  }, [deleteStaffStatus])

  const onAvatarPress = () => {
    if (imagePickerRef?.current) {
      imagePickerRef.current.openModal()
    }
  }

  const onImageSelect = (data: Image) => {
    if (imagePickerRef.current) {
      handleProfileChange("avatar", data.path)
      uploadingImage(data)
      imagePickerRef.current.closeModal()
    }
  }

  const onFocusAction = (id: string) => {
    try {
      if (id && id === "workingDays") {
        navigate(MAIN_SCREENS.workingDays, { staffDetail: detail })
      } else if (id && id === "breaks") {
        navigate(MAIN_SCREENS.breaks, { staffDetail: detail, editable: isEditable })
      } else if (id && id === "timeOff") {
        navigate(MAIN_SCREENS.timeOff, { staffDetail: detail, editable: isEditable })
      }
      if (id === "services") {
        navigate(MAIN_SCREENS.additionSelect, {
          actionName: SceneMapNameEnum.editStaffServices,
          prevSelected: { services: { services: detail.services } },
        } as MainNavigatorParamList[MAIN_SCREENS.additionSelect])
      }
    } catch (error) {
      __DEV__ && console.log(error)
    }
  }

  const handleProfileChange = (id: string, value: string) => {
    switch (id) {
      default:
        staffRef.current[id] = value
    }
    setIsDiff(!isMatch(detail, staffRef.current))
  }

  const handleProfileButtonPress = async () => {
    try {
      const invokingData = {
        ...detail,
        ...staffRef.current,
        avatar: imageData?.url || detail?.avatar,
      }

      switch (screenStatus) {
        case "cancel":
          return setEditable(false)
        case "edit":
          return setEditable(true)
        case "save":
          await schema.validate(invokingData, { abortEarly: false })
          editStaffProfile(invokingData)
          break
        case "create":
          await schema.validate(invokingData, { abortEarly: false })
          createStaffProfile(invokingData)
          break
      }
    } catch (err) {
      if (err?.inner && !isEmpty(err.inner)) {
        setErrors(convertYupErrorInner(err.inner))
      }
    }
  }

  const setData = (detail: StaffDTO, item: string) => {
    switch (item) {
      case "workingDays":
        let days = ""
        if (detail?.workingHours && detail.workingHours.length > 0) {
          detail.workingHours.forEach((ele) => {
            if (ele.day === 0 && ele.open) {
              days += "Su "
            }
            if (ele.day === 1 && ele.open) {
              days += "M "
            }
            if (ele.day === 2 && ele.open) {
              days += "T "
            }
            if (ele.day === 3 && ele.open) {
              days += "W "
            }
            if (ele.day === 4 && ele.open) {
              days += "Th "
            }
            if (ele.day === 5 && ele.open) {
              days += "F "
            }
            if (ele.day === 6 && ele.open) {
              days += "S"
            }
          })
          return days
        } else {
          return ""
        }
      case "services":
        return get(detail, "services")
          .map((service) => service.name)
          .join(", ")
      default:
        return get(detail, item)
    }
  }

  const handleDeleteButtonPress = async () => {
    Alert.alert("Warning", "Do you want to delete " + detail.name + " ?", [
      {
        text: "Cancel",
        onPress: () => console.log("Cancel Pressed"),
        style: "cancel",
      },
      { text: "OK", onPress: () => deleteStaffProfile(detail.id) },
    ])
  }

  const screenStatus = React.useMemo<"save" | "cancel" | "edit" | "create">(() => {
    return isEditable
      ? isEmpty(detail)
        ? "create"
        : isDiff || updated
        ? "save"
        : "cancel"
      : "edit"
  }, [staffRef, isDiff, isEditable, updated])
  const renderHeaderComponent = () => (
    <Avatar
      source={{
        uri: staffRef.current?.avatar ? staffRef.current.avatar : detail?.avatar,
        cache: "force-cache",
      }}
      errorMsg={errors.avatar}
      disabled={!isEditable}
      onPress={onAvatarPress}
      isLoading={uploading}
    />
  )

  const renderFooterComponent = React.useCallback(() => {
    return (
      <Row justifyContent={"space-evenly"} marginBottom={spacing[2]} px={spacing[1]}>
        {detail?.id && (
          <ButtonCustom
            backgroundColor={color.error}
            isLoading={loadingDelete}
            disabled={loadingDelete}
            w="48%"
            onPress={handleDeleteButtonPress}
          >
            <Text text={"Delete"} style={{ color: color.palette.white }} />
          </ButtonCustom>
        )}
        <ButtonCustom
          isLoading={loading}
          disabled={uploading}
          w={detail?.id ? "48%" : "90%"}
          onPress={handleProfileButtonPress}
        >
          <Text tx={`button.${screenStatus}`} style={{ color: color.palette.white }} />
        </ButtonCustom>
      </Row>
    )
  }, [screenStatus, loading, uploading, loadingDelete])

  return (
    <Screen>
      <Header
        headerText={detail?.name || translate("screens.headerTitle.staffProfile")}
        leftIcon="back"
        onLeftPress={goBack}
      />
      <FlatList
        data={isEmpty(detail) ? newStaffFields : staffFields}
        ListHeaderComponent={renderHeaderComponent}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TextFieldCustom
            buttonClick={() => onFocusAction(item.id)}
            style={{ marginHorizontal: spacing[4] }}
            paddingLeft={"1.5"}
            alignSelf="center"
            rounded={"md"}
            key={item.id}
            labelTx={`textInput.label.${item.id}` as TxKeyPath}
            defaultValue={setData(detail, item.id)}
            editable={isEditable}
            onChangeText={(value) => handleProfileChange(item.id, value)}
            errorMsg={errors[item.id]}
            {...item}
          />
        )}
      />
      {renderFooterComponent()}

      <CustomModal ref={imagePickerRef} childView={<ImagePicker onImageSelect={onImageSelect} />} />
    </Screen>
  )
}

export default StaffProfileScreen
