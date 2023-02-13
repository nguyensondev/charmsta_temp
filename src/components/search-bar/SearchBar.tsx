/* eslint-disable react/display-name */
import Text from "@components/text/text"
import { Feather } from "@expo/vector-icons"
import React, { forwardRef, Ref, useImperativeHandle, useLayoutEffect, useState } from "react"
import { Keyboard, TextInput, TouchableOpacity, View } from "react-native"

import styles from "./styles"

export interface RefSearch {
  searchPhrase: string
}

const SearchBar = forwardRef(
  (_props: { searchAction?; cancelAction?; onChangeText? }, ref: Ref<RefSearch>) => {
    const [searchPhrase, setSearchPhrase] = useState("")
    const [clicked, setClicked] = useState(false)

    useLayoutEffect(() => {
      if (_props?.onChangeText) {
        _props.onChangeText(searchPhrase)
      }
    }, [searchPhrase])

    useImperativeHandle(ref, () => ({
      searchPhrase,
    }))

    const onSubmit = (event) => {
      if (_props?.searchAction) {
        _props?.searchAction()
      }
    }

    return (
      <View style={styles.container}>
        <View style={!clicked ? styles.searchBar__unclicked : styles.searchBar__clicked}>
          <Feather name="search" size={20} color="black" style={styles.feather} />
          <TextInput
            style={styles.input}
            placeholder="Search"
            value={searchPhrase}
            onChangeText={setSearchPhrase}
            onFocus={() => {
              setClicked(true)
            }}
            returnKeyType={"done"}
            onSubmitEditing={onSubmit}
          />

          {/* {clicked && (
                    <Entypo name="cross" size={20} color="black" style={styles.entypo} onPress={() => {
                        setSearchPhrase("")
                    }} />
                )} */}
        </View>
        {clicked && (
          <TouchableOpacity
            onPress={() => {
              Keyboard.dismiss()
              _props.cancelAction()
              setSearchPhrase("")
              setClicked(false)
            }}
            style={styles.cancelButton}
          >
            <Text text="Cancel" style={styles.cancelText} />
          </TouchableOpacity>
        )}
      </View>
    )
  },
)

export default SearchBar
