import { withEnvironment } from "@models/extensions/with-environment"
import { Instance, SnapshotOut, types } from "mobx-state-tree"
import { UserModel } from "../user/user"

export const UserStoreModel = types
  .model("UserStore")
  .props({
    User: types.maybeNull(UserModel),
  })
  .extend(withEnvironment)
  .actions((self) => ({
    saveUser: (data: Instance<typeof UserModel>) => {
      self.User = { ...self.User, ...data }
    },
    saveUserId: (id: number) => {
      self.User = { ...self.User, id }
    },
    eraseUser: () => {
      self.User = null
    },
  }))

type UserStoreType = Instance<typeof UserModel>
export interface UserStore extends UserStoreType {}
type UserStoreSnapshotType = SnapshotOut<typeof UserStoreModel>
export interface UserStoreSnapshot extends UserStoreSnapshotType {}
export const createUserStoreDefaultModal = () => types.optional(UserStoreModel, {})
