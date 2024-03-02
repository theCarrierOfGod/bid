import { View, Text, ActivityIndicator } from 'react-native'
import React from 'react'
import { Image } from 'expo-image'

const SplashScreen = () => {
    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#004aad' }}>
            <Image
                source={require('./../../assets/images/logo.jpg')}
                style={{
                    width: 200,
                    height: 200
                }}
            />
            <ActivityIndicator size={'small'} color={'white'} />
        </View>
    )
}

export default SplashScreen