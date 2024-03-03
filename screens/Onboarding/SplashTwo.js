import { View, Text, ActivityIndicator } from 'react-native'
import React from 'react'
import { Image } from 'expo-image'

const SplashTwo = () => {
    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#ffffff' }}>
            <Image
                source={require('./../../assets/images/logo.jpg')}
                style={{
                    width: 200,
                    height: 200,
                    borderRadius: 1000
                }}
            />
            <ActivityIndicator size={'large'} color={'#004aad'} />
        </View>
    )
}

export default SplashTwo