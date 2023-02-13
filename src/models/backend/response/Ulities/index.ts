export interface UploadDTO {
  filename: string
  mimetype: string
  originalname: string
  size: number
  thumb: string
  url: string
}

export interface PredictionTermsDTO {
  offset: number
  value: string
}

export interface CategorySuggestionDTO {
  key: string
  value: string
}

export interface PredictionDTO {
  description: string
  place_id: string
  reference: string
  structured_formatting: {
    main_text: string
    secondary_text: string
  }
  terms: PredictionTermsDTO[]
  types: string[]
}
