import Dropdown from "@components/dropdown"
import { TextFieldCustom } from "@components/text-field"
import Text from "@components/text/text"
import { useService } from "@hooks/service/useService"
import { translate } from "@i18n/translate"
import { PackageDTO } from "@models/backend/response/Package"
import { CategoryDTO, ServiceDTO } from "@models/backend/response/Service"
import { spacing } from "@theme/spacing"
import { getFilteredCategoryList } from "@utils/data"
import { debounce, get, isEmpty } from "lodash"
import { Checkbox, FlatList, Row } from "native-base"

import React, { useContext, useLayoutEffect, useMemo, useState } from "react"
import { AdditionSelectContext } from "."
import { naviteBaseStyles, styles } from "./styles"
interface AddServicesAndPacakgesProps {}

const AddServicesAndPacakges = (props: AddServicesAndPacakgesProps) => {
  const [services, setServices] = useState<{ services?: ServiceDTO[]; packages?: PackageDTO[] }>({})
  const [searchText, setSearchText] = useState("")
  const { saveAdditionSelect, prevSelected } = useContext(AdditionSelectContext)

  const defaultSelecteds = useMemo(
    () =>
      Object.entries(services)
        .map(([key, value]) => value.map(({ id }) => `${key}-${id}`))
        .flat(1),
    [services?.packages, services?.services],
  )

  useLayoutEffect(() => {
    if (!isEmpty(services)) {
      saveAdditionSelect({ services })
    }
  }, [services])

  const { getCatList, catList } = useService()

  useLayoutEffect(() => {
    getCatList(null)
    setServices(prevSelected?.services || {})
  }, [])

  // execute when a service or package is unchecked
  useLayoutEffect(() => {
    const servicePairList = Object.entries(services)
    servicePairList.forEach(([key, value]) => {
      if (isEmpty(value)) {
        delete services[key]
      }
    })
  }, [services])

  const renderCategoryOptions = (option: (PackageDTO | ServiceDTO) & { type: string }) => {
    const { id, name, type, price } = option
    const services = get(option, "services", [])

    const _onChange = (isChecked: boolean) => {
      if (isChecked) {
        setServices((prev) => ({
          ...prev,
          [type]: prev[type] ? [...prev[type], option] : [option],
        }))
      } else {
        setServices((prev) => ({
          ...prev,
          [type]: prev[type].filter(
            (selected: ServiceDTO | PackageDTO) => selected.id !== option.id,
          ),
        }))
      }
    }

    const renderOptionLabel = (type: string, ...params: [name: string, services?: any[]]) => {
      const [name, services] = params
      switch (type) {
        case "services":
          return <Text fontWeight={"bold"} text={name} />
        case "packages":
          return <Dropdown label={name} data={services} />
        default:
          return null
      }
    }

    return (
      <Checkbox
        {...naviteBaseStyles.checkbox}
        key={`category-${type}-${id}`}
        value={`${type}-${id}`}
        onChange={_onChange}
        children={
          <Row justifyContent={"space-between"} flex={1} pl={spacing[1]}>
            {renderOptionLabel(type, name, services)}
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

  const _renderItem = ({ item, index }: { item: CategoryDTO; index: number }) => {
    const packagesAndServices = [
      ...item.packages.map((i) => ({ ...i, type: "packages" })),
      ...item.services.map((i) => ({ ...i, type: "services" })),
    ]

    return (
      <>
        <Text
          text={item.name}
          style={styles.categoryLabel}
          mt={index > 0 ? spacing[2] : spacing[0]}
        />
        <Checkbox.Group {...naviteBaseStyles.checkboxGroup} defaultValue={defaultSelecteds}>
          {packagesAndServices.map(renderCategoryOptions)}
        </Checkbox.Group>
      </>
    )
  }

  const handleChangeText = debounce((value: string) => {
    setSearchText(value.toLowerCase())
  }, 500)

  const filterCatList = useMemo(
    () => getFilteredCategoryList(catList, searchText),
    [searchText, catList],
  )

  return (
    <>
      <TextFieldCustom onChangeText={handleChangeText} placeholder="Search" hideError />

      <FlatList
        px={spacing[1]}
        data={filterCatList}
        renderItem={_renderItem}
        keyExtractor={(item) => item.id.toString()}
      />
    </>
  )
}

export default AddServicesAndPacakges
