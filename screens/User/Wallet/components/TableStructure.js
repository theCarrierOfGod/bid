import { View, Text, StyleSheet } from 'react-native';
import React from 'react';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { Pressable } from 'react-native';

export default function TableStructure({ data, navigation, token }) {
    return (
        <View>
            <Pressable
                onPress={() => {
                    navigation.navigate('TransactionDetail', {
                        id: data.id
                    });
                }}
            >
                <View style={styles.body}>
                    <View
                        style={{
                            justifyContent: 'center',
                            color: '#000022',
                            width: 55,
                            alignItems: 'center'
                        }}
                    >
                        {data.status === "failed" ? (
                            <>
                                <MaterialIcons name="cancel" size={40} color="red" />
                            </>
                        ) : null}
                        {data.status === "successful" ? (
                            <>
                                <MaterialIcons name="done-all" size={40} color="green" />
                            </>
                        ) : null}
                        {data.status === "processing" ? (
                            <>
                                <MaterialCommunityIcons name="progress-clock" size={40} color="brown" />
                            </>
                        ) : null}
                    </View>
                    <View
                        style={[styles.body2,]}
                    >

                        <View style={[styles.jCenter,]}>
                            <Text style={styles.title}>
                                Deposit
                            </Text>
                            <Text>
                                {data.created_at}
                            </Text>
                        </View>


                        <View
                            style={[styles.jCenter, styles.right]}
                        >
                            <Text style={[styles.title, styles.right]}>
                                <MaterialCommunityIcons name="currency-ngn" size={15} color="black" />
                                {data.amount}
                            </Text>
                            <Text
                                style={[styles.detail, styles.right]}
                            >
                                {data.status}
                            </Text>
                        </View>
                    </View>
                </View >
            </Pressable>
        </View>
    )
}
const styles = StyleSheet.create({
    body: {
        flex: 1,
        marginVertical: 3,
        padding: 7,
        flexDirection: "row",
        borderTopWidth: 2,
        borderColor: 'grey',
        height: 75
    },
    body2: {
        flex: 1,
        marginVertical: 3,
        flexDirection: "row",
        justifyContent: "space-between",
    },
    jCenter: {
        justifyContent: 'center',
        color: '#000022'
    },
    title: {
        textTransform: 'uppercase',
        fontFamily: 'Ubuntu-Bold',
        marginBottom: 4,
        fontSize: 18
    },
    detail: {
        textTransform: 'uppercase',
        fontFamily: 'Ubuntu-Medium',
        marginBottom: 4,
        fontSize: 16
    },
    itemIcom: {
        marginVertical: 12,
    },
    itemTitle: {
        color: 'black',
        fontFamily: 'Ubuntu-Medium'
    },
    right: {
        textAlign: 'right'
    }
})