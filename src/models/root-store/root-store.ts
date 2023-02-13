import { CurrentStoreStoreModel } from "@models/mobx/current_store_store/current-store-store"
import { Instance, SnapshotOut, types } from "mobx-state-tree"
import { CharacterStoreModel } from "../character-store/character-store"
import { AuthStoreModel } from "../mobx/auth_store/auth-store"
import { UserStoreModel } from "../mobx/user-store/user-store"
/**
 * A RootStore model.
 */
// prettier-ignore
export const RootStoreModel = types.model("RootStore").props({
  characterStore: types.optional(CharacterStoreModel, {} as any),
  authStore: types.optional(AuthStoreModel, {} as any),
  userStore: types.optional(UserStoreModel, {} as any),
  currentStoreStore: types.optional(CurrentStoreStoreModel, {} as any),
})

/**
 * The RootStore instance.
 */
export interface RootStore extends Instance<typeof RootStoreModel> {}

/**
 * The data of a RootStore.
 */
export interface RootStoreSnapshot extends SnapshotOut<typeof RootStoreModel> {}
