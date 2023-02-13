import { Instance, SnapshotOut, types } from "mobx-state-tree"
import { AuthModel } from "../auth/Auth"
import { withEnvironment } from "../../extensions/with-environment"
import { remove, saveString } from "@utils/storage"

/**
 * Example store containing Rick and Morty Auths
 */
export const AuthStoreModel = types
  .model("AuthStore")
  .props({
    Auth: types.optional(AuthModel, {}),
  })
  .extend(withEnvironment)
  .actions((self) => ({
    saveAuth: (token: string, refreshToken: string) => {
      saveString("@token", token)
      saveString("@refreshToken", refreshToken)
      self.Auth.token = token
      self.Auth.refreshToken = refreshToken
    },
  }))
  .actions((self) => ({
    resetAuth: () => {
      remove("@token")
      remove("@refreshToken")
      self.Auth.token = ""
      self.Auth.refreshToken = ""
    },
  }))

type AuthStoreType = Instance<typeof AuthStoreModel>
export interface AuthStore extends AuthStoreType {}
type AuthStoreSnapshotType = SnapshotOut<typeof AuthStoreModel>
export interface AuthStoreSnapshot extends AuthStoreSnapshotType {}
export const createAuthStoreDefaultModel = () => types.optional(AuthStoreModel, {})
