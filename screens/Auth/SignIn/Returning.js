import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Pressable } from 'react-native'

const Returning = ({ navigation }) => {
    return (
        <View>
            <Text>Returning</Text>
            <Pressable
                onPress={() => {
                    navigation.navigate('Home')
                }}
                style={{
                    marginTop: 150
                }}
            >
                <Text>
                    Go To Home
                </Text>
            </Pressable>
        </View>
    )
}

export default Returning

const styles = StyleSheet.create({})