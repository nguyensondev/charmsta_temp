import { Avatar, ButtonCustom, Header, Screen } from "@components/index"

import { TextFieldCustom } from "@components/text-field"
import { useUser } from "@hooks/user"
import { MAIN_SCREENS } from "@models/enum/screensName"
import { useStores } from "@models/index"
import { navigate } from "@navigators/navigation-utilities"
import { color } from "@theme/color"
import { spacing } from "@theme/spacing"
import { observer } from "mobx-react-lite"
import { FormControl, ScrollView } from "native-base"
import React, { useLayoutEffect } from "react"
import { Alert } from "react-native"
import { nativeBaseStyles, styles } from "./styles"

interface AccountProfileScreenProps {}

const AccountProfileScreen = (props: AccountProfileScreenProps) => {
  const { User } = useStores().userStore
  const { image, fullName, email, address, phoneNumber, id } = User
  const { deleteUserProfile, deleteSuccess } = useUser()

  useLayoutEffect(() => {
    if (deleteSuccess) {
      Alert.alert("Success", "Your account has been deleted!")
    }
  }, [deleteSuccess])

  const onEditProfile = () => {
    navigate(MAIN_SCREENS.editAccount)
  }

  const onChangePassword = () => {
    navigate(MAIN_SCREENS.changePassword)
  }

  const onDeleteAccount = () => {
    Alert.alert("Delete account", "Are you sure you want to delete your account?", [
      { text: "No", style: "destructive" },
      { text: "Yes", onPress: () => deleteUserProfile(id) },
    ])
  }

  return (
    <Screen>
      <Header
        // headerTx="screens.headerTitle.editAccount"
        leftIcon="back"
        rightVectorIcon={{ iconSet: "fea", name: "edit", color: color.palette.lightGrey }}
        onRightPress={onEditProfile}
      />
      <ScrollView>
        <Avatar source={{ uri: image }} size={140} />
        <FormControl px={spacing[1]} pointerEvents="none">
          <TextFieldCustom defaultValue={fullName} labelTx="textInput.label.name" />
          <TextFieldCustom defaultValue={email} labelTx="textInput.label.email" />
          <TextFieldCustom defaultValue={phoneNumber} labelTx="textInput.label.phoneNumber" />
          <TextFieldCustom defaultValue={address} labelTx="textInput.label.address" />
        </FormControl>
      </ScrollView>

      <ButtonCustom
        {...nativeBaseStyles.bottomBtns}
        onPress={onChangePassword}
        textStyle={[styles.buttonLabel, styles.changePass]}
        tx="button.changePassword"
      />
      <ButtonCustom
        {...nativeBaseStyles.bottomBtns}
        onPress={onDeleteAccount}
        textStyle={[styles.buttonLabel, styles.deleteAcc]}
        tx="button.deleteAccount"
      />
    </Screen>
  )
}

export default observer(AccountProfileScreen)
