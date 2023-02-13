/* eslint-disable react/display-name */
import React, { forwardRef, ReactNode, Ref, useImperativeHandle, useState } from "react"
import { ViewStyle } from "react-native"
import ReactNativeModal, { SupportedAnimation } from "react-native-modal"
import { styles } from "./styles"

interface ICustomModal {
  childView: ReactNode
  style?: ViewStyle
  lockBackdropPress?: boolean
  animationIn?: SupportedAnimation
  animationInTiming?: number
  animationOut?: SupportedAnimation
  animationOutTiming?: number
}

export interface IRefCustomModal {
  openModal: () => void
  closeModal: () => Promise<any>
  isOpen: boolean
}

const CustomModal = forwardRef((props: ICustomModal, ref: Ref<IRefCustomModal>) => {
  const { lockBackdropPress, style, childView, ...rest } = props
  const [visible, setVisible] = useState(false)

  useImperativeHandle(ref, () => ({
    openModal,
    closeModal,
    isOpen: visible,
  }))

  const openModal = () => {
    // if (!visible) {
    setVisible(true)
    // }
  }

  const closeModal = () => {
    // if (visible) {
    setVisible(false)
    return new Promise((resolve, reject) => {
      setTimeout(resolve, 350)
    })
    // }
  }

  return (
    <ReactNativeModal
      isVisible={visible}
      onBackdropPress={lockBackdropPress ? null : closeModal}
      style={[styles.modal, style]}
      {...rest}
    >
      {childView}
    </ReactNativeModal>
  )
})

export default CustomModal
