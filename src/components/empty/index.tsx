import Text from "@components/text/text"
import { TxKeyPath } from "@i18n/i18n"
import * as React from "react"
import { StyleSheet, View } from "react-native"

interface EmptyDataProps {
  content?: string
  contentTx?: TxKeyPath
}

export const EmptyData = (props: EmptyDataProps) => {
  return (
    <View style={styles.empty}>
      <Text tx={props?.contentTx || "common.empty"} text={props?.content} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {},

  empty: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
  },
})
