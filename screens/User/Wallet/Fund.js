import React, { useEffect, useRef, useState } from 'react';
import { Paystack, paystackProps } from 'react-native-paystack-webview';
import { View, Text, ScrollView, StyleSheet, TextInput, Alert } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import * as Notifications from 'expo-notifications';
import SuccessBox from '../Profile/components/SuccessBox';
import SubmitButton from '../../../constants/SubmitButton';
import query from '../../../constants/query';
import SplashTwo from '../../Onboarding/SplashTwo';

const Fund = ({ navigation }) => {
    const paystackWebViewRef = useRef(paystackProps.PayStackRef);

    const isFocused = useIsFocused();
    const [username, setUsername] = useState('');
    const [token, setToken] = useState('')
    const [email, setEmail] = useState('');
    const [pKEy, setPKey] = useState('')
    const [amount, setAmount] = useState(0);
    const [amountError, setAmountError] = useState(null)
    const [isLoading, setIsLoading] = useState(false);
    const [spinning, setSpinning] = useState(false);
    const [error, setError] = useState('');
    const [toPay, setToPay] = useState(0)

    const [success, setSuccess] = useState(false);
    const [message, setMessage] = useState('')

    const fetchNow = async (token) => {
        try {
            const response = await axios.get(`${query.baseUrl}user`, {
                headers: {
                    Authorization: 'Bearer ' + token
                }
            });
            if (response.data) {
                setUsername(response.data.data.username);
                setEmail(response.data.data.email)
            } else {
                setError(response.data.error)
            }
        } catch (error) {
            setError(error.message);
            console.log(error)
        } finally {
            setSpinning(false)
        }
    }

    const pubNow = async (token) => {
        try {
            const res = await axios.get(`${query.baseUrl}pay_key`, {
                headers: {
                    Authorization: 'Bearer ' + token
                }
            });
            if (res) {
                setPKey(res.data.token);
            }
        } catch (error) {
            console.log(error)
            setError(error.message)
        } finally {
            setSpinning(false)
        }
    }

    const isOnline = async () => {
        setSpinning(true);
        setError('')
        try {
            await AsyncStorage.getItem('isLoggedIn')
                .then(value => {
                    if (value != null) {
                        setToken(value)
                        fetchNow(value);
                        pubNow(value);
                    } else {
                        navigation.replace('SignIn')
                    }
                })
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        if (isFocused) {
            isOnline();
        }
    }, [isFocused]);


    async function scheduleNotification(amount) {
        await Notifications.scheduleNotificationAsync({
            content: {
                title: "Wallet Funding",
                body: "Your account has been funded with #" + amount,
                data: { data: 'Add here' },
            },
            trigger: { seconds: 1 },
        });
    }

    async function scheduleNotification2(amount) {
        await Notifications.scheduleNotificationAsync({
            content: {
                title: "Wallet Funding",
                body: "Your account was not funded with #" + amount,
                data: { data: 'Add here' },
            },
            trigger: { seconds: 1 },
        });
    }

    const onSuccess = (reference) => {
        const data = {
            amount: toPay,
            reference: reference.reference,
            status: reference.status,
            method: 'paystack'
        }
        purchaseAirtime(data);
        scheduleNotification(toPay);
    };

    const onClose = () => {
        setIsLoading(false);
        const data = {
            amount: toPay,
            status: "failed",
            method: 'paystack'
        }
        purchaseAirtime(data);
        scheduleNotification2(toPay);
    }

    const purchaseAirtime = async (data) => {
        setIsLoading(true);
        setAmountError(null);
        setMessage('')

        try {
            const response = await axios.post(`${query.baseUrl}wallet`, data, {
                headers: {
                    Authorization: 'Bearer ' + token
                }
            });

            if (response.data) {
                
                setAmount(0);
                setToPay(0);
                setMessage(response.data.message)
                setTimeout(() => {
                    setSuccess(false);
                    navigation.goBack();
                }, 1000);
            } else {
                console.log('error')
                setAmountError(response.data.error);
            }
        } catch (error) {
            console.log(error);
            console.log("This error")
        } finally {
            setIsLoading(false);
        }
    }

    if (spinning) {
        return (
            <SplashTwo />
        )
    }

    const calcuLate = (text) => {
        setAmountError(null);
        let charge = text * 0.015;
        let tots = Number(text) - Number(charge);
        setToPay(tots)
    }
    return (
        <ScrollView>
            <SuccessBox message={message} />
            <View style={{ flex: 1 }}>
                <Paystack
                    paystackKey={pKEy}
                    billingEmail={email}
                    channels={['bank_transfer', 'card', 'ussd']}
                    amount={amount}
                    onCancel={(e) => {
                        onClose();
                    }}
                    onSuccess={(res) => {
                        console.log(res);
                        onSuccess(res.data.transactionRef);
                    }}
                    ref={paystackWebViewRef}
                />
            </View>
            <View>
                <Text style={styles.text}>
                    Amount
                </Text>

                <View style={{ width: '90%', alignSelf: 'center', marginTop: 15 }}>
                    <MaterialCommunityIcons name="currency-ngn" size={21} style={styles.iconLeft} color="rgba(0,0,0,0.3)" />
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
                        value={amount}
                        onChangeText={
                            (text) => {
                                setAmount(text);
                                calcuLate(text);
                            }
                        }
                        autoCorrect={false}
                        inputMode={'numeric'}
                        autoComplete='off'
                        placeholder={'Amount'}
                    />
                    {amountError !== null ? <MaterialIcons name="error" style={styles.iconRight} size={24} color="red" /> : null}
                </View>

                {amountError !== null ? (
                    <>
                        <Text style={{ color: 'red', fontSize: 12, marginTop: 10, marginLeft: 25 }} >{amountError}</Text>
                    </>
                ) : null}

                {(amount > 0) ? (
                    <>
                        <Text
                            style={{
                                color: 'rgba(0,0,0,0.7)',
                                margin: 25,
                                fontSize: 16,
                            }}
                        >
                            Less charges:
                            <MaterialCommunityIcons name="currency-ngn" size={16} color="rgba(0,0,0,0.7)" />
                            {toPay}
                        </Text>
                    </>
                ) : null}
            </View>

            <SubmitButton
                title={'Proceed'}
                handleSubmit={
                    () => {
                        if (amount < 50) {
                            setAmountError('Minimum funding amount is #200');
                            return;
                        }
                        setIsLoading(true);

                        paystackWebViewRef.current.startTransaction();
                    }
                }
                loading={isLoading}
                disabled={isLoading}
            />

            <Text
                style={{
                    color: 'grey',
                    marginHorizontal: 25,
                    fontSize: 18,
                    marginTop: 10,
                }}
            >
                1.5% charge applies.
            </Text>
        </ScrollView>
    );
}

export default Fund


const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 15
    },
    text: {
        fontSize: 20,
        fontFamily: 'Rubik-Bold',
        fontWeight: 'normal',
        marginBottom: 2,
        marginHorizontal: 10,
        marginTop: 15,
        lineHeight: 32,
        color: '#000000',
    },
    iconLeft: {
        position: 'absolute',
        left: 8,
        top: 12
    },
    iconRight: {
        position: 'absolute',
        right: 12,
        top: 7,
        padding: 5
    }
})