import React, { FC, useCallback } from "react"
import { View } from "react-native"

import VectorIcon from "@components/vectorIcon/vectorIcon"

import styles from "./styles"

interface TabIconProps {
  tabIndex: number
  isFocused: boolean
}

const TabIcon: FC<TabIconProps> = ({ tabIndex, isFocused }) => {
  const homeIcon = useCallback(() => {
    return (
      <View style={styles.container}>
        <VectorIcon size={24} iconSet="ion" name={isFocused ? "home" : "home-outline"} />
      </View>
    )
  }, [isFocused])

  const homeIcon2 = useCallback(() => {
    return (
      <View style={styles.container}>
        <VectorIcon
          size={24}
          iconSet="ion"
          name={isFocused ? "game-controller" : "game-controller-outline"}
        />
      </View>
    )
  }, [isFocused])
  const homeIcon3 = useCallback(() => {
    return (
      <View style={styles.container}>
        <VectorIcon size={24} iconSet="ion" name={isFocused ? "people" : "people-outline"} />
      </View>
    )
  }, [isFocused])
  const homeIcon4 = useCallback(() => {
    return (
      <View style={styles.container}>
        <VectorIcon
          size={24}
          iconSet="ion"
          name={isFocused ? "person-circle" : "person-circle-outline"}
        />
      </View>
    )
  }, [isFocused])

  const mainView = () => {
    switch (tabIndex) {
      case 0:
        return homeIcon()
      case 1:
        return homeIcon2()
      case 2:
        return homeIcon3()
      case 3:
        return homeIcon4()
      default:
        return homeIcon()
    }
  }

  return <View>{mainView()}</View>
}
export default TabIcon
