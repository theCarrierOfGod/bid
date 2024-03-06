import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios'
import { useIsFocused } from '@react-navigation/native';
import { AntDesign, FontAwesome, Ionicons } from '@expo/vector-icons';
import SplashTwo from '../../Onboarding/SplashTwo';
import query from '../../../constants/query';
import AwesomeAlert from 'react-native-awesome-alerts';


const Profile = ({ navigation }) => {
    const isFocused = useIsFocused();
    const [error, setError] = useState(null);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('')
    const [isLoading, setIsLoading] = useState(true);
    const [token, setToken] = useState('');
    const [showAlert, setShowAlert] = useState(false)

    const fetchNow = async (token) => {
        const options = {
            method: "GET",
            url: `${query.baseUrl}user`,
            headers: {
                "Authorization": "Bearer " + token,
            }
        };

        try {
            const response = await axios.request(options);
            if (response.data) {
                setName(response.data.data.name);
                setEmail(response.data.data.email);
                setIsLoading(false);
            } else {
                navigation.navigate('Home');
            }
        } catch (error) {
            console.log(error);
            navigation.navigate('Home');
        }
    }

    const isOnline = async () => {
        try {
            await AsyncStorage.getItem('isLoggedIn')
                .then(value => {
                    if (value != null) {
                        setToken(value)
                        fetchNow(value);
                    } else {
                        navigation.replace('SignIn')
                    }
                })
        } catch (error) {
            console.log(error);
            navigation.navigate('Home');
        }
    }

    const logMeOut = async () => {
        setShowAlert(true)

        const options = {
            method: "POST",
            url: `https://bidsub.com.ng/api/v1/auth/logout`,
            headers: {
                "Authorization": "Bearer " + token,
            }
        };

        try {
            await axios.request(options);
            AsyncStorage.removeItem('UserName');
            AsyncStorage.removeItem('isLoggedIn');
            setShowAlert(false);
            navigation.replace('SignIn');
        } catch (error) {
            console.log(error)
            setShowAlert(false);
        }
    }

    useEffect(() => {
        isOnline();
        setShowAlert(false)
    }, [isFocused]);

    if (isLoading) {
        return <SplashTwo />
    }

    return (
        <ScrollView>
            <AwesomeAlert
                show={showAlert}
                showProgress={false}
                message={"Signing out..."}
                closeOnTouchOutside={false}
                closeOnHardwareBackPress={false}
                showCancelButton={false}
                showConfirmButton={false}
                confirmText="Proceed"
            />
            <View style={[styles.aCenter, styles.row]}>
                <View>
                    <Text style={[styles.row, styles.dets]}>
                        Name:
                        {name}
                    </Text>
                    <Text style={[styles.row, styles.dets]}>
                        Email: {email}
                    </Text>
                </View>
            </View>

            <Text style={[styles.row, styles.dets]}>
                {error}
            </Text>

            <Pressable style={[styles.row, styles.listHover]}
                hoverStyle={[styles.listHover]}
                activeStyle={[styles.listHover]}
                onPress={() => {
                    navigation.navigate('EditInfo');
                }}
            >
                <View style={styles.icon}>
                    <AntDesign name="user" size={40} color="#004aad" />
                </View>
                <View style={[styles.jCenter, styles.growOne]}>
                    <Text style={styles.infoText}>
                        Personal Information
                    </Text>
                    <Text style={styles.justText}>
                        Edit your personal information
                    </Text>
                </View>
                <View style={[styles.jCenter]}>
                    <AntDesign name="right" size={24} style={styles.m5} color="#004aad" />
                </View>
            </Pressable>

            <Pressable style={[styles.row, styles.listHover]}
                hoverStyle={[styles.listHover]}
                activeStyle={[styles.listHover]}
                onPress={() => {
                    navigation.navigate('Settings');
                }}
            >
                <View style={styles.icon}>
                    <AntDesign name="setting" size={40} color="#004aad" />
                </View>
                <View style={[styles.jCenter, styles.growOne]}>
                    <Text style={styles.infoText}>
                        Settings
                    </Text>
                    <Text style={styles.justText}>
                        Account, notifications
                    </Text>
                </View>
                <View style={[styles.jCenter]}>
                    <AntDesign name="right" size={24} style={styles.m5} color="#004aad" />
                </View>
            </Pressable>

            <Pressable style={[styles.row, styles.listHover]}
                hoverStyle={[styles.listHover]}
                activeStyle={[styles.listHover]}
                onPress={() => {
                    navigation.navigate('Help');
                }}
            >
                <View style={styles.icon}>
                    <Ionicons name="help-circle-outline" size={40} color="#004aad" />
                </View>
                <View style={[styles.jCenter, styles.growOne]}>
                    <Text style={styles.infoText}>
                        Help & Support
                    </Text>
                    <Text style={styles.justText}>
                        Help or contact Bidsub
                    </Text>
                </View>
                <View style={[styles.jCenter]}>
                    <AntDesign name="right" size={24} style={styles.m5} color="#004aad" />
                </View>
            </Pressable>

            <Pressable style={[styles.aCenter, styles.row, styles.listHover]}
                hoverStyle={[styles.listHover]}
                activeStyle={[styles.listHover]}
                onPress={() => {
                    logMeOut();
                }}
            >
                <View style={styles.icon}>
                    <FontAwesome name="sign-out" size={40} color="#004aad" />
                </View>
                <View style={[styles.jCenter]}>
                    <Text style={styles.infoText}>
                        Sign Out
                    </Text>
                    <Text style={styles.justText}>
                        Sign out of your account
                    </Text>

                </View>
            </Pressable>
        </ScrollView>
    )
}

export default Profile

const styles = StyleSheet.create({
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
        fontSize: 17,
        fontWeight: "800",
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
    },
    messageStyle: {
        fontFamily: 'Ubuntu-Medium',
    }
})