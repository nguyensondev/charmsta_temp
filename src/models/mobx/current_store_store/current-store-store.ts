import { withEnvironment } from "@models/extensions/with-environment"
import { Instance, SnapshotOut, types } from "mobx-state-tree"
import { CurrentStoreModel } from "../current_store/CurrentStore"

export const CurrentStoreStoreModel = types
  .model("CurrentStoreStore")
  .props({
    CurrentStore: types.maybeNull(CurrentStoreModel),
  })
  .extend(withEnvironment)
  .actions((self) => ({
    saveCurrentStore: (data: CurrentStoreStoreType) => {
      self.CurrentStore = { ...self.CurrentStore, ...data }
    },
    clearCurrentStore: () => {
      self.CurrentStore = null
    },
  }))

type CurrentStoreStoreType = Instance<typeof CurrentStoreModel>
export interface CurrentStoreStore extends CurrentStoreStoreType {}
type CurrentStoreStoreSnapshotType = SnapshotOut<typeof CurrentStoreStoreModel>
export interface CurrentStoreStoreSnapshot extends CurrentStoreStoreSnapshotType {}
export const createCurrentStoreStoreDefaultModal = () => types.optional(CurrentStoreStoreModel, {})
