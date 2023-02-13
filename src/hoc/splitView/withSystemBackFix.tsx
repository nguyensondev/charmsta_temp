import { useSystemBack } from "@hooks/utility"
import * as React from "react"
import { Platform } from "react-native"

export const withSystemBackFix = (Comp) =>
  Platform.select({
    android: React.forwardRef((props, ref) => {
      useSystemBack()

      return <Comp ref={ref} {...props} />
    }),
    default: Comp,
  })
