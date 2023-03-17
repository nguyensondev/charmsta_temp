import { EmptyData } from "@components/empty"
import { Header } from "@components/header/header"
import Loading from "@components/loading/Loading"
import { Screen } from "@components/screen/screen"
import Text from "@components/text"
import VectorIcon from "@components/vectorIcon/vectorIcon"
import { useAppointment } from "@hooks/appointment/useAppointment"
import { translate } from "@i18n/translate"
import { AppointmentLabelDTO } from "@models/backend/response/Appointment"
import { MAIN_SCREENS } from "@models/enum/screensName"

import { goBack, navigate } from "@navigators/navigation-utilities"
import { useFocusEffect } from "@react-navigation/native"
import { color } from "@theme/color"
import { isEmpty } from "lodash"
import { Fab } from "native-base"
import * as React from "react"
import { useCallback, useEffect } from "react"
import { Alert, FlatList, TouchableOpacity, View } from "react-native"
import styles from "./styles"

const Item = ({ item }: { item: AppointmentLabelDTO }) => (
  <View style={styles.viewCard}>
    <View style={[styles.viewLeft, { backgroundColor: item.color }]} />
    <View style={styles.viewCenter}>
      <Text style={styles.contentSize}>{item.name}</Text>
    </View>
    <View style={styles.viewRight}>
      <VectorIcon color={color.alpha.black50} iconSet="ion" name="chevron-forward" />
    </View>
  </View>
)

const LabelListScreen = () => {
  const { loadingLabels, getListLabel, listLabel, delStatus, delALabel, errListLabel } =
    useAppointment()

  useEffect(() => {
    if (!isEmpty(errListLabel)) {
      Alert.alert("Error", translate("errors.unexpected"))
    }
  }, [errListLabel])

  useFocusEffect(
    useCallback(() => {
      getListLabel()
    }, []),
  )

  useEffect(() => {
    if (delStatus) {
      getListLabel()
    }
  }, [delStatus])

  const confirmDel = (item: AppointmentLabelDTO) => {
    Alert.alert("Alert", "Want to delete " + item.name + " Label?", [
      {
        text: "No",
        onPress: () => console.log("Cancel Pressed"),
        style: "cancel",
      },
      { text: "Yes", onPress: () => deleteLabel(item.id) },
    ])
  }

  const deleteLabel = (id: number) => {
    try {
      delALabel(id)
    } catch (error) {
      __DEV__ && console.log(error)
    }
  }

  const renderItem = ({ item }: { item: AppointmentLabelDTO }) => {
    return (
      <TouchableOpacity
        onLongPress={() => confirmDel(item)}
        onPress={() => navigate(MAIN_SCREENS.newLabel, { labelDetail: item })}
      >
        <Item item={item} />
      </TouchableOpacity>
    )
  }

  const renderNewLabel = useCallback(() => {
    return (
      <Fab
        position={"absolute"}
        bottom={50}
        onPress={() => navigate(MAIN_SCREENS.newLabel)}
        _pressed={{ opacity: 0.2 }}
        h={16}
        w={16}
        label={"+"}
        size="lg"
        rounded={"full"}
        backgroundColor={color.palette.black}
        renderInPortal={false}
      />
    )
  }, [])

  const renderLabelList = useCallback(() => {
    return (
      <View style={styles.viewServiceList}>
        {loadingLabels ? (
          <Loading color={"black"} />
        ) : listLabel.length === 0 ? (
          <EmptyData />
        ) : (
          <FlatList
            data={listLabel}
            renderItem={renderItem}
            keyExtractor={(item) => item.id.toString()}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    )
  }, [loadingLabels])

  return (
    <Screen style={styles.body}>
      <Header headerTx="screens.headerTitle.labelList" leftIcon="back" onLeftPress={goBack} />
      {renderNewLabel()}
      {renderLabelList()}
    </Screen>
  )
}

export default LabelListScreen
