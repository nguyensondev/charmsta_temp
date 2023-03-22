import { ButtonCustom, Header, Screen } from "@components/index"
import { goBack, navigate, navigationRef } from "@navigators/navigation-utilities"
import { RouteProp, StackActions, useRoute } from "@react-navigation/native"

import Text from "@components/text/text"
import { VectorIconProps } from "@components/vectorIcon/vectorIcon"
import { useService } from "@hooks/service/useService"
import { TxKeyPath } from "@i18n/i18n"
import { NewService } from "@models/backend/request/Service"
import { CustomerDTO } from "@models/backend/response/Customer"
import { PackageDTO } from "@models/backend/response/Package"
import { ServiceDTO } from "@models/backend/response/Service"
import { StaffByServiceDTO, StaffDTO } from "@models/backend/response/Staff"
import { TaxDTO } from "@models/backend/response/Tax"
import { MAIN_SCREENS } from "@models/enum/screensName"
import { MainNavigatorParamList } from "@models/navigator"
import FilterAppointment from "@screens/main/calendar/FilterAppointment"
import { color } from "@theme/color"
import { spacing } from "@theme/spacing"
import { get, isEmpty, isNumber } from "lodash"
import React, { createContext, memo, useCallback, useEffect, useMemo, useRef } from "react"
import { Alert } from "react-native"
import AddCustomer from "./AddCustomer"
import AddServices from "./AddServices"
import AddServicesAndPackages from "./AddServicesAndPackages"
import AddStaffByService from "./AddStaffByService"
import AddStaffs from "./AddStaffs"
import AddTax from "./AddTax"
import AddTimeSlot from "./AddTimeSlot"

interface SelectionScreenProps {}

export enum SceneMapNameEnum {
  newService = "newService",
  newAppointment = "newAppointment",
  editAppointment = "editAppointment",
  editServiceStaffs = "editServiceStaffs",
  editStaffServices = "editStaffServices",
  selectTax = "selectTax",
  filterAppointment = "filterAppointment",
}
interface ISceneProperties {
  headerTitle: string
  screen: JSX.Element
  key: keyof IAdditionSelect
}

const sceneMapList: {
  [key in SceneMapNameEnum]: ISceneProperties[]
} = {
  [SceneMapNameEnum.newService]: [
    { headerTitle: "addStaffs", screen: <AddStaffs />, key: "staffs" },
  ],
  [SceneMapNameEnum.newAppointment]: [
    { headerTitle: "selectCustomer", screen: <AddCustomer />, key: "customer" },
    { headerTitle: "selectServices", screen: <AddServicesAndPackages />, key: "services" },
    { headerTitle: "selectStaff", screen: <AddStaffByService />, key: "staff" },
    { headerTitle: "selectTimeSlot", screen: <AddTimeSlot />, key: "startTime" },
  ],
  [SceneMapNameEnum.editAppointment]: [
    {
      headerTitle: "selectServices",
      screen: <AddServicesAndPackages />,
      key: "services",
    },
  ],
  [SceneMapNameEnum.editServiceStaffs]: [
    { headerTitle: "selectStaffs", screen: <AddStaffs />, key: "staffs" },
  ],
  [SceneMapNameEnum.editStaffServices]: [
    { headerTitle: "selectServices", screen: <AddServices />, key: "services" },
  ],
  [SceneMapNameEnum.selectTax]: [
    { headerTitle: "selectTax", screen: <AddTax singleTax={true} />, key: "tax" },
  ],
  [SceneMapNameEnum.filterAppointment]: [
    {
      headerTitle: "filterAppointment",
      screen: <FilterAppointment />,
      key: "staffIds",
    },
  ],
}
interface IAdditionSelect {
  staffs?: StaffDTO[]
  customer?: CustomerDTO
  service?: ServiceDTO
  staff?: StaffByServiceDTO
  startTime?: string
  services?: { services?: ServiceDTO[]; packages?: PackageDTO[] }
  tax?: TaxDTO
  staffIds?: number[]
}
interface IAdditionSelectContext {
  additionSelect: IAdditionSelect
  saveAdditionSelect: (obj: { [key: string]: any }) => void
  prevSelected?: IAdditionSelect
}

export const AdditionSelectContext = createContext<IAdditionSelectContext>(null)

const SelectionScreen = (props: SelectionScreenProps) => {
  const route = useRoute<RouteProp<MainNavigatorParamList, MAIN_SCREENS.additionSelect>>()
  const { actionName, prevSelected = {}, routeIndex = 0 } = route.params
  const additionSelect: IAdditionSelect = useRef(prevSelected).current
  const { addNewService, newService } = useService()
  const { routes: navigationRoutes, index: navigationIndex } = navigationRef.getRootState()

  useEffect(() => {
    const resetRoutes = navigationRoutes
      .map((route) => ({ name: route.name, params: route.params }))
      .filter((route, index, array) => {
        const sceneIndex = array.findIndex((item) => item.name === MAIN_SCREENS.serviceList)
        return index <= sceneIndex
      })
    if (!isEmpty(newService)) {
      navigationRef.reset({ index: 1, routes: resetRoutes })
    }
  }, [newService])

  const _onRightPress = () => {
    const firstAddtionIndex = navigationRoutes.findIndex(
      (route) => route.name === MAIN_SCREENS.additionSelect,
    )
    const newRoutes = navigationRoutes
      .map((route, index) =>
        index < firstAddtionIndex ? { name: route.name, params: route.params } : undefined,
      )
      .filter((route) => route !== undefined)
    Alert.alert("Abort booking", "Are you sure you want to abort the booking ?", [
      {
        text: "No",
      },
      {
        text: "Yes",
        onPress: () =>
          navigationRef.reset({
            index: firstAddtionIndex - 1,
            routes: newRoutes,
          }),
      },
    ])
  }

  const handleButtonPress = () => {
    const currentMapList: ISceneProperties[] = sceneMapList[actionName]

    if (
      routeIndex === currentMapList.length - 1 &&
      Object.values(additionSelect).every((value) =>
        isNumber(value) ? value >= 0 : !isEmpty(value),
      )
    ) {
      switch (actionName) {
        case SceneMapNameEnum.selectTax:
          const { name: prevName, params } = navigationRoutes[navigationIndex - 1]

          if (
            prevName === MAIN_SCREENS.newService ||
            prevName === MAIN_SCREENS.editService ||
            prevName === MAIN_SCREENS.productDetail
          ) {
            navigate(prevName, {
              detail: { ...get(params, "detail", {}), tax: additionSelect.tax },
            })
          }
          break
        case SceneMapNameEnum.editStaffServices:
          const prevParams = navigationRoutes[navigationIndex - 1]
            .params as MainNavigatorParamList[MAIN_SCREENS.staffProfile]
          const newPrams: MainNavigatorParamList[MAIN_SCREENS.staffProfile] = {
            ...prevParams,
            detail: {
              ...prevParams.detail,
              services: additionSelect.services.services,
            },
            updated: true,
          }
          navigate(MAIN_SCREENS.staffProfile, newPrams)
          break
        case SceneMapNameEnum.editAppointment:
          const { params: editParams } = navigationRoutes.find(
            ({ name }) => name === MAIN_SCREENS.editAppointment,
          ) as { params: MainNavigatorParamList[MAIN_SCREENS.editAppointment] }
          const { packages = [], services = [] } = additionSelect.services
          const newDuration = [
            ...packages,
            ...services.map((service) => ({ ...service, duration: service.serviceDuration })),
          ].reduce((prev, curr) => ({
            ...curr,
            duration: prev.duration + curr.duration,
          })).duration
          navigate(MAIN_SCREENS.editAppointment, {
            ...editParams,
            detail: {
              ...editParams.detail,
              ...additionSelect.services,
              duration: newDuration,
            },
          } as MainNavigatorParamList[MAIN_SCREENS.editAppointment])
          break
        case SceneMapNameEnum.newService:
          return addNewService({ ...prevSelected, ...additionSelect } as NewService)
        case SceneMapNameEnum.newAppointment: {
          const { customer, staff, startTime } = additionSelect
          const { packages = [], services = [] } = additionSelect.services
          return navigate(MAIN_SCREENS.newAppointment, {
            appointmentDetail: {
              customerId: customer.id,
              staffId: staff.id,
              services,
              packages,
              // serviceId: service.id,
              // duration: service.serviceDuration,
            },
            start: startTime,
          })
        }
        case SceneMapNameEnum.editServiceStaffs: {
          const { detail: previousDetail } = navigationRoutes[navigationIndex - 1]
            .params as MainNavigatorParamList[MAIN_SCREENS.editService]
          return navigate(MAIN_SCREENS.editService, {
            detail: { ...previousDetail, ...additionSelect },
          } as MainNavigatorParamList[MAIN_SCREENS.editService])
        }
        case SceneMapNameEnum.filterAppointment: {
          const currentIndex = navigationRoutes.findIndex(
            ({ name }) => name === MAIN_SCREENS.additionSelect,
          )

          const newRoutes = navigationRoutes.map(({ name, params, key }, index) =>
            index === currentIndex - 1
              ? {
                  key,
                  name,
                  params: { ...params, filter: additionSelect },
                }
              : { key, name, params },
          )
          navigationRef.reset({
            index: currentIndex - 1,
            routes: newRoutes.slice(0, currentIndex),
          })
          break
        }
      }
    } else {
      if (!isEmpty(get(additionSelect, currentMapList[routeIndex].key))) {
        navigationRef.dispatch(
          StackActions.push(MAIN_SCREENS.additionSelect, {
            prevSelected: additionSelect,
            routeIndex: routeIndex + 1,
            actionName,
          } as MainNavigatorParamList[MAIN_SCREENS.additionSelect]),
        )
      }
    }
  }

  const saveAdditionSelect = (obj: { [key: string]: any }) => {
    Object.entries(obj).forEach(([key, value]) => {
      additionSelect[key] = value
    })
  }

  const RenderFooter = useCallback(
    () => (
      <ButtonCustom w="90%" marginBottom={spacing[1]} onPress={handleButtonPress}>
        <Text
          tx={`button.${
            actionName === "filterAppointment"
              ? "search"
              : routeIndex === sceneMapList[actionName].length - 1
              ? "save"
              : "next"
          }`}
          style={{ color: color.palette.white }}
        />
      </ButtonCustom>
    ),
    [routeIndex, sceneMapList[actionName]],
  )

  const screenDetail = useMemo(() => sceneMapList[actionName][routeIndex], [routeIndex])

  const rightIcon = useMemo(
    () =>
      routeIndex > 0
        ? ({
            iconSet: "ant",
            name: "close",
            color: color.palette.lightGrey,
          } as VectorIconProps)
        : undefined,
    [routeIndex],
  )
  return (
    <AdditionSelectContext.Provider value={{ additionSelect, saveAdditionSelect, prevSelected }}>
      <Screen keyboardOffset="opt1">
        <Header
          headerTx={`screens.headerTitle.${screenDetail?.headerTitle}` as TxKeyPath}
          leftIcon="back"
          onLeftPress={goBack}
          rightVectorIcon={rightIcon}
          onRightPress={_onRightPress}
        />
        {screenDetail.screen}
        <RenderFooter />
      </Screen>
    </AdditionSelectContext.Provider>
  )
}

export default memo(SelectionScreen)
