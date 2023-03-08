import { Header } from "@components/header/header"
import { Avatar, ButtonCustom } from "@components/index"
import { Screen } from "@components/screen/screen"
import { TextFieldColor, TextFieldCustom } from "@components/text-field"
import Text from "@components/text/text"
import { useService } from "@hooks/service/useService"
import { translate } from "@i18n/translate"
import { NewService } from "@models/backend/request/Service"
import { StaffDTO } from "@models/backend/response/Staff"
import { MAIN_SCREENS } from "@models/enum/screensName"
import { MainNavigatorParamList } from "@models/navigator"
import { goBack, navigate } from "@navigators/navigation-utilities"
import { RouteProp, useRoute } from "@react-navigation/native"
import { color } from "@theme/color"
import { spacing } from "@theme/spacing"
import { convertCurrency } from "@utils/data"
import { get, isEmpty } from "lodash"
import { Row, ScrollView } from "native-base"
import * as React from "react"
import { useEffect, useRef, useState } from "react"
import { Alert, KeyboardTypeOptions } from "react-native"

const profileFields = [
  {
    id: "name",
    editable: false,
    key: "name",
    label: "Service name",
    keyboardType: "default",
    // value: detail.name,
  },
  {
    id: "serviceDuration",
    editable: false,
    key: "serviceDuration",
    label: "Duration",
    keyboardType: "numeric",
    // value: detail.serviceDuration,
  },
  {
    id: "price",
    editable: false,
    key: "price",
    label: "Price",
    keyboardType: "numeric",
    // value: detail.price,
  },
  {
    id: "category",
    editable: false,
    key: "name",
    label: "Category",
    keyboardType: "numeric",
    // value: detail.price,
  },
  {
    id: "color",
    editable: false,
    key: "color",
    label: "Color",
    isOptional: true,
    // keyboardType: "default",
  },
  {
    id: "staffs",
    editable: false,
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
    editable: false,
    keyboardType: "default",
  },
]

const ServiceDetailScreen = ({}) => {
  const {
    params: { detail, category },
  } = useRoute<RouteProp<MainNavigatorParamList, MAIN_SCREENS.serviceDetail>>()

  const [errors, setErrors] = useState({})

  const serviceRef = useRef<Partial<NewService>>({})

  const { errNewService, newService, editSerivce, errEditService } = useService()
  
  useEffect(() => {
    if (!isEmpty(errEditService)) {
      Alert.alert("Error", translate("errors.unexpected"))
    }
  }, [errEditService])

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
      default:
        break
    }
  }

  const onEditPress = () => {
    navigate(MAIN_SCREENS.editService, {
      detail,
    } as MainNavigatorParamList[MAIN_SCREENS.editService])
  }

  const onDeletePress = () => {
    Alert.alert("Warning", "Are you sure want to delete this service?", [
      { text: "No" },
      {
        text: "Yes",
        onPress: () => editSerivce({ ...detail, isActive: false }),
        style: "destructive",
      },
    ])
  }

  const renderItem = React.useCallback(
    ({ item }) => {
      switch (item.id) {
        case "color":
          return (
            <TextFieldColor
              {...item}
              style={{ marginHorizontal: spacing[4] }}
              key={item.id}
              label={item.label}
              defaultValue={get(detail, item.key)}
              disabled={!item.editable}
              errorMsg={errors[item.id]}
              onValueChange={(color) => handleProfileChange(item.id, color)}
            />
          )
        case "price":
          return (
            <TextFieldCustom
              {...item}
              keyboardType={item.keyboardType as KeyboardTypeOptions}
              style={{ marginHorizontal: spacing[4] }}
              opacity={1}
              key={item.id}
              label={item.label}
              defaultValue={convertCurrency(get(detail, item.key))}
              // editable={true}
              onChangeText={(value) => handleProfileChange(item.id, value)}
              errorMsg={errors[item.id]}
            />
          )
        case "staffs":
          return (
            <TextFieldCustom
              {...item}
              keyboardType={item.keyboardType as KeyboardTypeOptions}
              style={{ marginHorizontal: spacing[4] }}
              opacity={1}
              key={item.id}
              label={item.label}
              defaultValue={get(detail, item.key)
                ?.map((staff: StaffDTO) => staff.name)
                .join(", ")}
              onChangeText={(value) => handleProfileChange(item.id, value)}
              errorMsg={errors[item.id]}
            />
          )
        case "category":
          return (
            <TextFieldCustom
              {...item}
              keyboardType={item.keyboardType as KeyboardTypeOptions}
              style={{ marginHorizontal: spacing[4] }}
              opacity={1}
              key={item.id}
              label={item.label}
              defaultValue={get(category, item.key)}
              onChangeText={(value) => handleProfileChange(item.id, value)}
              errorMsg={errors[item.id]}
            />
          )
        case "tax":
          return (
            <TextFieldCustom
              {...item}
              keyboardType={item.keyboardType as KeyboardTypeOptions}
              style={{ marginHorizontal: spacing[4] }}
              label={item.label}
              value={get(detail, "tax.name", "")}
              rightElement={<Text text={get(detail, "tax.rate", "") + " %"} />}
              onChangeText={(value) => handleProfileChange(item.id, value)}
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
              key={item.id}
              label={item.label}
              defaultValue={get(detail, item.key)?.toString()}
              // editable={true}
              onChangeText={(value) => handleProfileChange(item.id, value)}
              errorMsg={errors[item.id]}
            />
          )
      }
    },
    [...Object.values(detail)],
  )

  return (
    <Screen>
      <Header headerText={detail.name} leftIcon="back" />
      <ScrollView paddingTop={spacing[1]}>
        <Avatar source={{ uri: detail?.photo }} size={130} alignSelf="center" />
        {profileFields.map((item) => renderItem({ item }))}
      </ScrollView>
      <Row justifyContent={"space-evenly"} marginBottom={spacing[2]} px={spacing[1]}>
        <ButtonCustom backgroundColor={color.error} w="48%" onPress={onDeletePress}>
          {translate("button.delete")}
        </ButtonCustom>
        <ButtonCustom w="48%" onPress={onEditPress}>
          {translate("button.edit")}
        </ButtonCustom>
      </Row>
    </Screen>
  )
}

export default ServiceDetailScreen
