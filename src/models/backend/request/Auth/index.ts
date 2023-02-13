export interface SignUpEmail {
  fullName: string | ""
  email: string
  password: string
  store: {
    name: string
    address: string
    city: string
    state: string
    zipcode: string
    categories: string
    phoneNumber: string
  }
  packageId: number
}

export interface LoginEmail {
  email: string
  password: string
  deviceToken: string
}

export interface FirebaseAuth {
  displayName: string
  email: string
  emailVerified?: boolean
  isAnonymous?: boolean
  metadata?: any[]
  phoneNumber?: string
  photoURL?: string
  providerData?: any[]
  providerId: "firebase"
  tenantId?: string
  uid?: string
}

export interface UpdateCompany {
  name: string
  address: string
  city: string
  state: string
  zipcode: string
  categories: string
  phoneNumber: string
}
export interface CreateCompany extends UpdateCompany {}
