import { Box } from "native-base"
import * as React from "react"
import { ActivityIndicator } from "react-native"

interface LoadingModalProps {}

const LoadingModal = (props: LoadingModalProps) => {
  return (
    <Box flex={1} justifyContent="center" alignItems="center">
      <ActivityIndicator animating />
    </Box>
  )
}

export default LoadingModal
