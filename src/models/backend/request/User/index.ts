export interface UpdateUser {
  id: number
  fullName: string
  newPassword?: string
  oldPassword?: string
  image: string
  phoneNumber: string
  address: string
}
