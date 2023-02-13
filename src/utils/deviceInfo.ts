import DeviceInfo from "react-native-device-info"
interface IDeviceInfo {
  deviceType: string
  uniqueId: string
  deviceId: string
  deviceToken: string
}

export const getDeviceInfo = async (): Promise<IDeviceInfo> => {
  const { getDeviceType, getUniqueId, getDeviceId, getDeviceToken } = DeviceInfo
  const deviceType = getDeviceType()
  const uniqueId = await getUniqueId()
  const deviceId = getDeviceId()
  const deviceToken = await getDeviceToken().catch(() => "N/A")
  return {
    deviceType,
    uniqueId,
    deviceId,
    deviceToken,
  }
}
