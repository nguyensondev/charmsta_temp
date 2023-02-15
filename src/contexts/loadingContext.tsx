import { HEIGHT_WINDOW, WIDTH_WINDOW } from "@config/constants"
import { color } from "@theme/color"
import { Box } from "native-base"
import * as React from "react"
import { ActivityIndicator } from "react-native"

export interface ILoadingContext {
  open: () => void
  close: () => void
  isLoading: boolean
}

export const LoadingContext = React.createContext<ILoadingContext>({
  open: () => {},
  close: () => {},
  isLoading: false,
})

const LoadingProvider: React.FC = ({ children }) => {
  const [isLoading, setLoading] = React.useState(false)

  const open = () => setLoading(true)
  const close = () => setLoading(false)

  var value = { isLoading, open, close }

  return (
    <LoadingContext.Provider value={value}>
      {isLoading && (
        <Box
          position={"absolute"}
          zIndex={1}
          backgroundColor={color.palette.black}
          opacity={0.5}
          minWidth={WIDTH_WINDOW}
          minHeight={HEIGHT_WINDOW}
          alignItems={"center"}
          justifyContent={"center"}
        >
          <ActivityIndicator animating />
        </Box>
      )}
      {children}
    </LoadingContext.Provider>
  )
}

export default LoadingProvider
