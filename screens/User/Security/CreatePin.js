import { SafeAreaView, StyleSheet, Text, View, TextInput, Pressable } from 'react-native'
import React, { useEffect, useState } from 'react';
import { Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import SubmitButton from '../../../constants/SubmitButton';
import query from '../../../constants/query';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SplashTwo from '../../Onboarding/SplashTwo';

const CreatePin = ({ navigation }) => {
    const [transactionPin, setTransactionPin] = useState('');
    const [seePin, setSeePin] = useState(true);
    const [pinError, setPinError] = useState('')
    const [password, setPassword] = useState('');
    const [seePwd, setSeePwd] = useState(true);
    const [pwdError, setPwdError] = useState('');
    const [loading, setLoading] = useState(false);
    const [token, setToken] = useState('');
    const [success, setSuccess] = useState('');

    const [ready, setReady] = useState(false);
    const getToken = async () => {
        try {
            await AsyncStorage.getItem('isLoggedIn')
                .then(value => {
                    if (value != null) {
                        setReady(true)
                        setToken(value)
                    } else {
                        navigation.replace('SignIn')
                    }
                })
        } catch (error) {
            navigation.replace('SignIn')
        }
    }

    useEffect(() => {
        getToken();

        return () => {
            true
        }
    }, []);

    if (!ready) {
        return <SplashTwo />
    }


    const handleSubmit = async () => {
        setLoading(true);
        setPinError('');
        setPwdError(false);
        setSuccess('')

        if (transactionPin.length === 0) {
            setPinError('transactionPin is required');
            setLoading(false);
            return
        }

        if (transactionPin.length < 4) {
            setPinError('Transaction pin must be at 4 characters');
            setLoading(false);
            return
        }

        if (password.length === 0) {
            setPwdError('Password is required');
            setLoading(false);
            return
        }

        if (password.length < 8) {
            setPwdError('Password must be at least 8 characters');
            setLoading(false);
            return
        }

        let data = {
            transaction_pin: transactionPin,
            password: password
        }

        try {
            setPinError('');
            setPwdError('');
            const response = await axios.patch(`${query.baseUrl}transaction_pin`, data, {
                headers: {
                    'Authorization': 'Bearer ' + token
                }
            });
            if (response.data.success) {
                setSuccess(response.data.message),
                    setTransactionPin('');
                setPassword('');
                setTimeout(() => {
                    navigation.navigate('Home');
                }, 1500);
            }
        } catch (error) {
            setPinError(error.response.data.message);
        } finally {
            setLoading(false);
        }
    }
    return (
        <SafeAreaView
            style={{
                backgroundColor: '#ffffff'
            }}
        >
            <View>
                <Text
                    style={{
                        fontSize: 20,
                        textAlign: 'center',
                        lineHeight: 40,
                        marginVertical: 20,
                        fontFamily: 'Rubik-Medium'
                    }}
                >
                    Set Transaction Pin
                </Text>
            </View>
            <View
                style={{
                    width: '100%',
                    marginTop: 75,
                    justifyContent: 'center',
                    flex: 0,
                }}
            >

                <Text
                    style={{
                        textAlign: 'center',
                        color: 'green',
                        fontFamily: 'Ubuntu-Bold',
                        fontSize: 22,
                        textTransform: 'uppercase',
                        marginBottom: 20
                    }}
                >
                    {success}
                </Text>

                {/* pin */}
                <View style={{ width: '90%', alignSelf: 'center', marginVertical: 15 }}>
                    <Ionicons name={'key-outline'} size={20} style={styles.iconLeft} color="rgba(0,0,0,0.3)" />
                    <TextInput
                        style={{
                            borderWidth: 0,
                            height: 48,
                            backgroundColor: 'rgba(0,0,0, 0.03)',
                            padding: 5,
                            paddingLeft: 35,
                            borderRadius: 8,
                            fontWeight: '700',
                            fontSize: 16,
                            color: "rgba(0,0,0,0.3)"
                        }}
                        value={transactionPin}
                        onChangeText={
                            (text) => {
                                setTransactionPin(text);
                                setPinError('');
                            }
                        }
                        autoCorrect={false}
                        inputMode={'numeric'}
                        secureTextEntry={seePin}
                        placeholder={"Transaction Pin"}
                        autoCapitalize={'none'}
                        autoComplete={'off'}
                        maxLength={4}
                    />

                    {pinError.length != 0 ? <MaterialIcons name="error" style={styles.iconRight} size={24} color="red" /> : (
                        <Pressable
                            style={styles.iconRight}
                            onPress={() => {
                                if (seePin)
                                    setSeePin(false)
                                else
                                    setSeePin(true)
                            }}
                        >
                            <Ionicons name="eye" size={20} color="rgba(0,0,0,0.3)" />
                        </Pressable>
                    )}
                </View>
                <Text
                    style={{
                        textAlign: 'center',
                        color: 'red'
                    }}
                >
                    {pinError}
                </Text>

                {/* password */}
                <View style={{ width: '90%', alignSelf: 'center', marginVertical: 15 }}>
                <MaterialCommunityIcons name="form-textbox-password" size={20} style={styles.iconLeft} color="rgba(0,0,0,0.3)" />
                    <TextInput
                        style={{
                            borderWidth: 0,
                            height: 48,
                            backgroundColor: 'rgba(0,0,0, 0.03)',
                            padding: 5,
                            paddingLeft: 35,
                            borderRadius: 8,
                            fontWeight: '700',
                            fontSize: 16,
                            color: "rgba(0,0,0,0.3)"
                        }}
                        value={password}
                        onChangeText={
                            (text) => {
                                setPassword(text)
                                setPwdError('');
                            }
                        }
                        autoCorrect={false}
                        // inputMode={}
                        secureTextEntry={seePwd}
                        placeholder={"Password"}
                        autoCapitalize={'none'}
                        textContentType='password'
                        autoComplete='off'
                    />

                    {pwdError.length != 0 ? <MaterialIcons name="error" style={styles.iconRight} size={24} color="red" /> : (
                        <Pressable
                            style={styles.iconRight}
                            onPress={() => {
                                if (seePwd)
                                    setSeePwd(false)
                                else
                                    setSeePwd(true)
                            }}
                        >
                            <Ionicons name="eye" size={20} color="rgba(0,0,0,0.3)" />
                        </Pressable>
                    )}
                </View>
                <Text
                    style={{
                        textAlign: 'center',
                        color: 'red'
                    }}
                >
                    {pwdError}
                </Text>

                <SubmitButton title={'Submit'} handleSubmit={handleSubmit} disabled={loading} loading={loading} />
            </View>
        </SafeAreaView >
    )
}

export default CreatePin

const styles = StyleSheet.create({
    iconLeft: {
        position: 'absolute',
        left: 8,
        top: 12
    },
    iconRight: {
        position: 'absolute',
        right: 8,
        top: 12
    }
})