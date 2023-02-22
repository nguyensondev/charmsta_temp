import { TextFieldCustom } from "@components/text-field"
import Text from "@components/text/text"
import VectorIcon from "@components/vectorIcon/vectorIcon"
import { useCustomer } from "@hooks/customer"
import { CustomerDTO } from "@models/backend/response/Customer"
import { color } from "@theme/color"
import { spacing } from "@theme/spacing"
import { debounce } from "lodash"
import { Box, FlatList } from "native-base"
import React, { useContext, useEffect, useLayoutEffect, useState } from "react"
import { TouchableOpacity } from "react-native"
import { AdditionSelectContext } from "."
import { styles } from "./styles"

interface AddCustomerProps {}

const AddCustomer = (props: AddCustomerProps) => {
  const [customer, setCustomer] = useState<Partial<CustomerDTO>>({})
  const [searchText, setSearchText] = useState("")
  const { getCustomers, customers, skip, setSkip } = useCustomer()
  const additionSelectCtx = useContext(AdditionSelectContext)

  useEffect(() => {
    additionSelectCtx.saveAdditionSelect({
      customer,
    })
  }, [customer])

  useLayoutEffect(() => {
    getCustomers(skip, searchText)
  }, [searchText, skip])

  const handleGetMore = () => {
    if (customers.length >= skip) {
      setSkip((prev) => prev + 10)
    }
  }

  const _renderItem = ({ item, index }: { item: CustomerDTO; index: number }) => {
    const onItemPress = () => {
      setCustomer(item)
    }

    return (
      <TouchableOpacity onPress={onItemPress}>
        <Box
          flexDir={"row"}
          justifyContent="space-between"
          p={spacing[1]}
          borderBottomWidth={1}
          borderColor={color.palette.lighterGrey}
        >
          <Text text={`${item?.firstName || ""} ${item?.lastName || ""}`} />
          {customer.id === item.id && <VectorIcon iconSet="ant" name="check" />}
        </Box>
      </TouchableOpacity>
    )
  }

  const debounceSearchChange = debounce((text) => {
    setSkip(0)
    setSearchText(text)
  }, 500)

  return (
    <>
      <TextFieldCustom
        placeholderTx="textInput.placeholder.search"
        onChangeText={debounceSearchChange}
        style={styles.searchBar}
        hideError
      />
      <FlatList data={customers} renderItem={_renderItem} onEndReached={handleGetMore} />
    </>
  )
}

export default AddCustomer
