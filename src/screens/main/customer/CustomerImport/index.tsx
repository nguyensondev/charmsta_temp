import { Platform } from "react-native"
import CustomerImportScreenAndroid from "./CustomerImport.android"
import CustomerImportScreenIOS from "./CustomerImport.ios"

export default Platform.OS === "ios" ? CustomerImportScreenIOS : CustomerImportScreenAndroid
