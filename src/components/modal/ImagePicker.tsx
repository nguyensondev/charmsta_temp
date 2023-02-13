import { Box } from "native-base"
import React from "react"
import { Image, openCamera, openPicker } from "react-native-image-crop-picker"

import { ButtonCustom } from "@components/button/buttonCustom"
import { TxKeyPath } from "@i18n/i18n"
import { color } from "@theme/color"
import { spacing } from "@theme/spacing"
import { styles } from "./styles"

interface IImagePicker {
  onImageSelect: (data: Image) => void
}

const options = [
  { id: "camera", onPress: openCamera },
  { id: "cameraRoll", onPress: openPicker },
]

const ImagePicker: React.FC<IImagePicker> = ({ onImageSelect }) => {
  // const [selectedImageUrl, setSelectedImageUrl] = useState<string>()

  const handleOptionPress = async (callback: Promise<Image>) => {
    const res = await callback
    onImageSelect(res)
  }

  return (
    <Box
      backgroundColor={color.palette.white}
      borderTopLeftRadius={"3xl"}
      borderTopRightRadius={"3xl"}
    >
      {options.map((item, index) => (
        <ButtonCustom
          key={item.id}
          tx={`picture.options.${item.id}` as TxKeyPath}
          onPress={() => handleOptionPress(item.onPress({ mediaType: "photo", cropping: true }))}
          w="full"
          paddingTop={spacing[1]}
          paddingBottom={spacing[1]}
          backgroundColor={color.palette.white}
          textStyle={styles.optionText}
        />
      ))}
    </Box>
  )
}

export default ImagePicker
