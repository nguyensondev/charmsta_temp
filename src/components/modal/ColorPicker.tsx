import { ButtonCustom } from "@components/button/buttonCustom"
import Text from "@components/text/text"
import VectorIcon from "@components/vectorIcon/vectorIcon"
import { HEIGHT_WINDOW, WIDTH_WINDOW } from "@config/constants"
import { color } from "@theme/color"
import { spacing } from "@theme/spacing"
import { pSBC } from "@utils/mathMetric"
import { isNull } from "lodash"
import { FlatList } from "native-base"
import * as React from "react"
import { StyleSheet } from "react-native"

interface ColorPickerProps {
  onColorSelect: (value: string) => void
}

const defaultColors = [
  "#F44336",
  "#E91E63",
  "#9C27B0",
  "#673AB7",
  "#3F51B5",
  "#2196F3",
  "#03A9F4",
  "#00BCD4",
  "#009688",
  "#4CAF50",
  "#8BC34A",
  "#CDDC39",
  "#FFEB3B",
  "#FFC107",
  "#FF9800",
  "#FF5722",
  "#795548",
  "#9E9E9E",
  "#607D8B",
  "#000000",
]

const ColorPicker = (props: ColorPickerProps) => {
  const { onColorSelect } = props
  const [first, setFirst] = React.useState(null)

  const colors = React.useMemo(
    () =>
      isNull(first)
        ? defaultColors
        : defaultColors
            .map((color, index, array) => {
              return index !== array.length - 1 ? pSBC(0.05 * index, first) : "back"
            })
            .reverse(),
    [first],
  )

  const onColorPick = (color: string) => {
    if (isNull(first)) {
      setFirst(color)
    } else {
      onColorSelect(color)
    }
  }

  const onClearColor = () => {
    setFirst(null)
  }

  const renderItem = ({ item }) => {
    switch (item) {
      case "back":
        return (
          <ButtonCustom
            style={styles.colorItem}
            bgColor={color.palette.white}
            onPress={onClearColor}
          >
            <VectorIcon iconSet="ion" name="arrow-back" size={WIDTH_WINDOW / 10} />
          </ButtonCustom>
        )
      default:
        return (
          <ButtonCustom onPress={() => onColorPick(item)} bgColor={item} style={styles.colorItem}>
            {/* {finalColor === item && (
        <View
          style={{
            height: 40,
            width: 40,
            borderRadius: 40,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0,0,0,0.5)",
          }}
        >
          <Ionicon name="checkmark" size={35} color="#fff" />
        </View>
      )} */}
          </ButtonCustom>
        )
    }
  }

  return (
    <FlatList
      showsVerticalScrollIndicator={false}
      data={colors}
      borderTopLeftRadius={"2xl"}
      borderTopRightRadius={"2xl"}
      ListHeaderComponent={() => <Text style={styles.listHeader} text="Choose a color: " />}
      backgroundColor={color.palette.white}
      maxHeight={HEIGHT_WINDOW / 2.5}
      contentContainerStyle={styles.colorsContainer}
      numColumns={5}
      renderItem={renderItem}
    />
  )
}

export default ColorPicker

const styles = StyleSheet.create({
  colorItem: {
    alignItems: "center",
    borderRadius: 80,
    height: WIDTH_WINDOW / 5.65,
    justifyContent: "center",
    margin: 5,
    width: WIDTH_WINDOW / 5.65,
  },
  colorsContainer: {
    paddingVertical: spacing[3],
  },
  listHeader: {
    fontSize: 18,
    fontWeight: "bold",
    lineHeight: 18,
    paddingLeft: spacing[2],
  },
})
