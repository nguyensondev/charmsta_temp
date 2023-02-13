import { Instance, SnapshotIn, SnapshotOut, types } from "mobx-state-tree"

/**
 * Rick and Morty character model.
 */
export const CurrentStoreModel = types.model("CurrentStore").props({
  id: types.maybeNull(types.number),
  name: types.maybeNull(types.string),
  bookingPage: types.maybeNull(types.string),
  categories: types.maybeNull(types.string),
  phoneNumber: types.maybeNull(types.string),
  email: types.maybeNull(types.string),
  address: types.maybeNull(types.string),
  address2: types.maybeNull(types.string),
  city: types.maybeNull(types.string),
  state: types.maybeNull(types.string),
  zipcode: types.maybeNull(types.string),
  currency: types.maybeNull(types.string),
  timezone: types.maybeNull(types.string),
  icon: types.maybeNull(types.string),
  image: types.maybeNull(types.string),
  distance: types.maybeNull(types.number),
  rate: types.maybeNull(types.number),
  reviewCount: types.maybeNull(types.number),
  hasService: types.maybeNull(types.boolean),
  openHours: types.maybeNull(
    types.array(
      types.model({
        id: types.maybeNull(types.number),
        day: types.maybeNull(types.number),
        fromHour: types.maybeNull(types.string),
        toHour: types.maybeNull(types.string),
        open: types.maybeNull(types.boolean),
        store: types.maybeNull(types.model({})),
        storeId: types.maybeNull(types.number),
      }),
    ),
  ),
  default: types.maybeNull(types.boolean),
  bookingSlotSize: types.maybeNull(types.number),
  notes: types.maybeNull(types.string),
  cancelTime: types.maybeNull(types.number),
  appointmentSetting: types.maybeNull(
    types.model({
      id: types.maybeNull(types.number),
      bookingSlotSize: types.maybeNull(types.number),
      noteForCustomer: types.maybeNull(types.string),
      cancellationPolicy: types.maybeNull(types.number),
      offHoursBooking: types.maybeNull(types.boolean),
      doubleBooking: types.maybeNull(types.boolean),
      customServiceDuration: types.maybeNull(types.boolean),
      customServiceCost: types.maybeNull(types.boolean),
      appointmentSlots: types.maybeNull(types.number),
      weekStartDay: types.maybeNull(types.number),
      reminder: types.maybeNull(types.boolean),
      bookingReminderMessage: types.maybeNull(types.string),
      reminderInMinute: types.maybeNull(types.number),
      rebookingReminder: types.maybeNull(types.boolean),
      bookingChanges: types.maybeNull(types.boolean),
      bookingConfirmedMessage: types.maybeNull(types.string),
      bookingChangedMessage: types.maybeNull(types.string),
      bookingCancelledMessage: types.maybeNull(types.string),
      rebookingReminderInDay: types.maybeNull(types.number),
      rebookingReminderMessage: types.maybeNull(types.string),
      didNotShow: types.maybeNull(types.boolean),
      didNotShowAfterMinute: types.maybeNull(types.number),
      didNotShowMessage: types.maybeNull(types.string),
      folllowUp: types.maybeNull(types.boolean),
      folllowUpAfterMinute: types.maybeNull(types.number),
      folllowUpMessage: types.maybeNull(types.string),
      storeId: types.maybeNull(types.number),
    }),
  ),
})

export interface CurrentStore extends Instance<typeof CurrentStoreModel> {}
export interface CurrentStoreSnapshotOut extends SnapshotOut<typeof CurrentStoreModel> {}
export interface CurrentStoreSnapshotIn extends SnapshotIn<typeof CurrentStoreModel> {}
export const createCurrentStoreDefaultModel = () => types.optional(CurrentStoreModel, {})
