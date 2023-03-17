import { ButtonCustom } from "@components/button/buttonCustom"
import { Header } from "@components/header/header"
import { Screen } from "@components/screen/screen"
import Text from "@components/text"
import { TextFieldCustom } from "@components/text-field"
import { useService } from "@hooks/service/useService"
import { translate } from "@i18n/translate"
import { NewCategory } from "@models/backend/request/Service"
import { MAIN_SCREENS } from "@models/enum/screensName"

import { navigationRef } from "@navigators/navigation-utilities"
import { StackActions } from "@react-navigation/native"
import { color } from "@theme/color"
import { spacing } from "@theme/spacing"
import { convertYupErrorInner } from "@utils/yup/yup"
import { get } from "lodash"
import * as React from "react"
import { useCallback, useEffect, useRef, useState } from "react"
import { Alert, FlatList, KeyboardTypeOptions } from "react-native"
import * as yup from "yup"

const profileFields = [{ id: "name", key: "name", label: "Category name", keyboardType: "default" }]

const schema = yup.object().shape({
  name: yup.string().required("Service name is required"),
})

const NewCategoryScreen = () => {
  const [errors, setErrors] = useState({})
  const serviceRef = useRef<Partial<NewCategory>>({})
  const { addNewCategory, loadingNewCategory, errNewCategory, newCategory } = useService()

  useEffect(() => {
    if (newCategory) {
      // alert("Create Category successful !")
      // navigation.goBack()
      navigationRef.dispatch(
        StackActions.replace(MAIN_SCREENS.categoryDetail, { detail: newCategory, editable: true }),
      )
    }
  }, [newCategory])

  useEffect(() => {
    return () => {
      if (serviceRef && serviceRef.current) {
        serviceRef.current = null
      }
    }
  }, [])

  useEffect(() => {
    if (errNewCategory) {
      Alert.alert("Error", translate("errors.unexpected"))
    }
  }, [errNewCategory])

  const handleProfileChange = (id: string, value: string) => {
    switch (id) {
      case "name":
        serviceRef.current.name = value
        break
      default:
        break
    }
  }

  const handleButtonPress = async () => {
    if (serviceRef.current) {
      try {
        const result = await schema.validate(serviceRef.current, { abortEarly: false })
        if (result) {
          setErrors({})
          addNewCategory(serviceRef.current)
        }
      } catch (error) {
        setErrors(convertYupErrorInner(error.inner))
      }
    }
  }

  const renderFooterComponent = useCallback(() => {
    return (
      <ButtonCustom
        disabled={loadingNewCategory}
        isLoading={loadingNewCategory}
        w="90%"
        marginBottom={spacing[2]}
        onPress={handleButtonPress}
      >
        <Text tx="button.next" style={{ color: color.palette.white }} />
      </ButtonCustom>
    )
  }, [loadingNewCategory])

  return (
    <Screen>
      <Header headerText="Category" leftIcon="back" />
      <FlatList
        data={profileFields}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
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
              value={get(serviceRef.current, item.key)}
              editable={true}
              onChangeText={(value) => handleProfileChange(item.id, value)}
              errorMsg={errors[item.id]}
            />
          )
        }}
      />
      {renderFooterComponent()}
    </Screen>
  )
}
export default NewCategoryScreen
