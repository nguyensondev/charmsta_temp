import { Instance, SnapshotIn, SnapshotOut, types } from "mobx-state-tree"

/**
 * Rick and Morty character model.
 */
export const UserModel = types.model("User").props({
  id: types.number,
  fullName: types.maybeNull(types.string),
  email: types.maybeNull(types.string),
  isActive: types.maybeNull(types.boolean),
  isCreator: types.maybeNull(types.boolean),
  image: types.maybeNull(types.optional(types.string, "")),
  company: types.maybe(
    types.model({
      id: types.number,
      name: types.string,
      categories: types.maybeNull(types.string),
      phoneNumber: types.maybeNull(types.string),
      address: types.maybeNull(types.string),
      address2: types.maybeNull(types.string),
      city: types.maybeNull(types.string),
      state: types.maybeNull(types.string),
      zipcode: types.maybeNull(types.string),
      isActive: types.boolean,
      balance: types.string,
      stripeCustomerId: types.null,
      resellerId: types.null,
      created: types.string,
    }),
  ),
  permissionsId: types.array(types.number),
  appleId: types.maybeNull(types.string),
  googleId: types.maybeNull(types.string),
  facebookId: types.maybeNull(types.string),
  // name: types.maybeNull(types.optional(types.string, "")),
  zipcodeRequest: types.maybeNull(types.boolean),
  phoneNumber: types.maybeNull(types.string),
  address: types.maybeNull(types.string),
})

export interface User extends Instance<typeof UserModel> {}
export interface UserSnapshotOut extends SnapshotOut<typeof UserModel> {}
export interface UserSnapshotIn extends SnapshotIn<typeof UserModel> {}
export const createUserDefaultModel = () => types.optional(UserModel, {})
