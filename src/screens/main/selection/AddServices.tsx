import { TextFieldCustom } from "@components/text-field"
import Text from "@components/text/text"
import { useService } from "@hooks/service/useService"
import { translate } from "@i18n/translate"
import { ServiceDTO } from "@models/backend/response/Service"
import { spacing } from "@theme/spacing"
import { debounce } from "lodash"
import { Checkbox, FlatList, Row } from "native-base"
import React, { useContext, useEffect, useLayoutEffect, useMemo, useState } from "react"
import { AdditionSelectContext } from "."
import { naviteBaseStyles, styles } from "./styles"

interface AddServicesProps {}

const AddServices = (props: AddServicesProps) => {
  const [services, setServices] = useState<ServiceDTO[]>([])
  const [searchText, setSearchText] = useState("")
  const { getServiceList, serviceList, pagination } = useService()
  const { saveAdditionSelect, prevSelected } = useContext(AdditionSelectContext)

  const defaultSelecteds = useMemo(
    () => services?.map((service) => service.id.toString()),
    [services],
  )

  useEffect(() => {
    setServices(prevSelected.services.services)
  }, [])

  useEffect(() => {
    saveAdditionSelect({
      services: { services },
    })
  }, [services])

  useLayoutEffect(() => {
    getServiceList(searchText, 0)
  }, [searchText])

  const _renderItem = ({ item, index }: { item: ServiceDTO; index: number }) => {
    const { id, name, price } = item
    const onItemPress = () => {
      if (services.some((service) => service.id === item.id)) {
        setServices((prev) => prev.filter((i) => i.id !== item.id))
      } else {
        setServices((prev) => [...prev, item])
      }
    }

    return (
      <Checkbox
        {...naviteBaseStyles.checkbox}
        value={id.toString()}
        onChange={onItemPress}
        isChecked={!!defaultSelecteds.find((selected) => selected === item.id.toString())}
        children={
          <Row justifyContent={"space-between"} flex={1}>
            <Text fontWeight={"bold"} text={name} />
            <Text
              alignSelf={"center"}
              fontWeight={"bold"}
              text={translate("valueDisplay.currency", { amount: price })}
            />
          </Row>
        }
      />
    )
  }

  const debounceSearchChange = debounce((text) => {
    setSearchText(text)
  }, 500)

  const handleLoadMore = () => {
    getServiceList(searchText, pagination.page + 1)
  }

  return (
    <>
      <TextFieldCustom
        placeholderTx="textInput.placeholder.search"
        onChangeText={debounceSearchChange}
        style={styles.searchBar}
        hideError
      />
      <FlatList
        px={spacing[1]}
        data={serviceList}
        onEndReached={handleLoadMore}
        renderItem={_renderItem}
        keyExtractor={(item) => item.id.toString()}
      />
    </>
  )
}

export default AddServices
