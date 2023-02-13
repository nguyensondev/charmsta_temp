export interface Customer {
  id: number
  phoneNumber: string
  countryCode: string
  isoCode: string
  email: null
  firstName: string
  lastName: string
  dob?: number
  gender?: string
  avatar?: string
  verified: boolean
  created: string
  fcmToken?: string
  socketId?: string
  facebook?: string
  instagram?: string
  twitter?: string
  pinterest?: string
  website?: string
  description?: string
  addressId?: number
  address?: {
    id: number
    address?: string
    address2?: string
    state?: string
    city?: string
    zipcode?: string
    country?: string
  }
}

export interface ImportCustomer {
  phoneNumber?: string
  email?: string
  firstName?: string
  lastName?: string
  dob?: number
  gender?: string
  avatar?: string
  following?: number
  follower?: number
  facebook?: string
  instagram?: string
  twitter?: string
  pinterest?: string
  website?: string
  description?: string
  countryCode?: string
  isoCode?: string
}
