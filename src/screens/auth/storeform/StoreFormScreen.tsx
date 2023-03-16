import { ButtonCustom } from "@components/button/buttonCustom"
import { Screen } from "@components/index"
import CustomModal, { IRefCustomModal } from "@components/modal/CustomModal"
import OptionsPicker from "@components/modal/OptionsPicker"
import { TextFieldCustom } from "@components/text-field"
import { useAuth } from "@hooks/auth"
import { useStoresInfo } from "@hooks/settings/useStoresInfo"
import { useUtility } from "@hooks/utility"
import { StoreByIdDTO } from "@models/backend/response/Store"
import { AUTH_SCREENS, COMMON_SCREENS } from "@models/enum/screensName"
import { AuthNavigatorParamList, CommonNavigatorParamList } from "@models/navigator"
import { useStores } from "@models/root-store"
import { navigate, navigationRef } from "@navigators/navigation-utilities"
import { RouteProp, useFocusEffect, useRoute } from "@react-navigation/native"
import { color } from "@theme/color"
import { spacing } from "@theme/spacing"
import { convertYupErrorInner } from "@utils/yup/yup"
import { isEmpty, isNull } from "lodash"
import { ScrollView } from "native-base"
import React, { useCallback, useEffect, useMemo, useRef } from "react"
import * as yup from "yup"
const formFields = [
  {
    id: "name",
    placeholder: "Business Name",
    isHasButton: true,
  },
  {
    id: "categories",
    placeholder: "Categories (Ex: Pizza (Be specific))",
    isHasButton: true,
  },
  {
    id: "address",
    placeholder: "Address",
    isHasButton: true,
  },
  {
    id: "city",
    placeholder: "City",
    isHasButton: true,
  },
  {
    id: "state",
    placeholder: "State",
    isHasButton: true,
  },
  {
    id: "zipcode",
    placeholder: "Zipcode",
  },
  {
    id: "phoneNumber",
    placeholder: "Phone Number",
  },
]

const schema = yup.object().shape({
  name: yup.string().required("Name is required"),
  address: yup.string().required("Address is required"),
  city: yup.string().required("City is required"),
  state: yup.string().required("State is required"),
  zipcode: yup.string().required("Zipcode is required"),
  categories: yup.string().required("Categories is required"),
  phoneNumber: yup.string().required("Phone number is required"),
})

interface StoreFormScreenProps {}

const StoreFormScreen: React.FC<StoreFormScreenProps> = () => {
  const { userStore, authStore } = useStores()
  const { createStore } = useStoresInfo()

  const route = useRoute<RouteProp<AuthNavigatorParamList, AUTH_SCREENS.storeForm>>()
  const { data: userInfo, providerName, registerData: registerDataParam } = route.params

  const [storeData, setStoreData] = React.useState({
    name: "",
    address: "",
    city: "",
    state: "",
    zipcode: "",
    categories: "",
    phoneNumber: "",
  })
  const [errors, setErrors] = React.useState({})
  const { register, registerData, registerStatus, registerErrorCode, updateCompany, loading } =
    useAuth()
  const { getStores, stores, getStoreById, storeData: createdStoreData } = useStoresInfo()
  const { getCategorySuggestion, categorySuggestions } = useUtility()
  const modalRef = useRef<IRefCustomModal>()
  useEffect(() => {
    getCategorySuggestion()
  }, [])

  useFocusEffect(
    useCallback(() => {
      setStoreData((prev) => ({ ...prev, ...userInfo?.store }))
    }, [userInfo]),
  )

  useEffect(() => {
    if (!isNull(registerErrorCode)) {
      switch (registerErrorCode) {
        default:
          alert("Error, please try again")
      }
    }
  }, [registerErrorCode])

  useEffect(() => {
    if (stores.length > 0) {
      getStoreById(stores[0].id)
    }
  }, [stores])

  useEffect(() => {
    if (!isEmpty(createdStoreData)) {
      navigationRef.reset({
        index: 0,
        routes: [
          {
            name: AUTH_SCREENS.companyHours,
            params: {
              storeDetail: createdStoreData,
              registerData: isEmpty(registerData)
                ? { userInfo: registerDataParam.userInfo }
                : registerData,
            },
          },
        ],
      })
    }
  }, [createdStoreData])

  useEffect(() => {
    if (registerStatus) {
      alert("Sign up successful")
      setTimeout(() => {
        getStores()
      }, 1000)
    }
  }, [registerStatus])

  const handleFieldChange = (key: string, text: string) => {
    setStoreData((prev) => {
      if (Object.keys(errors).includes(key)) {
        delete errors[key]
      }
      return { ...prev, [key]: text }
    })
  }

  const onSignUp = async () => {
    try {
      await schema.validate(storeData, { abortEarly: false })
      if (providerName === "email") {
        const signUpData = {
          ...userInfo,
          store: storeData,
          categories: categorySuggestions.find(({ value }) => value === storeData.categories).key,
        }
        register(signUpData)
      } else {
        const { company } = registerDataParam.userInfo
        const { token } = authStore.Auth
        // createStore(storeData)
        updateCompany(storeData, company.id, token)
      }
    } catch (err) {
      setErrors(convertYupErrorInner(err.inner))
    }
  }

  const handleOnPress = (key: keyof StoreByIdDTO) => {
    switch (key) {
      case "name":
        navigate(COMMON_SCREENS.searchLocation, {
          fromScreen: AUTH_SCREENS.storeForm,
          type: "establishment",
        } as CommonNavigatorParamList[COMMON_SCREENS.searchLocation])
        break
      case "categories":
        modalRef.current?.openModal()
        break
      case "address":
      case "city":
      case "state":
        navigate(COMMON_SCREENS.searchLocation, {
          fromScreen: AUTH_SCREENS.storeForm,
        } as CommonNavigatorParamList[COMMON_SCREENS.searchLocation])
        break
    }
  }

  const categorySuggestionArr = useMemo(
    () =>
      categorySuggestions.map((item) => ({
        label: item.value,
        function: () => {
          handleFieldChange("categories", item.value)
          modalRef.current?.closeModal()
        },
      })),
    [categorySuggestions],
  )

  return (
    <Screen keyboardOffset="opt1">
      <ScrollView
        flex={1}
        backgroundColor={color.palette.white}
        paddingX={spacing[2]}
        showsVerticalScrollIndicator={false}
      >
        {formFields.map(
          ({ id, placeholder, ...restProps }: { id: keyof StoreByIdDTO; placeholder: string }) => (
            <TextFieldCustom
              {...restProps}
              key={id}
              buttonClick={() => handleOnPress(id)}
              // placeholderTextColor="black"
              placeholder={placeholder}
              inputStyle={{ color: color.palette.black }}
              onChangeText={(text) => handleFieldChange(id, text)}
              value={storeData[id]}
              errorMsg={errors[id]}
            />
          ),
        )}
        <ButtonCustom isLoading={loading} onPress={onSignUp}>
          Sign up
        </ButtonCustom>
        <CustomModal
          ref={modalRef}
          childView={
            <OptionsPicker
              options={categorySuggestionArr}
              onClose={modalRef.current?.closeModal}
              scrollable
            />
          }
        />
      </ScrollView>
    </Screen>
  )
}

export default StoreFormScreen
