import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Password from './components/Password'
import { AntDesign, MaterialCommunityIcons, MaterialIcons, Octicons } from '@expo/vector-icons'
const Settings = ({ navigation }) => {
    return (
        <ScrollView
            style={
                styles.container
            }
        >
            <Password style={styles.menu} />
            
            <Pressable style={[styles.row, styles.listHover]}
                hoverStyle={[styles.listHover]}
                activeStyle={[styles.listHover]}
                onPress={() => {
                    navigation.navigate('ChangePassword');
                }}
            >
                <View style={styles.icon}>
                    <Octicons name="key" size={35} color="#004aad" />
                </View>
                <View style={[styles.jCenter, styles.growOne]}>
                    <Text style={styles.infoText}>
                        Change Password
                    </Text>
                </View>
            </Pressable>

            <Pressable style={[styles.row, styles.listHover]}
                hoverStyle={[styles.listHover]}
                activeStyle={[styles.listHover]}
                onPress={() => {
                    navigation.navigate('CreatePin');
                }}
            >
                <View style={styles.icon}>
                    <MaterialCommunityIcons name="dialpad" size={35} color="#004aad" />
                </View>
                <View style={[styles.jCenter, styles.growOne]}>
                    <Text style={styles.infoText}>
                        Change Transaction Pin
                    </Text>
                </View>
            </Pressable>
        </ScrollView>
    )
}

export default Settings

const styles = StyleSheet.create({
    container: {
        padding: 20,
    },
    menu: {
        width: '100%',
        paddingVertical: 10,
        marginVertical: 5,
    },
    jCenter: {
        justifyContent: 'center'
    },
    aCenter: {
        alignItems: 'center'
    },
    row: {
        flexDirection: 'row',
        marginTop: 18
    },
    growOne: {
        flexGrow: 1
    },
    m5: {
        margin: 5
    },
    image: {
        width: 70,
        height: 70,
        borderWidth: 5,
        margin: 10,
        marginRight: 0,
        borderRadius: 100,
        backgroundColor: 'white',
        borderColor: 'white',
        borderWidth: 2,
    },
    button: {
        backgroundColor: "#007AFF",
        padding: 10,
        borderRadius: 12,
        marginBottom: 16,
        shadowColor: "#000000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.4,
        shadowRadius: 4,
        elevation: 5,
        marginLeft: 20
    },
    buttonText: {
        color: "#ffffff",
        fontSize: 16,
        fontWeight: "bold",
    },
    justText: {
        color: "#000",
        fontSize: 16,
        fontWeight: "bold",
    },
    infoText: {
        color: "#007AFF",
        fontSize: 20,
        fontWeight: "800",
        fontFamily: 'Rubik-Bold'
    },
    icon: {
        width: 65,
        height: 65,
        borderRadius: 100,
        margin: 15,
        backgroundColor: '#8cabd5',
        alignItems: 'center',
        justifyContent: 'center'
    },
    listHover: {
        backgroundColor: 'white',
        marginTop: 8
    },
    dets: {
        fontSize: 18,
        fontWeight: 900,
        color: '#004AAD',
        marginHorizontal: 15,
        marginTop: 5
    }
})