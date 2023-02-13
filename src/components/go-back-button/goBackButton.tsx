import VectorIcon from "@components/vectorIcon/vectorIcon"
import { goBack, navigationRef } from "@navigators/navigation-utilities"
import { color } from "@theme/color"
import * as React from "react"

interface GoBackButtonProps {
  color?: string
}

const GoBackButton = (props: GoBackButtonProps) => {
  if (!navigationRef.canGoBack()) {
    return null
  }
  return (
    <VectorIcon
      onPress={goBack}
      iconSet="ion"
      name="arrow-back-sharp"
      size={32}
      color={props.color || color.palette.white}
    />
  )
}

export default GoBackButton
