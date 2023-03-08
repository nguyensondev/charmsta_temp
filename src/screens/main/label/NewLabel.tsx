import { ButtonCustom } from "@components/button/buttonCustom"
import { Header } from "@components/header/header"
import CustomModal, { IRefCustomModal } from "@components/modal/CustomModal"
import { Screen } from "@components/screen/screen"
import Text from "@components/text"
import { TextFieldColor } from "@components/text-field"
import { TextFieldCustom } from "@components/text-field/textFieldCustom"
import VectorIcon from "@components/vectorIcon/vectorIcon"
import { useAppointment } from "@hooks/appointment/useAppointment"
import { translate } from "@i18n/translate"
import { CreateLabel } from "@models/backend/request/Appointment"
import { AppointmentLabelDTO } from "@models/backend/response/Appointment"
import { goBack } from "@navigators/navigation-utilities"
import { color } from "@theme/color"
import { spacing } from "@theme/spacing"
import { convertYupErrorInner } from "@utils/yup/yup"
import { get, isEmpty } from "lodash"
import * as React from "react"
import { useCallback, useEffect, useRef, useState } from "react"
import { Alert, FlatList, KeyboardTypeOptions, TouchableOpacity, View } from "react-native"
import * as yup from "yup"
import styles from "./styles"

const labelFields = [
  { id: "name", key: "name", label: "Label name", keyboardType: "default" },
  { id: "color", key: "color", label: "Color", isOptional: true, keyboardType: "default" },
]

const schema = yup.object().shape({
  name: yup.string().required("Label name is required"),
})

const NewLabelScreen = ({ route }) => {
  const labelDetail = route.params?.labelDetail as AppointmentLabelDTO
  const labelRef = useRef<Partial<CreateLabel>>({})
  // sdslabelRef.current.name = labelDetail ? labelDetail.name : ""
  const [errors, setErrors] = useState({})
  const modalRef = useRef<IRefCustomModal>(null)

  const {
    addNewLabel,
    loadingNewLabel,
    newLabel,
    editALabel,
    loadingEditLabel,
    editLabel,
    errNewLabel,
  } = useAppointment()

  useEffect(() => {
    if (!isEmpty(errNewLabel)) {
      Alert.alert("Error", translate("errors.unexpected"))
    }
  }, [errNewLabel])

  useEffect(() => {
    if (newLabel) {
      alert("Label successfully added!")
      goBack()
    }
    if (editLabel) {
      alert("Label successfully edited!")
      goBack()
    }
  }, [newLabel, editLabel])

  const openColorPicker = () => {
    if (modalRef && modalRef.current) {
      modalRef.current.openModal()
    }
  }
  const closenColorPicker = () => {
    if (modalRef && modalRef.current) {
      modalRef.current.closeModal()
    }
  }

  const handleProfileChange = (id: string, value: string) => {
    switch (id) {
      case "name":
        labelRef.current.name = value
        break
      case "color":
        labelRef.current.color = value
        break
      default:
        break
    }
  }

  const handleButtonPress = async () => {
    if (!isEmpty(labelRef.current)) {
      try {
        const editedLabel = { ...labelDetail, ...labelRef.current }
        await schema.validate(editedLabel, { abortEarly: false })
        if (labelDetail) {
          setErrors({})
          const data = {
            color: editedLabel.color,
            name: editedLabel.name,
            isEditable: true,
          } as CreateLabel
          editALabel(data, labelDetail.id)
        } else {
          setErrors({})
          const data = {
            color: editedLabel.color,
            name: editedLabel.name,
            isEditable: true,
          } as CreateLabel
          addNewLabel(data)
        }
      } catch (error) {
        setErrors(convertYupErrorInner(error.inner))
      }
    }
  }

  const renderColorPicker = () => {
    return (
      <View style={styles.viewPickerColor}>
        <TouchableOpacity style={styles.btnClose} onPress={closenColorPicker}>
          <VectorIcon iconSet="ion" size={30} name="close-outline" color="white" />
        </TouchableOpacity>

        <ButtonCustom w="90%" color={color.palette.white} marginBottom={spacing[2]}>
          <Text tx="button.select" style={{ color: color.palette.black }} />
        </ButtonCustom>
      </View>
    )
  }

  const renderItem = ({ item }) => {
    switch (item.id) {
      case "color":
        return (
          <TextFieldColor
            {...item}
            isHasButton={item.id === "color"}
            buttonClick={openColorPicker}
            keyboardType={item.keyboardType as KeyboardTypeOptions}
            style={{ marginHorizontal: spacing[4] }}
            opacity={1}
            paddingLeft={"1.5"}
            alignSelf="center"
            rounded={"md"}
            key={item.id}
            label={item.label}
            value={get(labelRef.current, item.key)}
            defaultValue={labelDetail?.color}
            editable={true}
            onValueChange={(value) => handleProfileChange(item.id, value)}
            errorMsg={errors[item.id]}
          />
        )
      default:
        return (
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
            value={get(labelRef.current, item.key)}
            defaultValue={item.id === "name" && labelDetail ? labelDetail.name : ""}
            editable={true}
            onChangeText={(value) => handleProfileChange(item.id, value)}
            errorMsg={errors[item.id]}
          />
        )
    }
  }

  const renderFooterComponent = useCallback(() => {
    return (
      <ButtonCustom
        disabled={labelDetail ? loadingEditLabel : loadingNewLabel}
        isLoading={labelDetail ? loadingEditLabel : loadingNewLabel}
        w="90%"
        marginBottom={spacing[2]}
        onPress={handleButtonPress}
      >
        <Text
          tx={labelDetail ? "button.save" : "button.create"}
          style={{ color: color.palette.white }}
        />
      </ButtonCustom>
    )
  }, [loadingNewLabel, loadingEditLabel])

  return (
    <Screen style={styles.body}>
      <Header
        headerText={labelDetail ? "Edit Label" : "New Label"}
        leftIcon="back"
        onLeftPress={goBack}
      />
      <FlatList
        data={labelFields}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
      />
      {/* calendar picker modal */}
      <CustomModal ref={modalRef} childView={renderColorPicker()} />

      {renderFooterComponent()}
    </Screen>
  )
}

export default NewLabelScreen
