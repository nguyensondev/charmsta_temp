import { getDeviceInfo } from "@utils/deviceInfo"
import * as React from "react"

interface IIsTabletContext {
  isTablet: boolean
}

const IsTabletContext = React.createContext<IIsTabletContext>({
  isTablet: false,
})

export const IsTabletContextProvider: React.FC = ({ children }) => {
  const [isTablet, setIsTablet] = React.useState(false)

  React.useLayoutEffect(() => {
    getDeviceInfo().then((res) => {
      if (res.deviceType === "Tablet") {
        setIsTablet(true)
      }
    })
  }, [])

  return <IsTabletContext.Provider value={{ isTablet }}>{children}</IsTabletContext.Provider>
}

export const useIsTablet = () => React.useContext<IIsTabletContext>(IsTabletContext)
