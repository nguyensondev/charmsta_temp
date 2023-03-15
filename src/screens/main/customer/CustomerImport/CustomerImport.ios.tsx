import { ButtonCustom, Header, Screen } from "@components/index"
import { TextFieldCustom } from "@components/text-field"
import Text from "@components/text/text"
import VectorIcon from "@components/vectorIcon/vectorIcon"
import { useCustomer } from "@hooks/customer"
import { useUtility } from "@hooks/utility"
import { ImportCustomer } from "@models/backend/request/Customer"
import { goBack } from "@navigators/navigation-utilities"
import { useFocusEffect } from "@react-navigation/native"
import { color } from "@theme/color"
import { spacing } from "@theme/spacing"
import { debounce, isEmpty } from "lodash"
import moment from "moment"
import { FlatList } from "native-base"
import React, { useCallback, useEffect, useMemo, useState } from "react"
import { TouchableOpacity, View } from "react-native"
import RNContacts, { Contact } from "react-native-contacts"
import { styles } from "./styles"

const CustomerImportScreenIOS = () => {
  const [contacts, setContacts] = useState<Contact[]>([])
  const [selecteds, setSelecteds] = useState<Contact[]>([])
  const [searchText, setSearchText] = useState<string>("")
  const { loading, importStatus, importCustomers } = useCustomer()
  const { uploadImages, imagesData } = useUtility()

  useEffect(() => {
    if (!isEmpty(imagesData)) {
      const formattedData: ImportCustomer[] = selecteds.map((selected) => {
        const {
          phoneNumbers,
          birthday,
          givenName,
          familyName,
          emailAddresses,
          postalAddresses,
          thumbnailPath,
          hasThumbnail,
        } = selected
        return {
          avatar: hasThumbnail ? thumbnailPath : null,
          phoneNumber: phoneNumbers.length > 0 ? phoneNumbers[0].number : null,
          dob: birthday ? moment().set(birthday).unix() : null,
          firstName: givenName,
          lastName: familyName,
          email: emailAddresses.length > 0 ? emailAddresses[0].email : null,
          ...(postalAddresses.length > 0
            ? {
                isoCode: postalAddresses[0].region,
                address: {
                  zipcode: postalAddresses[0].postCode,
                  city: postalAddresses[0].city,
                  address: postalAddresses[0].street,
                },
              }
            : {}),
        }
      })
      imagesData.forEach((image) => {
        const { belongedToIndex, url } = image
        formattedData[belongedToIndex].avatar = url
      })
      importCustomers(formattedData)
    }
  }, [imagesData])

  useEffect(() => {
    if (importStatus) {
      goBack()
    }
  }, [importStatus])

  useFocusEffect(
    useCallback(() => {
      handleCheckPermission()
    }, []),
  )

  const handleCheckPermission = () => {
    RNContacts.checkPermission().then((response) => {
      switch (response) {
        case "authorized":
          getContacts()
          break
        case "denied":
          break
        case "undefined":
          RNContacts.requestPermission().then((res) => {
            switch (res) {
              case "authorized":
                getContacts()
                break
            }
          })
          break
      }
    })
  }

  const getContacts = () =>
    RNContacts.getAll().then((response) => {
      setContacts(response)
    })

  const debounceSearchBarChange = debounce(async (text: string) => {
    setSearchText(text)
  }, 500)

  const onImportPress = () => {
    uploadImages(
      selecteds.map((item) => ({ path: item.hasThumbnail ? item.thumbnailPath : null })) as any,
    )
    // importCustomers(invokingData)
  }

  const renderHeaderComponent = () => {
    const onPress = () => {
      setSelecteds(contacts)
    }
    return (
      <TouchableOpacity style={styles.contactContainer} onPress={onPress}>
        <Text text="Select all" />
        {contacts.length === selecteds.length && (
          <VectorIcon iconSet="ion" name="checkmark" size={24} color={color.primary} />
        )}
      </TouchableOpacity>
    )
  }

  const renderItem = ({ item, index }: { item: Contact; index: number }) => {
    const {
      postalAddresses,
      emailAddresses,
      birthday,
      phoneNumbers,
      givenName,
      familyName,
      thumbnailPath,
      hasThumbnail,
      recordID,
      ...rest
    } = item

    const isSelected = selecteds.some((selected) => selected.recordID === recordID)

    const onItemPress = () => {
      if (isSelected) {
        setSelecteds(selecteds.filter(({ recordID: selectedId }) => selectedId !== recordID))
      } else {
        setSelecteds([...selecteds, item])
      }
    }

    return (
      <TouchableOpacity onPress={onItemPress} style={styles.contactContainer}>
        <View>
          <Text fontWeight={"semibold"} text={`${givenName} ${familyName}`} />
          {phoneNumbers[0] && <Text text={phoneNumbers[0]?.number} />}
        </View>
        {isSelected && (
          <VectorIcon iconSet="ion" name="checkmark" size={24} color={color.primary} />
        )}
      </TouchableOpacity>
    )
  }

  const filteredContacts = useMemo(
    () =>
      isEmpty(searchText)
        ? contacts
        : contacts.filter(
            (contacts) =>
              contacts.familyName.toLocaleLowerCase().includes(searchText.toLocaleLowerCase()) ||
              contacts.givenName.toLocaleLowerCase().includes(searchText.toLocaleLowerCase()) ||
              contacts.phoneNumbers[0]?.number.includes(searchText),
          ),
    [searchText, contacts],
  )

  return (
    <Screen>
      <Header leftIcon="back" onLeftPress={goBack} headerTx="screens.headerTitle.customerImport" />
      <TextFieldCustom
        onChangeText={debounceSearchBarChange}
        placeholderTx={"customer.placeholder.importSearchBar"}
      />
      <FlatList
        data={filteredContacts}
        ListHeaderComponent={renderHeaderComponent}
        keyExtractor={(item) => item.recordID}
        renderItem={renderItem}
      />
      <ButtonCustom
        disabled={isEmpty(selecteds)}
        isLoading={loading}
        w="90%"
        marginBottom={spacing[2]}
        onPress={onImportPress}
      >
        <Text tx={"button.save"} style={{ color: color.palette.white }} />
      </ButtonCustom>
    </Screen>
  )
}

export default CustomerImportScreenIOS
