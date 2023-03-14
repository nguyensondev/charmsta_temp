import { debounce, get, isEmpty } from "lodash"
import { Avatar, Box, Column, Fab } from "native-base"
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { Alert, Animated, FlatList } from "react-native"

import { ButtonCustom, Header, Screen } from "@components/index"
import Text from "@components/text/text"
import VectorIcon from "@components/vectorIcon/vectorIcon"
import { useCustomer } from "@hooks/customer"
import { TxKeyPath } from "@i18n/i18n"
import { CustomerDTO } from "@models/backend/response/Customer"
import { MAIN_SCREENS } from "@models/enum/screensName"

import { translate } from "@i18n/translate"
import { goBack, navigate } from "@navigators/navigation-utilities"
import { useFocusEffect } from "@react-navigation/native"
import { color } from "@theme/color"
import { palette } from "@theme/palette"
import { spacing } from "@theme/spacing"

import SearchBar from "@components/search-bar"
import { RefSearch } from "@components/search-bar/SearchBar"
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
  const { customers, getCustomers, take, setTake, error, loading } = useCustomer()
  const [isOptionExpand, setOptionExapnd] = useState(false)
  const searchBarRef = useRef<RefSearch>()
  const searchStr = get(searchBarRef.current, "searchPhrase", "")
  useEffect(() => {
    if (!isEmpty(error)) {
      Alert.alert("Error", translate("errors.unexpected"))
    }
  }, [error])

  useFocusEffect(
    useCallback(() => {
      setTake(() => {
        getCustomers(10, searchStr)
        return 10
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
    getCustomers(take, searchStr)
  }, [take])

  const debounceGetCustomers = debounce((text) => {
    setTake(10)
    getCustomers(10, text)
  }, 500)

  const handleSearchChange = (text: string) => {
    debounceGetCustomers(text)
  }

  const onSearchCancel = () => {
    setTake(() => {
      getCustomers(10)
      return 10
    })
  }

  const onContactPress = (customerProfile: CustomerDTO) => {
    navigate(MAIN_SCREENS.customerProfile, { customerProfile })
  }

  const handleGetMore = () => {
    if (customers.length % 10 == 0) {
      setTake((prev) => prev + 10)
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
      <SearchBar
        onChangeText={handleSearchChange}
        ref={searchBarRef}
        cancelAction={onSearchCancel}
      />
      <FlatList
        ListEmptyComponent={() => <Text text="No data" alignSelf={"center"} />}
        data={customers}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        // stickyHeaderIndices={[0]}
        onEndReached={handleGetMore}
        renderItem={({ item, index }) => <CustomerItem item={item} index={index} />}
        style={styles.list}
      />
      <FooterSection />
    </Screen>
  )
}

export default CustomerListScreen
