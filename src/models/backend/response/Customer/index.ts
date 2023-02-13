export interface CustomerDTO {
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
  companyCustomer: [
    {
      id: number
      totalPoint: number
      nickname: string
      lastCheckIn: string
      note: string
      remindSent: false
      companyId: number
      customerId: number
      balance: number
      giftCardBalance: number
      created: string
    },
  ]
}

// export type GetCustomersDTO = Array<CustomerDTO>
