import { StyleSheet, Text, View } from 'react-native'
import React from 'react';

const SuccessBox = ({ message }) => {

    return (
        <Text
            style={styles.buttonText}
        >{message}</Text>
    )
}

export default SuccessBox

const styles = StyleSheet.create({
    container: {
        paddingTop: 100,
        paddingHorizontal: 30,
    },
    box: {
        width: '100%',
        height: 200,
    },
    button: {
        marginTop: 50,
        paddingVertical: 20,
        paddingHorizontal: 40,
        borderRadius: 15,
        width: '90%',
        alignSelf: 'center',
        justifyContent: 'center'
    },
    buttonText: {
        color: 'green',
        textAlign: 'center',
        fontSize: 24,
        fontFamily: 'Ubuntu-Bold',
        textTransform: 'uppercase',
        marginTop: 35
    }
});