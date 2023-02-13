import Text from "@components/text/text"
import VectorIcon from "@components/vectorIcon/vectorIcon"
import { spacing } from "@theme/spacing"
import { Row } from "native-base"
import React, { useState } from "react"
import { TouchableOpacity } from "react-native"
interface DropdownProps {
  label: string
  data: { id: number | string; name: string }[]
}

const Dropdown = (props: DropdownProps) => {
  const { label, data = [] } = props
  const [isShow, setShow] = useState(false)

  const toggle = () => setShow(!isShow)

  return (
    <TouchableOpacity onPress={toggle}>
      <Row>
        <VectorIcon
          iconSet="ion"
          name={isShow ? "chevron-down-circle" : "chevron-forward-circle"}
        />
        <Text pl={spacing[1] / 4} fontWeight={"bold"} text={label} />
      </Row>
      {isShow
        ? data.map((item, index) => (
            <Row pt={"2"} key={`${item.id}-${item.name}-${index}`}>
              <VectorIcon iconSet="ion" name="md-add" />
              <Text>{item.name}</Text>
            </Row>
          ))
        : null}
    </TouchableOpacity>
  )
}

export default Dropdown
