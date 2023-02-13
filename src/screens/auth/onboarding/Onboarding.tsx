/* eslint-disable react-native/no-color-literals */
/* eslint-disable react-native/no-inline-styles */
import React, { useRef } from "react"
import { Animated, Image, StatusBar, StyleSheet, TouchableOpacity, View } from "react-native"

import Text from "@components/text"

import { SCREEN_HEIGHT, SCREEN_WIDTH } from "@config/constants"
import { AUTH_SCREENS } from "@models/enum/screensName"
import { navigationRef } from "@navigators/navigation-utilities"
import { saveString } from "@utils/storage"
import styles from "./styles"

const bgs = ["#A5BBFF", "#DDBEFE", "#FF63ED", "#f37952"]
const DATA = [
  {
    key: "3571572",
    title: "Multi-lateral intermediate moratorium",
    description: "I'll back up the multi-byte XSS matrix, that should feed the SCSI application!",
    image: "https://cdn-icons-png.flaticon.com/512/3791/3791216.png",
  },
  {
    key: "3571747",
    title: "Automated radical data-warehouse",
    description: "Use the optical SAS system, then you can navigate the auxiliary alarm!",
    image: "https://cdn-icons-png.flaticon.com/512/7356/7356877.png",
  },
  {
    key: "3571680",
    title: "Inverse attitude-oriented system engine",
    description:
      "The ADP array is down, compress the online sensor so we can input the HTTP panel!",
    image: "https://cdn-icons-png.flaticon.com/512/3789/3789987.png",
  },
  {
    key: "3571603",
    title: "Monitored global data-warehouse",
    description: "We need to program the open-source IB interface!",
    image: "https://cdn-icons-png.flaticon.com/512/2323/2323048.png",
  },
]

const Square = ({ scrollX }: { scrollX: Animated.Value }) => {
  const YOLO = Animated.modulo(
    Animated.divide(Animated.modulo(scrollX, SCREEN_WIDTH), new Animated.Value(SCREEN_WIDTH)),
    1,
  )

  const rotate = YOLO.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: ["35deg", "0deg", "35deg"],
  })

  const translateX = YOLO.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, -SCREEN_HEIGHT, 0],
  })

  return (
    <Animated.View
      style={[
        styles.square,
        {
          transform: [{ rotate }, { translateX }],
        },
      ]}
    />
  )
}

const Backdrop = ({ scrollX }: { scrollX: Animated.Value }) => {
  const backgroundColor = scrollX.interpolate({
    inputRange: bgs.map((_, i) => i * SCREEN_WIDTH),
    outputRange: bgs.map((bg) => bg),
  })

  return <Animated.View style={[StyleSheet.absoluteFillObject, { backgroundColor }]} />
}

const Indicator = ({ scrollX }: { scrollX: Animated.Value }) => {
  return (
    <View style={styles.indicatorView}>
      {DATA.map((_, i) => {
        const inputRange = [(i - 1) * SCREEN_WIDTH, i * SCREEN_WIDTH, (i + 1) * SCREEN_WIDTH]

        const scale = scrollX.interpolate({
          inputRange,
          outputRange: [0.8, 1.4, 0.8],
          extrapolate: "clamp",
        })

        const opacity = scrollX.interpolate({
          inputRange,
          outputRange: [0.6, 0.9, 0.6],
          extrapolate: "clamp",
        })

        return (
          <Animated.View
            key={`indicator-${i}`}
            style={[
              styles.indicator,
              {
                opacity,
                transform: [{ scale }],
              },
            ]}
          ></Animated.View>
        )
      })}
    </View>
  )
}

const handleSkipPress = () => {
  saveString("@skipOnBoarding", "1")
  return navigationRef.reset({ index: 0, routes: [{ name: AUTH_SCREENS.signIn }] })
}

const renderItem = ({ item }) => (
  <View style={styles.body}>
    <View style={styles.topView}>
      <Image source={{ uri: item.image }} style={styles.img} />
    </View>
    <View>
      <Text style={styles.lblTitle}>{item.title}</Text>
      <Text style={styles.lblDes}>{item.description}</Text>
    </View>
  </View>
)

const SkipButton = () => (
  <View style={styles.btnSkip}>
    <TouchableOpacity hitSlop={styles.btnArea} onPress={handleSkipPress}>
      <Text>{"Skip"}</Text>
    </TouchableOpacity>
  </View>
)

const OnboadingScreen = () => {
  const scrollX = useRef(new Animated.Value(0)).current

  return (
    <View style={styles.container}>
      <StatusBar hidden />
      <Backdrop scrollX={scrollX} />
      <Square scrollX={scrollX} />
      <Animated.FlatList
        data={DATA}
        keyExtractor={(item) => item.key}
        horizontal
        scrollEventThrottle={32}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], {
          useNativeDriver: false,
        })}
        contentContainerStyle={styles.flatlistContent}
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        renderItem={renderItem}
      />
      <Indicator scrollX={scrollX} />
      <SkipButton />
    </View>
  )
}

export default OnboadingScreen
