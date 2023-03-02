import { ButtonCustom, Header, Screen } from "@components/index"
import CustomModal, { IRefCustomModal } from "@components/modal/CustomModal"
import OptionsPicker from "@components/modal/OptionsPicker"
import Text from "@components/text/text"
import { CALENDAR_FORMAT, TIME_24H_FORMAT } from "@config/constants"
import { useAppointment } from "@hooks/appointment/useAppointment"
import { TxKeyPath } from "@i18n/i18n"
import { translate } from "@i18n/translate"
import { MAIN_SCREENS } from "@models/enum/screensName"
import { MainNavigatorParamList } from "@models/navigator"
import { goBack, navigate, navigationRef } from "@navigators/navigation-utilities"
import { RouteProp, StackActions, useRoute } from "@react-navigation/native"
import { ServicesAndPackages } from "@screens/main/appointment/components"
import { color } from "@theme/color"
import { spacing } from "@theme/spacing"
import { convertCurrency, totalAppointmentPrice } from "@utils/data"
import { convertMinsValue } from "@utils/time"
import { get, isEmpty } from "lodash"
import moment from "moment"
import { FormControl, ISelectProps, Row, ScrollView, Select, TextArea, View } from "native-base"
import React, { useEffect, useLayoutEffect, useRef } from "react"
import { nativeBaseStyle, styles } from "./styles"

const defaultSelectProps = {
  dropdownCloseIcon: <View />,
  // height: SELECT_HEIGHT,
  py: spacing[1],
  mt: 1,
  borderWidth: 0,
  borderBottomWidth: 1,
  borderRadius: "none",
} as ISelectProps

interface AppointmentDetailScreenProps {}

const AppointmentDetailScreen = (props: AppointmentDetailScreenProps) => {
  const { params } = useRoute<RouteProp<MainNavigatorParamList, MAIN_SCREENS.appointmentDetail>>()

  const appointmentId = get(params, "detail.id") as number
  const modalRef = useRef<IRefCustomModal>(null)
  const { editAppointment, editedAppointment, getAppointmentById, appointmentDetail } =
    useAppointment()
  const { customer, label, start, duration, note, id, status, services, packages } =
    appointmentDetail

  useLayoutEffect(() => {
    getAppointmentById(appointmentId)
  }, [...Object.values(params.detail)])

  useEffect(() => {
    if (!isEmpty(editedAppointment)) {
      goBack()
    }
  }, [editedAppointment])

  const totalPrice = totalAppointmentPrice(services, packages)

  const RenderBody = () => {
    const durationString = convertMinsValue(duration, "duration")
    return (
      <ScrollView paddingX={spacing[1]} contentContainerStyle={{ paddingBottom: spacing[2] }}>
        {/* date */}
        <View style={styles.viewDate}>
          <Text style={styles.txtDate}>{moment(start).format(CALENDAR_FORMAT)}</Text>
        </View>
        {/* customer */}
        <FormControl pointerEvents="none" style={styles.viewCustomer}>
          <Text tx="appointment.customer" style={styles.lbl} />
          <Select
            {...defaultSelectProps}
            selectedValue={customer?.id?.toString()}
            accessibilityLabel="Add a Customer"
            placeholder="Add a Customer"
          >
            <Select.Item
              key={customer?.id}
              label={`${customer?.firstName || ""} ${customer?.lastName || ""}`}
              value={customer?.id?.toString()}
            />
          </Select>
        </FormControl>
        {/* start time */}
        <FormControl {...nativeBaseStyle.formController} pointerEvents="none">
          <Text tx="appointment.startTime" style={styles.lbl} />
          <Select
            {...defaultSelectProps}
            selectedValue={start}
            accessibilityLabel=""
            placeholder=""
          >
            <Select.Item key={start} label={moment(start).format(TIME_24H_FORMAT)} value={start} />
          </Select>
        </FormControl>
        {/* label */}
        <FormControl
          pointerEvents="none"
          {...nativeBaseStyle.formController}
          style={styles.viewLabel}
        >
          <Text tx="appointment.label" style={styles.lbl} />
          <Select
            {...defaultSelectProps}
            selectedValue={label?.id.toString()}
            accessibilityLabel=""
            placeholder=""
          >
            <Select.Item key={label?.id} label={label?.name} value={label?.id.toString()} />
          </Select>
        </FormControl>
        {/* services and pacakges area */}
        <ServicesAndPackages services={services} packages={packages} />
        {/* <FormControl pointerEvents="none" style={styles.viewService}>
          <Text tx="service.service" style={styles.lbl} />
          <Select
            {...defaultSelectProps}
            selectedValue={service.id.toString()}
            accessibilityLabel="Add a Service"
            placeholder="Add a Service"
          >
            <Select.Item key={service.id} label={service.name} value={service.id.toString()} />
          </Select>
        </FormControl> */}
        {/* staff */}
        {/* <FormControl pointerEvents="none" style={styles.viewStaff}>
          <Text tx="appointment.staff" style={styles.lbl} />
          <Select
            {...defaultSelectProps}
            selectedValue={staff.id.toString()}
            accessibilityLabel=""
            placeholder=""
          >
            <Select.Item key={staff.id} label={staff.name} value={staff.id.toString()} />
          </Select>
        </FormControl> */}

        {/* status */}
        <FormControl pointerEvents="none" {...nativeBaseStyle.formController}>
          <Text tx="appointment.status" style={styles.lbl} />
          <Select
            {...defaultSelectProps}
            selectedValue={status}
            accessibilityLabel=""
            placeholder=""
          >
            <Select.Item
              key={status}
              label={translate(`appointment.currentStatus.${status}` as TxKeyPath)}
              value={status}
            />
          </Select>
        </FormControl>
        {/* duration */}

        <FormControl pointerEvents="none" {...nativeBaseStyle.formController}>
          <Text tx="appointment.duration" style={styles.lbl} />
          <Select {...defaultSelectProps} selectedValue={durationString}>
            <Select.Item key={duration} label={durationString} value={durationString} />
          </Select>
        </FormControl>
        {/* notes */}
        <FormControl pointerEvents="none" {...nativeBaseStyle.formController}>
          <Text tx="appointment.notes" style={styles.lbl} />
          <TextArea
            defaultValue={note}
            h={20}
            placeholder="Notes visible to staff only"
            w="100%"
            autoCompleteType={"off"}
          />
        </FormControl>
      </ScrollView>
    )
  }

  const RenderButtons = () => (
    <View m={spacing[1]}>
      <Text
        alignSelf={"center"}
        mb={spacing[1] / 2}
        text={translate("appointment.total", { defaultValue: convertCurrency(totalPrice) })}
        fontWeight="bold"
      />
      <Row justifyContent="space-between">
        <ButtonCustom
          onPress={() => {
            if (modalRef?.current) {
              modalRef.current.openModal()
            }
          }}
          w="48%"
          // h={SELECT_HEIGHT}
          backgroundColor={color.palette.white}
          borderWidth={1}
        >
          <Text tx="button.moreOptions" />
        </ButtonCustom>
        <ButtonCustom
          w="48%"
          // h={SELECT_HEIGHT}
          onPress={() => {
            navigationRef.dispatch(
              StackActions.replace(MAIN_SCREENS.checkout, {
                appointment: appointmentDetail,
              } as MainNavigatorParamList[MAIN_SCREENS.checkout]),
            )
            // navigate()
          }}
        >
          <Text tx="button.checkout" style={{ color: color.palette.white }} />
        </ButtonCustom>
      </Row>
    </View>
  )

  const screenOptions = [
    {
      label: "Edit appointment detail",
      function: async () => {
        await modalRef.current.closeModal()
        navigate(MAIN_SCREENS.editAppointment, {
          detail: appointmentDetail,
          start: moment(start).format(TIME_24H_FORMAT),
        })
      },
    },
    {
      color: color.error,
      label: "Cancel",
      function: async () => {
        await modalRef.current.closeModal()
        navigationRef.dispatch(
          StackActions.push(MAIN_SCREENS.cancelAppointment, {
            appointmentId: appointmentDetail.id,
          } as MainNavigatorParamList[MAIN_SCREENS.cancelAppointment]),
          // editAppointment(id, { status: AppointmentStatusEnum.Canceled } as AppointmentDTO)
        )
      },
    },
  ]

  return (
    <Screen>
      <Header leftIcon="back" onLeftPress={goBack} />
      <RenderBody />
      <RenderButtons />
      <CustomModal
        ref={modalRef}
        childView={
          <OptionsPicker
            options={screenOptions}
            onClose={() => {
              if (modalRef?.current) {
                modalRef.current.closeModal()
              }
            }}
          />
        }
      />
    </Screen>
  )
}

export default AppointmentDetailScreen
