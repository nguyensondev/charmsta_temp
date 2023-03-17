import { ButtonCustom, Header, Screen } from "@components/index"
import { TextFieldCustom } from "@components/text-field"
import Text from "@components/text/text"
import VectorIcon from "@components/vectorIcon/vectorIcon"
import { useService } from "@hooks/service/useService"
import { TxKeyPath } from "@i18n/i18n"
import { translate } from "@i18n/translate"
import { EditCategory } from "@models/backend/request/Service"
import { ServiceInCategoryDTO } from "@models/backend/response/Service"
import { MAIN_SCREENS } from "@models/enum/screensName"
import { MainNavigatorParamList } from "@models/navigator"
import { goBack, navigationRef } from "@navigators/navigation-utilities"
import { RouteProp, useFocusEffect, useRoute } from "@react-navigation/native"
import { color } from "@theme/color"
import { spacing } from "@theme/spacing"
import { convertYupErrorInner } from "@utils/yup/yup"
import { get, isEmpty, isMatch } from "lodash"
import { FlatList, Row, View } from "native-base"
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { Alert, TouchableOpacity } from "react-native"
import * as yup from "yup"
import styles from "./styles"

const schema = yup.object().shape({
  name: yup.string().trim().required("Name is required"),
})

const categoryFields = [{ id: "name", label: "Category name" }]

const CategoryDetail = () => {
  const route = useRoute<RouteProp<MainNavigatorParamList, MAIN_SCREENS.categoryDetail>>()
  const { detail, editable } = route.params
  const [isEditable, setEditable] = useState<boolean>(editable)
  const [textAll, setTextAll] = useState("Select All")
  const [Count, setCount] = useState(0)
  const [isDiff, setIsDiff] = useState<boolean>(false)
  const [errors, setErrors] = useState({})

  const {
    loadingNewCategory,
    editCategory,
    editCategoryStatus,
    getListServiceInCategory,
    serviceInCategory,
    errNewCategory,
    setNewListServerInCategory,
    updateListServerInCategory,
    getCategoryById,
    deleteCategory,
    categoryDeleted,
    error,
  } = useService()

  useEffect(() => {
    if (!isEmpty(error)) {
      switch (error.status) {
        default:
          return Alert.alert("Error", translate("errors.unexpected"))
      }
    }
  }, [error])

  useEffect(() => {
    if (categoryDeleted) {
      Alert.alert("Success", "Your category has been deleted successfull")
      goBack()
    }
  }, [categoryDeleted])
  const categoryRef = useRef<Partial<EditCategory>>({})
  useFocusEffect(
    useCallback(() => {
      getListServiceInCategory(detail.id)
    }, []),
  )

  useEffect(() => {
    if (!isEmpty(errNewCategory)) {
      switch (errNewCategory.status) {
        default:
          Alert.alert("Error", "Something unexpected happened. Please try again")
      }
    }
  }, [])

  React.useEffect(() => {
    if (editCategoryStatus) {
      alert("Update Category successful !")
      const rootState = navigationRef.getRootState()
      if (rootState.index > 1) {
        // navigationRef.reset({
        //   index: 1,
        //   routes: rootState.routes
        //     .filter((route, index) => index < 2)
        //     .map((route) => ({
        //       name: route.name,
        //       params: route.params,
        //     })),
        // })
        goBack()
      } else {
        goBack()
      }
    }
  }, [editCategoryStatus])

  React.useEffect(() => {
    if (!isEmpty(serviceInCategory)) {
      serviceInCategory.forEach((service) => {
        if (service.selected) {
          setCount((prev) => prev + 1)
        }
      })
    }
  }, [serviceInCategory])

  const handleProfileChange = (id: string, value: string) => {
    switch (id) {
      default:
        categoryRef.current[id] = value
    }
    setIsDiff(!isMatch(detail, categoryRef.current))
  }

  const onDelete = () => {
    if (Count === 0) {
      Alert.alert("Warning", "Are you sure you want to delete this category?", [
        {
          text: "No",
        },
        {
          text: "Yes",
          onPress: () => deleteCategory(detail.id),
          style: "destructive",
        },
      ])
    } else {
      Alert.alert("Warning", "You must unsellect all services in order to delete this category")
    }
  }

  const handleProfileButtonPress = async () => {
    try {
      const invokingData = {
        ...detail,
        ...categoryRef.current,
      }
      delete invokingData.services
      switch (screenStatus) {
        case "cancel":
          return setEditable(false)
        case "edit":
          return setEditable(true)
        case "save":
          await schema.validate(invokingData, { abortEarly: false })
          editCategory(invokingData)
          updateListServerInCategory(serviceInCategory, detail.id)
          break
      }
    } catch (err) {
      if (err?.inner && !isEmpty(err.inner)) {
        setErrors(convertYupErrorInner(err.inner))
      }
    }
  }

  const screenStatus = React.useMemo<"save" | "cancel" | "edit" | "create">(() => {
    return isEditable ? (isEmpty(detail) ? "create" : isDiff ? "save" : "cancel") : "edit"
  }, [categoryRef, isDiff, isEditable])

  const renderFooterComponent = React.useCallback(() => {
    return (
      <Row
        justifyContent={isEditable ? "center" : "space-between"}
        mb={spacing[1]}
        px={spacing[1]}
        pt={spacing[1] / 2}
      >
        {isEditable ? null : (
          <ButtonCustom
            isLoading={loadingNewCategory}
            // disabled={loadingNewCategory}
            backgroundColor={color.error}
            w="48%"
            onPress={onDelete}
          >
            <Text tx={`button.delete`} style={{ color: color.palette.white }} />
          </ButtonCustom>
        )}
        <ButtonCustom
          isLoading={loadingNewCategory}
          disabled={loadingNewCategory}
          w={isEditable ? "100%" : "48%"}
          onPress={handleProfileButtonPress}
        >
          <Text tx={`button.${screenStatus}`} style={{ color: color.palette.white }} />
        </ButtonCustom>
      </Row>
    )
  }, [screenStatus, loadingNewCategory, isEditable])

  const renderItem = ({ item, index }: { item: ServiceInCategoryDTO; index: number }) => {
    return (
      <TouchableOpacity
        disabled={!isEditable}
        activeOpacity={0.7}
        onPress={() => handleSecletCheck(item, index)}
      >
        <Item item={item} />
      </TouchableOpacity>
    )
  }
  const Item = ({ item }: { item: ServiceInCategoryDTO }) => (
    <View style={styles.item}>
      <View style={styles.subContainerItem}>
        <View style={styles.viewNamePrice}>
          <Text ellipsizeMode="tail" numberOfLines={1} style={styles.serviceName}>
            {item.name}
          </Text>
          {item?.selected && (
            <VectorIcon
              color={color.palette.black}
              size={20}
              iconSet="ion"
              name="checkmark-outline"
            />
          )}
        </View>
      </View>
    </View>
  )
  const handleSecletCheck = (item: ServiceInCategoryDTO, index: number) => {
    const tempList = serviceInCategory
    if (!tempList[index].selected) {
      tempList[index].selected = true
    } else {
      tempList[index].selected = false
    }
    setNewListServerInCategory(tempList)
    if (!tempList[index].selected) {
      setCount(Count - 1)
    } else {
      setCount(Count + 1)
    }
    setIsDiff(true)
  }
  const renderSelectAll = () => {
    return (
      <TouchableOpacity disabled={!isEditable} onPress={handleSecletAll}>
        <View style={styles.itemSelectAll}>
          <View style={styles.subContainerItem}>
            <View style={styles.viewNamePrice}>
              <Text ellipsizeMode="tail" numberOfLines={1} style={styles.serviceName}>
                {textAll}
              </Text>
              <Text style={styles.servicePrice}>{"Counts " + Count}</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    )
  }
  const handleSecletAll = () => {
    const tempList = serviceInCategory
    for (let index = 0; index < serviceInCategory.length; index++) {
      if (textAll === "Select All") {
        tempList[index].selected = true
        tempList[index].addNew = true
      } else {
        tempList[index].selected = false
        tempList[index].addNew = true
      }
    }
    setNewListServerInCategory(tempList)
    if (textAll === "Select All") {
      setTextAll("Unselect All")
      setCount(serviceInCategory.length)
    } else {
      setTextAll("Select All")
      setCount(0)
    }
    setIsDiff(true)
  }

  const sortedServiceInCategory = useMemo(
    () => serviceInCategory.sort((value) => (value.selected ? -1 : 1)), // `true` values first
    [serviceInCategory],
  )

  return (
    <Screen>
      <Header headerText="Category" leftIcon="back" onLeftPress={goBack} />
      <TextFieldCustom
        style={{ marginHorizontal: spacing[4] }}
        opacity={isEditable ? 1 : 0.6}
        paddingLeft={"1.5"}
        alignSelf="center"
        rounded={"md"}
        labelTx={`textInput.label.name` as TxKeyPath}
        defaultValue={get(detail, "name")}
        label={"Category name"}
        editable={isEditable}
        onChangeText={(value) => handleProfileChange("name", value)}
        errorMsg={errors["name"]}
      />
      {/* <FlatList
        backgroundColor={"amber.200"}
        data={categoryFields}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          
        )}
      /> */}
      <Text
        style={styles.serviceName}
        ellipsizeMode="tail"
        numberOfLines={1}
        text={"List Service"}
        marginY="3"
        px={spacing[1]}
      />
      <FlatList
        data={sortedServiceInCategory}
        stickyHeaderIndices={[0]}
        ListHeaderComponent={renderSelectAll}
        keyExtractor={(item) => item.service_id.toString()}
        renderItem={renderItem}
      />
      {renderFooterComponent()}
    </Screen>
  )
}

export default CategoryDetail
