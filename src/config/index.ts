import RNConfig from "react-native-config"
type Config = {
  api: {
    url: string
  }
  googleServices: {
    webClientId: string
    iosClientId: string
    googleKey: string
  }
  facebook: {
    appId: string
  }
}

const api: Config["api"] = {
  url: RNConfig.API_URL,
} as const

const googleServices: Config["googleServices"] = {
  webClientId: RNConfig.WEB_CLIENT_ID,
  iosClientId: RNConfig.IOS_CLIENT_ID,
  googleKey: RNConfig.GOOGLE_KEY,
} as const

const facebook: Config["facebook"] = {
  appId: RNConfig.FB_APP_ID,
}

export { api, googleServices, facebook }
