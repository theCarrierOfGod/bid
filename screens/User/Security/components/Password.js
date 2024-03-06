import { StyleSheet, Switch, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialIcons } from '@expo/vector-icons';

const Password = () => {
    const [isEnabled, setIsEnabled] = useState(false);
    
    const toggleSwitch = () => {
        if (isEnabled) {
            setIsEnabled(false);
            AsyncStorage.removeItem('RememberPassword');
        } else {
            setIsEnabled(true);
            AsyncStorage.setItem('RememberPassword', 'true');
        }
        console.log()
    };

    const getUsername = async () => {
        try {
            await AsyncStorage.getItem('RememberPassword')
                .then(value => {
                    if (value != null) {
                        setIsEnabled(true)
                    }
                })
        } catch (error) {
            console.error();
        }
    }

    useEffect(() => {
        getUsername();
    }, [])
    return (
        <View
            style={styles.inline}
        >
            <View
                style={[styles.row, styles.listHover]}
            >
                <View style={styles.icon}>
                    <MaterialIcons name="memory" size={35} color="#004aad" />
                </View>
                <View style={[styles.jCenter, styles.growOne]}>
                    <Text style={styles.infoText}>
                        Enter password whenever you open the app
                    </Text>
                </View>
                <View style={[styles.jCenter]}>
                    <Switch
                        trackColor={{ false: '#767577', true: '#81b0ff' }}
                        thumbColor={isEnabled ? '#004aad' : '#f4f3f4'}
                        ios_backgroundColor="#3e3e3e"
                        onValueChange={toggleSwitch}
                        value={isEnabled}
                    />
                </View>
            </View>
        </View>
    )
}

export default Password

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