import { Box } from "native-base"
import React, { forwardRef, Ref, useImperativeHandle, useState } from "react"

import { ButtonCustom } from "@components/index"
import Text from "@components/text/text"
import { ProductOption } from "@models/backend/response/Product"
import { color } from "@theme/color"

interface IProductOptionsProps {}

export interface IRefProductOptions {
  productOptions: ProductOption[]
}

const ProductOptions = (props: IProductOptionsProps, ref: Ref<IRefProductOptions>) => {
  const [options, setOptions] = useState<ProductOption[]>([])

  useImperativeHandle(ref, () => ({
    productOptions: options,
  }))

  const onAddNewOption = () => {
    // write code handling add new option below
  }

  return (
    <>
      <Text tx="textInput.label.productOptions" preset="fieldLabel" />
      <Box borderWidth={"1"} borderColor={color.palette.lighterGrey}>
        {options.map((item, index) => (
          <Box key={index.toString()} />
        ))}
        <ButtonCustom
          onPress={onAddNewOption}
          rounded={"none"}
          backgroundColor="transparent"
          text="Add Option"
          // textStyle={{ color: "cyan", fontSize: 16 }}
        />
      </Box>
    </>
  )
}

export default forwardRef(ProductOptions)
