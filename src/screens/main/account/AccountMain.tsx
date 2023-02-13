import { Avatar, Header, Screen } from "@components/index"
import Text from "@components/text/text"
import VectorIcon, { VectorIconProps } from "@components/vectorIcon/vectorIcon"
import { useAuth } from "@hooks/auth"
import { MAIN_SCREENS } from "@models/enum/screensName"
import { useStores } from "@models/index"
import { navigate } from "@navigators/navigation-utilities"
import { color } from "@theme/color"
import { observer } from "mobx-react-lite"
import { FlatList, Row, View } from "native-base"
import * as React from "react"
import { Alert, TouchableOpacity } from "react-native"
import { styles } from "./styles"

interface AccountMainnProps {}

interface IOption {
  title: string
  icon: VectorIconProps
  screenName?: MAIN_SCREENS
  textColor?: string
  isDisabled?: boolean
}

const options: IOption[] = [
  {
    title: "My profile",
    icon: { iconSet: "fea", name: "user" },

    screenName: MAIN_SCREENS.accountProfile,
  },

  {
    title: "Store management",
    icon: { iconSet: "fea", name: "trello" },
    screenName: MAIN_SCREENS.storeMenu,
  },
  {
    title: "Store setting",
    icon: { iconSet: "fea", name: "sliders" },
    screenName: MAIN_SCREENS.settings,
  },
  // { title: "Privacy", icon: { iconSet: "fea", name: "shield" }, screenName: MAIN_SCREENS.privacy },
  { title: "Setting", icon: { iconSet: "fea", name: "settings" }, isDisabled: true },
  {
    title: "Logout",
    icon: { iconSet: "fea", name: "log-out" },
    textColor: color.error,
  },
]

const AccountMainScreen = (props: AccountMainnProps) => {
  const { logout } = useAuth()
  const { userStore } = useStores()
  const {
    User: { image, fullName },
  } = userStore

  const HeaderComponent = () => (
    <View style={styles.header}>
      <Avatar source={{ uri: image }} size={140} />
      <Text text={fullName} fontWeight="bold" style={styles.name} />
    </View>
  )

  const onLogoutPress = () => {
    Alert.alert("Logout", "Are you sure you want to logout ?", [
      { text: "No" },
      { text: "Yes", onPress: logout },
    ])
  }

  const onItemPress = (option: IOption) => {
    switch (option.title) {
      case "Logout":
        return onLogoutPress()
      default:
        navigate(option?.screenName)
    }
  }

  const renderItem = ({ item, index }: { item: IOption; index: number }) => {
    const { title, icon, textColor, isDisabled } = item

    return (
      <TouchableOpacity disabled={isDisabled} onPress={() => onItemPress(item)}>
        <Row style={styles.optionContainer}>
          <VectorIcon {...icon} size={20} style={styles.optionsIcon} color={textColor} />
          <Text style={[styles.optionsTitle, { color: textColor }]} text={title} />
        </Row>
      </TouchableOpacity>
    )
  }
  // const ListFooterComponent = () => (
  //   <ButtonCustom style={styles.logoutBtn} text={"Logout"} textStyle={styles.logoutText} />
  //)

  return (
    <Screen>
      <Header
        headerTx="screens.headerTitle.account"
        // rightVectorIcon={{
        //   iconSet: "mat",
        //   name: "logout",
        // }}
        onRightPress={onLogoutPress}
      />
      <FlatList
        ListHeaderComponent={HeaderComponent}
        data={options}
        renderItem={renderItem}
        // ListFooterComponent={ListFooterComponent}
      />
    </Screen>
  )
}

export default observer(AccountMainScreen)
