import { AuthType } from "@models/mobx/auth/auth"
import { User } from "@models/mobx/user/user"

export interface OpenHoursDTO {
  day: number
  open: boolean
  storeId: number
  id: number
  fromHour: string
  toHour: string
}

export interface SignUpEmailDTO {
  name: string
  address: string
  city: string
  state: string
  zipcode: string
  categories: string
  phoneNumber: string
  email: string
  companyId: 81
  secretKey: string
  subDomain: string
  address2: string | null
  latitude: string | null
  longitude: string | null
  icon: string | null
  image: string | null
  distance: string | null
  rate: string | null
  reviewCount: number | null
  hasService: boolean | null
  website: string | null
  id: number
  priceRange: number
  isActive: boolean
  pushTokens: string[]
  created: string
  imported: boolean
  types: string[]
  timezone: string
  openHours: OpenHoursDTO[]
}

export interface LoginDTO {
  id: number
  accessToken: {
    expiresIn: number
    token: string
    refreshToken: string
  }
}

export interface ForgotDTO {
  email: string
}

export interface RegisterDTO {
  userInfo: User
  accessToken: AuthType
}
