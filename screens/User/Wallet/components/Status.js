import { View, Text } from 'react-native'
import React from 'react'
import { Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons'

export default function Status({ status }) {
    return (
        <View
            style={{
                flexDirection: 'column',
                marginTop: 6,
            }}
        >
            {status === "failed" ? (
                <>
                    <Text
                        style={{
                            fontFamily: 'Rubik-Medium',
                            textTransform: 'uppercase',
                            paddingLeft: 5,
                            color: 'red'
                        }}
                    >
                        {status}
                    </Text>
                </>
            ) : null}
            {status === "successful" ? (
                <>

<Text
                            style={{
                                fontFamily: 'Rubik-Medium',
                                textTransform: 'uppercase',
                                paddingLeft: 5,
                                color: 'green'
                            }}
                        >
                            {status}
                        </Text>
                </>
            ) : null}
            {status === "processing" ? (
                <>
                    <Text
                            style={{
                                fontFamily: 'Rubik-Medium',
                                textTransform: 'uppercase',
                                paddingLeft: 5,
                                color: 'brown'
                            }}
                        >
                            {status}
                        </Text>
                </>
            ) : null}

        </View>
    )
}