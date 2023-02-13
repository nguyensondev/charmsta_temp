import { Instance, SnapshotOut, types } from "mobx-state-tree"

/**
 * Auth model.
 */

export const AuthModel = types.model("Auth").props({
  refreshToken: types.maybe(types.string),
  token: types.maybe(types.string),
})

export type AuthType = Instance<typeof AuthModel>
export interface Auth extends AuthType {}
type AuthSnapshotType = SnapshotOut<typeof AuthModel>
export interface AuthSnapshot extends AuthSnapshotType {}
