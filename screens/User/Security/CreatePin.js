import { SafeAreaView, StyleSheet, Text, View } from 'react-native'
import React, { useEffect } from 'react';
import DisplayKeyboard from 'react-native-display-keyboard';
import { Keyboard } from 'react-native';
// import { VirtualKeyboard } from 'react-native-screen-keyboard';

const CreatePin = ({ navigation }) => {

    // Callback function which receives the key pressed
    const keyDown = (key) => {
        console.log(key)
    }

    useEffect(() => {
        Keyboard.addListener('keyboardDidShow', () => {
            alert('Keyboard Shown');
        });

        return () => {

        }
    }, [])


    return (
        <SafeAreaView>
            <View>
                <Text
                style={{
                    fontSize: '20px',
                    textAlign: 'center',
                    lineHeight: 40,
                    marginVertical: 20,
                    fontFamily: 'Ubuntu-Medium'
                }}
                >
                    Set Transaction Pin
                </Text>
            </View>
            <View
                style={{
                    width: '100%',
                    margin: 'auto',
                    borderColor: '#004aad',
                    borderWidth: 2,
                }}
            >
                <DisplayKeyboard
                    charCellHeight={100}
                    charFontSize={30}
                    charCellBackgroundColor={'#fffff'}
                    charCellTextColor={'#004aad'}
                    borderColor={'#004aad'}
                />
            </View>
        </SafeAreaView>
    )
}

export default CreatePin

const styles = StyleSheet.create({})