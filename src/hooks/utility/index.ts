import { useIsTablet } from "@contexts/isTabletContext"
import { CategorySuggestionDTO, PredictionDTO, UploadDTO } from "@models/backend/response/Ulities"
import { GeolocationError } from "@react-native-community/geolocation"
import { useNavigation } from "@react-navigation/native"
import { getCategorySuggestionApi, getLocation, uploadApi } from "@services/api/Utility"
import { consoleLog } from "@utils/debug"
import { useEffect, useState } from "react"
import { BackHandler } from "react-native"
import { Image } from "react-native-image-crop-picker"

interface Output {
  loading: boolean
  imageData: UploadDTO
  predictions: PredictionDTO[]
  uploadingImage: (photo: Image) => void
  searchLocation: (search: string, type?: "establishment" | "geocode") => void
  categorySuggestions: CategorySuggestionDTO[]
  getCategorySuggestion: () => void
}

export const useUtility = (): Output => {
  const [loading, setLoading] = useState(false)
  const [imageData, setImageData] = useState<UploadDTO>()
  const [predictions, setPredictions] = useState<PredictionDTO[]>([])
  const [categorySuggestions, setCategorySuggestion] = useState<CategorySuggestionDTO[]>([])
  const [geoError, setGeoError] = useState<GeolocationError>()

  const uploadingImage = async (photo: Image) => {
    try {
      setLoading(true)
      const formData = new FormData()
      formData.append("file", {
        uri: photo.path,
        type: photo.mime,
        name: photo.path.substring(photo.path.lastIndexOf("/" + 1)),
      } as unknown as Blob)
      const res = await uploadApi(formData)
      setImageData(res.data)
      setLoading(false)
    } catch (err) {
      setLoading(false)
    }
  }

  const searchLocation = async (search: string, type?: "establishment" | "geocode") => {
    try {
      const res = await getLocation(search, type)
      if (res?.data?.predictions) {
        setPredictions(res.data.predictions)
      }
    } catch (err) {
      consoleLog("get location error", err)
    }
  }

  const getCategorySuggestion = async () => {
    try {
      const res = await getCategorySuggestionApi()
      if (res?.data) {
        setCategorySuggestion(res.data)
      }
    } catch (err) {
      consoleLog("get location error", err)
    }
  }

  return {
    loading,
    imageData,
    uploadingImage,
    searchLocation,
    predictions,
    categorySuggestions,
    getCategorySuggestion,
  }
}

export const useSystemBack = () => {
  const { isTablet } = useIsTablet()
  const navigation = useNavigation()

  useEffect(() => {
    if (!isTablet) {
      return
    }

    const subscription = BackHandler.addEventListener("hardwareBackPress", () => {
      if (navigation == null) {
        return false
      }

      if (navigation.canGoBack() && navigation.isFocused()) {
        navigation.goBack()

        return true
      }

      return false
    })

    return () => subscription.remove()
  }, [navigation, isTablet])
}
