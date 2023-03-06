import { debounce, isEmpty } from "lodash"
import { Avatar, Box, Column, Fab, FlatList } from "native-base"
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { Animated } from "react-native"

import { ButtonCustom, Header, Screen } from "@components/index"
import { TextFieldCustom } from "@components/text-field"
import Text from "@components/text/text"
import VectorIcon from "@components/vectorIcon/vectorIcon"
import { useCustomer } from "@hooks/customer"
import { TxKeyPath } from "@i18n/i18n"
import { CustomerDTO } from "@models/backend/response/Customer"
import { MAIN_SCREENS } from "@models/enum/screensName"

import { goBack, navigate } from "@navigators/navigation-utilities"
import { useFocusEffect } from "@react-navigation/native"
import { color } from "@theme/color"
import { palette } from "@theme/palette"
import { spacing } from "@theme/spacing"
import { styles } from "./styles"

const expandOptionStyle = {
  style: { backgroundColor: palette.black, color: color.palette.white },
  rounded: "md",
  paddingY: "1",
  paddingX: "1.5",
  marginRight: spacing[1] / 2,
}

const expandOptions = [
  {
    key: "addNew",
    onPress: () =>
      navigate(MAIN_SCREENS.customerProfile, {
        editable: true,
      }),
    icon: { iconSet: "ion", name: "md-person-add" },
  },
  {
    key: "importFromContacts",
    onPress: () => navigate(MAIN_SCREENS.customerImport),
    icon: { iconSet: "ion", name: "md-people" },
  },
]

const CustomerListScreen = () => {
  const [searchText, setSearchText] = useState("")
  const { customers, getCustomers, skip, setSkip } = useCustomer()
  const [isOptionExpand, setOptionExapnd] = useState(false)

  useFocusEffect(
    useCallback(() => {
      setSkip(() => {
        getCustomers(0, searchText)
        return 0
      })
    }, []),
  )

  const animated = useRef(new Animated.Value(0)).current
  const animating = () => {
    Animated.timing(animated, {
      useNativeDriver: true,
      toValue: isOptionExpand ? 0 : -65,
      duration: 500,
    }).start()
  }

  useEffect(() => {
    getCustomers(skip, searchText)
  }, [searchText, skip])

  const renderSearchBar = useCallback(() => {
    const handleChangeText = (text: string) => {
      setSkip(0)
      setSearchText(text)
    }

    const debounceChangeText = debounce(handleChangeText, 500)

    return (
      <TextFieldCustom
        marginBottom={spacing[1]}
        style={styles.searchBar}
        onChangeText={debounceChangeText}
        placeholder={"Input name or phone number here"}
        hideError
      />
    )
  }, [])

  const onContactPress = (customerProfile: CustomerDTO) => {
    navigate(MAIN_SCREENS.customerProfile, { customerProfile })
  }

  const handleGetMore = () => {
    if (customers.length >= skip) {
      setSkip((prev) => prev + 10)
    }
  }

  const CustomerItem = useCallback(
    ({ item }: { item: CustomerDTO; index: number }) => {
      const { firstName, lastName, avatar, phoneNumber, countryCode } = item
      const displayName = useMemo(
        () =>
          isEmpty(firstName) && isEmpty(lastName) ? "" : `${firstName || ""} ${lastName || ""}`,
        [firstName, lastName],
      )
      const displayPhoneNumber = useMemo(() => `${countryCode} ${phoneNumber}`, [phoneNumber])
      return (
        <ButtonCustom
          onPress={() => onContactPress(item)}
          justifyContent="flex-start"
          backgroundColor={color.palette.white}
          rounded="3xl"
          marginBottom={spacing[1]}
          w={"90%"}
          shadow={"2"}
        >
          <Box flexDirection="row" alignItems="center" padding={"1.5"}>
            <Avatar source={{ uri: avatar }} size="lg" marginRight={spacing[1]} />
            <Column>
              <Text fontWeight="bold">{displayName}</Text>
              <Text fontWeight="light">{displayPhoneNumber}</Text>
            </Column>
          </Box>
        </ButtonCustom>
      )
    },
    [customers],
  )

  const FooterSection = () => (
    <>
      <Animated.View
        style={{
          transform: [
            {
              translateY: animated,
            },
          ],
        }}
      >
        {isOptionExpand && (
          <Box position="absolute" right={spacing[3] / 2} bottom={50}>
            {expandOptions.map(
              ({
                key,
                onPress,
                icon,
              }: {
                key: string
                onPress: () => void
                icon: {
                  name: string
                  iconSet: "ion"
                }
              }) => (
                <Box
                  onTouchStart={onPress}
                  onTouchEnd={() => setOptionExapnd(false)}
                  key={key}
                  marginBottom={spacing[1]}
                  flexDirection="row"
                  justifyContent="flex-end"
                  alignItems="center"
                >
                  <Text tx={`customer.buttonAction.${key}` as TxKeyPath} {...expandOptionStyle}>
                    {key}
                  </Text>
                  <Box
                    alignItems="center"
                    justifyContent="center"
                    backgroundColor={"cyan.600"}
                    rounded={"full"}
                    w={12}
                    h={12}
                  >
                    <VectorIcon {...icon} color={color.palette.white} size={20} />
                  </Box>
                </Box>
              ),
            )}
          </Box>
        )}
      </Animated.View>
      <Fab
        bottom={50}
        onPress={() => {
          setOptionExapnd((prev) => !prev)
          animating()
        }}
        // onPress={() => navigate(MAIN_SCREENS.customerProfile, { editable: true })}
        _pressed={{ opacity: 0.2 }}
        h={16}
        w={16}
        label={"+"}
        size="lg"
        rounded={"full"}
        backgroundColor={color.palette.black}
        renderInPortal={false}
      />
    </>
  )

  return (
    <Screen>
      <Header onLeftPress={goBack} headerTx={"screens.headerTitle.customerList"} />
      <FlatList
        data={customers}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        stickyHeaderIndices={[0]}
        ListHeaderComponent={renderSearchBar}
        onEndReached={handleGetMore}
        renderItem={({ item, index }) => <CustomerItem item={item} index={index} />}
      />
      <FooterSection />
    </Screen>
  )
}

export default CustomerListScreen
