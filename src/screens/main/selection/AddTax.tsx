import { TextFieldCustom } from "@components/text-field"
import Text from "@components/text/text"
import { useTax } from "@hooks/tax"
import { TaxDTO } from "@models/backend/response/Tax"
import { spacing } from "@theme/spacing"
import { debounce, isEmpty } from "lodash"
import { Checkbox, FlatList, Row } from "native-base"
import React, { useContext, useEffect, useLayoutEffect, useMemo, useState } from "react"
import { AdditionSelectContext } from "."
import { naviteBaseStyles, styles } from "./styles"

interface AddTaxProps {
  singleTax: boolean
}

const AddTax = (props: AddTaxProps) => {
  const { singleTax = false } = props
  const [taxes, setTaxes] = useState<TaxDTO[]>([])
  const [searchText, setSearchText] = useState("")
  const { getTaxList, taxList } = useTax()
  const { saveAdditionSelect, prevSelected } = useContext(AdditionSelectContext)

  const defaultSelecteds = useMemo(() => taxes?.map((tax) => tax.id.toString()), [taxes])

  useEffect(() => {
    const { tax } = prevSelected
    if (!isEmpty(tax)) {
      setTaxes(singleTax ? [tax] : [])
    }
  }, [])

  useEffect(() => {
    saveAdditionSelect({
      tax: taxes[0],
    })
  }, [taxes])

  useLayoutEffect(() => {
    getTaxList()
  }, [searchText])

  const _renderItem = ({ item, index }: { item: TaxDTO; index: number }) => {
    const { id, name, rate } = item
    const onItemPress = () => {
      if (singleTax) {
        setTaxes([item])
      } else {
        if (taxes.some((service) => service.id === item.id)) {
          setTaxes((prev) => prev.filter((i) => i.id !== item.id))
        } else {
          setTaxes((prev) => [item, ...prev])
        }
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
            <Text alignSelf={"center"} fontWeight={"bold"} text={`${rate} %`} />
          </Row>
        }
      />
    )
  }

  const debounceSearchChange = debounce((text) => {
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
      <FlatList
        px={spacing[1]}
        data={taxList}
        renderItem={_renderItem}
        keyExtractor={(item) => item.id.toString()}
      />
    </>
  )
}

export default AddTax
