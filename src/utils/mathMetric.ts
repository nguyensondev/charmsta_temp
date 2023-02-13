import moment from "moment"
import { Dimensions, PixelRatio, Platform, StyleSheet as RNStyleSheet } from "react-native"

const { width: W, height: H } = Dimensions.get("screen")
const pixelDensity = PixelRatio.get()

const metricsNumber = () => {
  const density = pixelDensity * 160
  const x = Math.pow((W * pixelDensity) / density, 2)
  const y = Math.pow((H * pixelDensity) / density, 2)
  const screenInches = Math.sqrt(x + y) + 1.6

  return screenInches
}

const objectMap = (object, mapFn) => {
  return Object.keys(object).reduce((result, key) => {
    result[key] = mapFn(object[key])
    return result
  }, {})
}

const objectMap2 = (object, overload) => {
  return Object.keys(object).reduce((result, key) => {
    if (typeof object[key] === "number") {
      if (key.includes("flex") || key.includes("opacity") || key.includes("opacity")) {
        result[key] = object[key]
      } else {
        result[key] = scale(object[key])
      }
    } else {
      result[key] = object[key]
    }

    return { ...overload, ...result }
  }, {})
}

const checkTablet = () => {
  const adjustedWidth = width * pixelDensity
  const adjustedHeight = height * pixelDensity
  if (pixelDensity < 2 && (adjustedWidth >= 1000 || adjustedHeight >= 1000)) {
    return true
  } else {
    return pixelDensity === 2 && (adjustedWidth >= 1920 || adjustedHeight >= 1920)
  }
}

export const width = W
export const height = H
export const isTablet = checkTablet()
export const isAndroid = Platform.OS === "android"
export const isIOS = Platform.OS === "ios"

export const scale = (number) => {
  const ratio = (metricsNumber() + pixelDensity) / 10
  const value = number * Number(ratio.toFixed(1))
  return Number(value.toFixed(1))
}

export const StyleSheet = {
  create: (styleSheet, overload = {}) =>
    RNStyleSheet.create(
      objectMap(styleSheet, (value) => {
        const style = objectMap2(value, overload)
        return style
      }),
    ),
}

export const convertIntToWeekdayString = (param: number) =>
  moment().set({ weekday: param }).format("dddd").toLowerCase()

export function pSBC(p: number, c0: string, c1?: any, l?: any) {
  let r
  let g
  let b
  let P
  let f
  let t
  let h
  const i = parseInt
  const m = Math.round
  let a = typeof c1 === "string"
  if (
    typeof p !== "number" ||
    p < -1 ||
    p > 1 ||
    typeof c0 !== "string" ||
    (!c0.startsWith("r") && !c0.startsWith("#")) ||
    (c1 && !a)
  )
    return null
  // @ts-ignore
  if (!window.pSBCr) {
    // @ts-ignore
    window.pSBCr = (d: any) => {
      let n = d.length
      // @ts-ignore
      const x: any = {}
      if (n > 9) {
        ;[r, g, b, a] = d = d.split(",")
        n = d.length
        if (n < 3 || n > 4) return null
        x.r = i(r[3] === "a" ? r.slice(5) : r.slice(4))
        x.g = i(g)
        x.b = i(b)
        // @ts-ignore
        x.a = a ? parseFloat(a) : -1
      } else {
        if (n === 8 || n === 6 || n < 4) return null
        if (n < 6) d = "#" + d[1] + d[1] + d[2] + d[2] + d[3] + d[3] + (n > 4 ? d[4] + d[4] : "")
        d = i(d.slice(1), 16)
        if (n === 9 || n === 5) {
          x.r = (d >> 24) & 255
          x.g = (d >> 16) & 255
          x.b = (d >> 8) & 255
          x.a = m((d & 255) / 0.255) / 1000
        } else {
          x.r = d >> 16
          x.g = (d >> 8) & 255
          x.b = d & 255
          x.a = -1
        }
      }
      return x
    }
  }
  h = c0.length > 9
  h = a ? (c1.length > 9 ? true : c1 === "c" ? !h : false) : h
  // @ts-ignore
  f = window.pSBCr(c0)
  P = p < 0
  // @ts-ignore
  t =
    c1 && c1 !== "c"
      ? // @ts-ignore
        window.pSBCr(c1)
      : P
      ? { r: 0, g: 0, b: 0, a: -1 }
      : { r: 255, g: 255, b: 255, a: -1 }
  p = P ? p * -1 : p
  P = 1 - p
  if (!f || !t) return null
  if (l) {
    r = m(P * f.r + p * t.r)
    g = m(P * f.g + p * t.g)
    b = m(P * f.b + p * t.b)
  } else {
    r = m((P * f.r ** 2 + p * t.r ** 2) ** 0.5)
    g = m((P * f.g ** 2 + p * t.g ** 2) ** 0.5)
    b = m((P * f.b ** 2 + p * t.b ** 2) ** 0.5)
  }
  a = f.a
  t = t.a
  // @ts-ignore
  f = a >= 0 || t >= 0
  // @ts-ignore
  a = f ? (a < 0 ? t : t < 0 ? a : a * P + t * p) : 0
  // @ts-ignore
  if (h)
    return (
      "rgb" +
      (f ? "a(" : "(") +
      r +
      "," +
      g +
      "," +
      b +
      // @ts-ignore
      (f ? "," + m(a * 1000) / 1000 : "") +
      ")"
    )
  // @ts-ignore
  else
    return (
      "#" +
      // @ts-ignore
      (4294967296 + r * 16777216 + g * 65536 + b * 256 + (f ? m(a * 255) : 0))
        .toString(16)
        .slice(1, f ? undefined : -2)
    )
}
