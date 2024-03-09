import { SafeAreaView, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { useIsFocused } from '@react-navigation/native';
import axios from 'axios';
import query from '../../../constants/query';
import SplashTwo from '../../Onboarding/SplashTwo';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { EvilIcons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import Status from './components/Status';
import { StatusBar } from 'expo-status-bar';
import ViewShot, { captureRef } from 'react-native-view-shot';
import Share from 'react-native-share';
import { Dimensions } from 'react-native';
import { TouchableOpacity } from 'react-native';
import { Image } from 'react-native';

const TransactionDetail = ({ route, navigation }) => {
    const isFocused = useIsFocused();
    const { id } = route.params;
    const viewShot = useRef(null);
    const [spinning, setSpinning] = useState(true);
    const [res, setRes] = useState([]);

    const [uri, setUri] = useState("");

    const captureScreen = () => {
        viewShot.current.capture().then((uri) => {
            setUri(uri);
            shareImage(uri)
        });
    };

    const shareImage = async (uri) => {
        try {
            const uri = await captureRef(viewShot, {
                format: 'png',
                quality: 0.7,
            });
            console.log('uri', uri);
            await Share.open({ url: uri });
        } catch (e) {
            console.log(e);
        }
    };

    const fetchNow = async (token) => {
        try {
            const response = await axios.get(`${query.baseUrl}wallet/${id}`, {
                headers: {
                    'Authorization': 'Bearer ' + token
                }
            });
            if (response.data) {
                setRes(response.data.data);
            }
        } catch (error) {
            console.log(error)
            // navigation.navigate('Home')
        } finally {
            setSpinning(false)
        }
    }

    const isOnline = async () => {
        try {
            await AsyncStorage.getItem('isLoggedIn')
                .then(value => {
                    if (value != null) {
                        fetchNow(value);
                    } else {
                        navigation.replace('SignIn')
                    }
                })
        } catch (error) {
            console.log(error);
        }
    }


    useEffect(() => {
        isOnline();
    }, [isFocused])

    if (spinning) {
        return <SplashTwo />
    }

    return (
        <SafeAreaView
            style={{
                flex: 1,
                backgroundColor: 'white'
            }}
        >
            <StatusBar backgroundColor='#004aad' />
            <ViewShot ref={viewShot} style={styles.viewShot}
            >
                <View style={{
                    backgroundColor: 'white',
                    marginVertical: 65,
                    width: '96%',
                    marginHorizontal: '2%',
                    height: '70%'
                }}>
                    {/* Top part */}
                    <View>
                        <View
                            style={{
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                        >
                            <Image
                                source={require('../../../assets/images/logo.jpg')}
                                style={{ width: 150, height: 150, marginTop: 50, borderRadius: 100 }}
                            />
                        </View>
                        <Text
                            style={{
                                textAlign: 'center',
                                fontFamily: 'Ubuntu-Bold',
                                fontSize: 25,
                                marginVertical: 25,
                                textTransform: 'uppercase',
                                color: '#004AAD'
                            }}
                        >
                            Transaction Details
                        </Text>
                        <View>
                            <Status status={res.status} />
                            <View style={{
                                flex: 0,
                                flexDirection: 'row',
                                marginTop: 7
                            }}>
                                <MaterialCommunityIcons style={styles.icon} name="currency-ngn" color={'#004AAD'} size={29} />
                                <Text style={styles.amountText}>
                                    {res.amount}
                                </Text>
                            </View>
                            <Text
                                style={{
                                    fontFamily: 'Rubik-Bold',
                                    textTransform: 'uppercase',
                                    paddingLeft: 5,
                                    marginTop: 16,
                                    color: '#004AAD'
                                }}
                            >
                                {res.created_at}
                            </Text>
                        </View>
                    </View>

                    <View
                        style={{
                            width: '98%',
                            marginHorizontal: '1%',
                            borderColor: '#004AAD',
                            borderWidth: 2,
                            borderRadius: 9,
                            padding: 8,
                            marginTop: 40,
                            marginBottom: 60
                        }}
                    >
                        <View
                            style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                            }}
                        >
                            <Text style={styles.balText}>
                                Balance before
                            </Text>
                            <Text style={styles.balText}>
                                Balance After
                            </Text>
                        </View>
                        <View
                            style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                marginVertical: 5
                            }}
                        >
                            <Text style={styles.balText}>
                                <MaterialCommunityIcons style={styles.icon} name="currency-ngn" color={'#004AAD'} size={16} />
                                {res.balance_before}
                            </Text>
                            <Text style={styles.balText}>
                                <MaterialCommunityIcons style={styles.icon} name="currency-ngn" color={'#004AAD'} size={16} />
                                {res.balance_before}
                            </Text>
                        </View>
                    </View>
                </View>
            </ViewShot>

            <View style={styles.buttonContainer}>
                <TouchableOpacity onPress={captureScreen} style={styles.btn}>
                    <EvilIcons name="share-google" size={24} color="white" />
                    <Text style={styles.btnTxt}>Share</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )
}

export default TransactionDetail

const SCREEN_WIDTH = Dimensions.get("screen").width;
const SCREEN_HEIGHT = Dimensions.get("screen").height;
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    viewShot: {
        width: SCREEN_WIDTH,
    },
    buttonContainer: {
        alignSelf: "stretch",
        justifyContent: "center",
        alignItems: "center",
        marginTop: 10,
    },
    btn: {
        padding: 8,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 8,
        backgroundColor: '#004AAD',
        color: 'white'
    },
    btnTxt: {
        fontSize: 20,
        fontWeight: "bold",
        color: 'white'
    },
    //   previewContainer
    previewContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 10,
        backgroundColor: "#fff",
    },
    previewImage: { width: 200, height: 200, backgroundColor: "#fff" },
    walletBalance: {
        flex: 0,
        flexDirection: 'column',
        height: 230,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 40,
        backgroundColor: 'rgba(0, 0, 0, 0.02)',
        marginTop: 75
    },
    transactionBody: {
        flex: 0,
        flexDirection: 'column',
        height: 230,
        width: '100%',
        alignItems: 'left',
        marginVertical: 40,
        backgroundColor: 'rgba(0, 0, 0, 0.02)',
        padding: 15,
    },
    bal: {
        flex: 0,
        flexDirection: 'row',
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    amountText: {
        fontSize: 34,
        lineHeight: 35,
        fontFamily: 'Ubuntu-Medium',
        color: '#004AAD'
    },
    balText: {
        fontSize: 20,
        lineHeight: 26,
        fontFamily: 'Ubuntu-Bold',
        color: '#004AAD',
        textTransform: 'uppercase'
    }
})