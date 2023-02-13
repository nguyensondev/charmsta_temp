import { translate } from "@i18n/translate"

export const convertMinsValue = (value: number, type?: "duration") => {
  const hour = Math.floor(value / 60)
  const min = value % 60
  switch (type) {
    case "duration":
      return hour > 0
        ? translate("valueDisplay.hm", { hour, min })
        : translate("valueDisplay.m", { min })
    default:
      return `${hour < 10 ? `0${hour}` : hour}:${min < 10 ? `0${min}` : min}`
  }
}
