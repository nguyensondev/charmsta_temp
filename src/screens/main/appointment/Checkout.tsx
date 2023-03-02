import { ButtonCustom, Header, Screen } from "@components/index"
import Text from "@components/text/text"
import { CALENDAR_FORMAT, DATE_FORMAT, TIME_24H_FORMAT } from "@config/constants"
import { useAppointment } from "@hooks/appointment/useAppointment"
import { Checkout } from "@models/backend/request/Appointment"
import { MAIN_SCREENS } from "@models/enum/screensName"
import { MainNavigatorParamList } from "@models/navigator"
import { navigate } from "@navigators/navigation-utilities"
import { RouteProp, useRoute } from "@react-navigation/native"
import { color } from "@theme/color"
import { spacing } from "@theme/spacing"
import { convertCurrency, totalAppointmentPrice, totalAppointmentTax } from "@utils/data"
import { isEmpty } from "lodash"
import moment from "moment"
import { Box, FormControl, ISelectProps, Row, ScrollView, Select, View } from "native-base"
import React, { useEffect, useLayoutEffect, useState } from "react"
import { ServicesAndPackages } from "./components"
import { nativeBaseStyle, styles } from "./styles"

interface CheckoutScreenProps {}

const defaultSelectProps = {
  dropdownCloseIcon: <View />,
  py: spacing[1],
  mt: 1,
  borderWidth: 0,
  borderBottomWidth: 1,
  borderRadius: "none",
} as ISelectProps

const CheckoutScreen = (props: CheckoutScreenProps) => {
  const route = useRoute<RouteProp<MainNavigatorParamList, MAIN_SCREENS.checkout>>()
  const appointment = route?.params?.appointment

  const { checkoutAppointment, checkoutInfo } = useAppointment()

  const { services, packages, start, customer, id, date, labelId, note } = appointment

  const [allCost, setAllCost] = useState<{
    subtotal: number
    discount: number
    coupon: number
    tax: number
    total: number
  }>({
    subtotal: totalAppointmentPrice(services, packages),
    discount: 0,
    coupon: 0,
    tax: totalAppointmentTax(services, packages),
    total: 0,
  })

  useEffect(() => {
    console.log("alo1", checkoutInfo)
    if (!isEmpty(checkoutInfo) && !checkoutInfo.isPaid) {
      navigate(MAIN_SCREENS.paymentType, {
        checkoutInfo,
      } as MainNavigatorParamList[MAIN_SCREENS.paymentType])
    }
  }, [checkoutInfo])

  useLayoutEffect(() => {
    setAllCost((prev) => {
      const { subtotal, discount, coupon, tax } = prev
      return { ...prev, total: subtotal - discount - coupon + tax }
    })
  }, [allCost.coupon, allCost.discount, allCost.subtotal, allCost.tax])

  const onCheckoutPress = () => {
    const checkoutData = {
      bookingId: id,
      coupon: allCost.coupon,
      startTime: moment(date).format(DATE_FORMAT),
      date: moment().toISOString(),
      packages: packages.map(({ id, price, staffId }) => ({ id, price, staffId })),
      services: packages.map(({ id, price, staffId, categoryId }) => ({
        id,
        price,
        staffId,
        categoryId,
      })),
      discount: allCost.discount,
      labelId: labelId,
      note: note,
      total: allCost.total,
    } as Checkout
    checkoutAppointment(checkoutData)
  }

  const RenderBottom = () => (
    <Box>
      <Row px={spacing[1]} justifyContent="space-between">
        <Box>
          <Text tx="textInput.label.subtotal" />
          <Text tx="textInput.label.discount" />
          <Text tx="textInput.label.coupon" />
          <Text tx="textInput.label.tax" />
          <Text tx="textInput.label.total" fontWeight={"bold"} />
        </Box>
        <Box>
          <Text textAlign={"right"} text={convertCurrency(allCost?.subtotal)} />
          <Text textAlign={"right"} text={convertCurrency(allCost?.discount)} />
          <Text textAlign={"right"} text={convertCurrency(allCost?.coupon)} />
          <Text textAlign={"right"} text={convertCurrency(allCost?.tax)} />
          <Text textAlign={"right"} text={convertCurrency(allCost?.total)} fontWeight={"bold"} />
        </Box>
      </Row>
      <ButtonCustom marginBottom={spacing[1]} onPress={onCheckoutPress}>
        <Text tx="button.checkout" style={{ color: color.palette.white }} />
      </ButtonCustom>
    </Box>
  )

  return (
    <Screen>
      <Header leftIcon="back" headerTx="screens.headerTitle.checkout" />
      <ScrollView px={spacing[1]}>
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
        {/* services and packages */}
        <ServicesAndPackages services={services} packages={packages} />
      </ScrollView>
      <RenderBottom />
    </Screen>
  )
}

export default CheckoutScreen
