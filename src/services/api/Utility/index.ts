import { googleServices } from "@config/index"
import { CategorySuggestionDTO, PredictionDTO, UploadDTO } from "@models/backend/response/Ulities"
import axios from "axios"
import api from "../axios/api-config"
const UPLOAD = "/upload"
const GET_CATEGORY_SUGGEST = "users/suggest-business-type"
const PLACE_AUTOCOMPLETE = "https://maps.googleapis.com/maps/api/place/autocomplete/json"
export const uploadApi = (data: FormData) =>
  api<UploadDTO>(UPLOAD, "POST", data, {
    "Content-Type": "multipart/form-data",
  })

export const getLocation = (search: string, type: "establishment" | "geocode" = "geocode") => {
  return axios.get<{ predictions: PredictionDTO[] }>(PLACE_AUTOCOMPLETE, {
    params: {
      key: googleServices.googleKey,
      input: search,
      // location: `${longitude},${latitude}`,
      type: type,
      maximumAge: 0,
    },
  })
}

export const getCategorySuggestionApi = () => {
  return api<CategorySuggestionDTO[]>(GET_CATEGORY_SUGGEST, "GET")
}
