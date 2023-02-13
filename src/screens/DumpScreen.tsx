import { useStores } from "@models/root-store"
import * as React from "react"
import { Text, View, StyleSheet } from "react-native"

interface DumpScreenProps {}

const DumpScreen = () => {
  return (
    <View style={styles.container}>
      <Text>DumpScreen</Text>
    </View>
  )
}

export default DumpScreen

const styles = StyleSheet.create({
  container: {},
})
