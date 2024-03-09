import { ActivityIndicator, Image, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import TableStructure from './TableStructure';
import { useIsFocused } from '@react-navigation/native';
import query from '../../../../constants/query';

const History = ({ navigation, refreshing }) => {
    const isFocused = useIsFocused();
    const [data, setData] = useState([]);
    const [spinning, setSpinning] = useState(true);
    const [error, setError] = useState('');
    const [token, setToken] = useState('');

    const fetchNow = async (user) => {
        try {
            const response = await axios.get(`${query.baseUrl}wallet`, {
                headers: {
                    Authorization: 'Bearer ' + user
                }
            });
            if (response.data) {
                setData(response.data.data)
            } else {
                setError(response.data.error)
            }
        } catch (error) {
            setError(error.message);
            console.log(error);
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
                        fetchNow(value);
                        setToken(value);
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
    }, [isFocused])

    useEffect(() => {
        if (refreshing) {
            isOnline();
        }
    }, [refreshing]);

    let screen = null;

    if (spinning) {
        screen = <ActivityIndicator
            animation='fade'
            size="large"
            color="#0882C5"
            style={{ marginTop: 65 }}
        />
    } else if (data.length === 0) {
        screen = <View style={{ alignItems: 'center', justifyContent: 'center', height: 200, width: '100' }}>
            <Image source={require('../../../../assets/images/nodata.png')} style={{ width: 150, height: 150, marginTop: 50 }} />
        </View>
    } else {
        screen = <View style={styles.sectionBody}>
            {data.map((item, index) => (
                <TableStructure data={item} key={index} navigation={navigation} token={token} />
            ))}
        </View>
    }
    if (error.length > 0) {
        screen = <View style={{ alignItems: 'center', justifyContent: 'center', height: 200, width: '100' }}>
            <Image source={require('../../../../assets/images/error.png')} style={{ width: 150, height: 150, marginTop: 50 }} />
        </View>
    }

    return (
        <View>
            <View
                style={styles.billSection}
            >
                <View
                    style={styles.sectionHeader}
                >
                    <Text style={styles.rightHeadText}> History </Text>
                </View>
                {screen}
            </View>
        </View>
    )
}

export default History

const styles = StyleSheet.create({
    billSection: {
        marginVertical: 30,
        marginHorizontal: 10,
        flex: 1,
    },
    sectionBody: {
        flex: 0,
        justifyContent: 'center',
        marginVertical: 20,
        width: '100%',
        color: 'black',
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'baseline',
        flexWrap: 'wrap'
    },
    link: {
        color: 'grey',
        fontFamily: 'monospace',
        fontSize: 15,
        textAlign: 'center'
    },
    rightHeadText: {
        fontSize: 20,
        fontFamily: 'Rubik-Bold'
    },
})