import { useIsTablet } from "@contexts/isTabletContext"
import React from "react"
import { View } from "react-native"
import { styles } from "./styles"

interface ISplitView {
  master: JSX.Element
  detail: JSX.Element
}

const SplitView: React.FC<ISplitView> = ({ master, detail }) => {
  const { isTablet } = useIsTablet()

  if (!isTablet) return master

  return (
    <View style={styles.root}>
      <View style={styles.masterView}>{master}</View>
      <View style={styles.detailView}>{detail}</View>
    </View>
  )
}

export default SplitView
