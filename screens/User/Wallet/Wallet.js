import { Pressable, RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { MaterialCommunityIcons } from '@expo/vector-icons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from '@react-navigation/native';
import query from '../../../constants/query';
import History from './components/History';
import SplashTwo from '../../Onboarding/SplashTwo';

const Wallet = ({ navigation }) => {
    const isFocused = useIsFocused();
    const [username, setUsername] = useState('');
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState([]);
    const [balance, setBalance] = useState(0)
    const [spinning, setSpinning] = useState(true);

    const [refreshing, setRefreshing] = useState(false);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        setTimeout(() => {
            setRefreshing(false);
        }, 2000);
    }, []);

    const fetchNow = async (user) => {
        try {
            const response = await axios.get(`${query.baseUrl}user`, {
                headers: {
                    'Authorization': 'Bearer ' + user
                }
            });
            if (response.data) {
                setBalance(response.data.data.balance);
            }
        } catch (error) {
            console.log(error)
            navigation.navigate('Dashboard')
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
        if (isFocused) {
            isOnline();
        }
    }, [isFocused]);

    useEffect(() => {
        if (refreshing) {
            isOnline();
        }
    }, [refreshing]);

    if(refreshing || spinning) {
        return <SplashTwo />
    }
    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={styles.scrollView}
            refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
        >
            <View>
                <Text
                    style={styles.text}
                >
                    Your central hub for managing your funds, and tracking your wallet history.
                </Text>
            </View>
            <View
                style={styles.walletBalance}
            >
                <MaterialCommunityIcons style={styles.icon} name="currency-ngn" color={'black'} size={39} />
                <Text style={styles.walletText}>
                    {balance}
                </Text>
            </View>
            <View style={styles.walletBalance}>
                <Pressable
                    onPress={() => {
                        navigation.navigate('FundWallet');
                    }}
                    style={styles.fundButton}
                >
                    <Text style={styles.fundButtonText}>
                        Fund Wallet
                    </Text>
                </Pressable>
            </View>
            <View>
                <History refreshing={refreshing} navigation={navigation} />
            </View>
        </ScrollView>
    )
}

export default Wallet

const styles = StyleSheet.create({
    container: {
        flex: 0,
        height: "100%",
        backgroundColor: '#ffffff'
    },
    text: {
        fontSize: 19,
        fontWeight: 'normal',
        marginBottom: 15,
        marginHorizontal: 18,
        lineHeight: 32,
        color: '#999999',
        marginTop: 35
    },
    walletBalance: {
        flex: 0,
        flexDirection: 'row',
        height: 75,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 15
    },
    walletText: {
        fontSize: 42,
        lineHeight: 43,
        fontFamily: 'Ubuntu-Bold',
    },
    fundButton: {
        width: 250,
        height: 45,
        borderRadius: 10,
        borderWidth: 2,
        backgroundColor: '#004aad',
        borderColor: '#004aad',
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 40,
    },
    fundButtonText: {
        fontSize: 20,
        lineHeight: 43,
        fontFamily: 'Rubik-Bold',
        color: 'white'
    }
})