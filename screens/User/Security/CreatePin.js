import { SafeAreaView, StyleSheet, Text, View, TextInput, Pressable } from 'react-native'
import React, { useEffect, useState } from 'react';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import SubmitButton from '../../../constants/SubmitButton';
import query from '../../../constants/query';
import axios from 'axios';

const CreatePin = ({ navigation }) => {
    const [transactionPin, setTransactionPin] = useState('');
    const [seePin, setSeePin] = useState(true);
    const [pinError, setPinError] = useState('')
    const [password, setPassword] = useState('');
    const [seePwd, setSeePwd] = useState(true);
    const [pwdError, setPwdError] = useState('');
    const [loading, setLoading] = useState(false);
    const handleSubmit = async () => {
        setLoading(true);
        setPinError('')
        setPinError('')
        setPwdError(false);

        if (transactionPin.length === 0) {
            setPinError('')
            setPinError('transactionPin is required');
            setLoading(false);
            return
        }

        if (password.length === 0) {
            setPwdError(true);
            setPinError('Password is required');
            setLoading(false);
            return
        }

        let data = {
            transaction_pin: transactionPin,
            password: password
        }

        try {
            const response = await axios.post(`${query.baseUrl}auth/login`, data);
            alert('Here');
        } catch (error) {
            setPinError(error.response.data.message);
            console.log(error.response.data.message)
        } finally {
            setLoading(false);
        }
    }
    return (
        <SafeAreaView>
            <View>
                <Text
                    style={{
                        fontSize: '20px',
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
                    margin: 'auto',
                    borderWidth: 2,
                }}
            >

                {/* pin */}
                <View style={{ width: '90%', alignSelf: 'center', marginVertical: 15 }}>
                    <MaterialIcons name={'password'} size={20} style={styles.iconLeft} color="rgba(0,0,0,0.3)" />
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
                            (text) => setTransactionPin(text)
                        }
                        autoCorrect={false}
                        inputMode={'number'}
                        secureTextEntry={seePin}
                        placeholder={"Transaction Pin"}
                        autoCapitalize={'none'}
                    />
                    <Pressable
                        style={styles.iconRight}
                        onPress={() => {
                            if (seePin)
                                setSeePin(false)
                            else
                                setSeePin(true)
                        }}
                    >
                        <Ionicons name="eye" size={20} style={styles.iconRight} color="rgba(0,0,0,0.3)" />
                    </Pressable>
                    {pinError.length != 0 ? <MaterialIcons name="error" style={styles.iconRight} size={24} color="red" /> : null}
                </View>

                {/* password */}
                <View style={{ width: '90%', alignSelf: 'center', marginVertical: 15 }}>
                    <MaterialIcons name={'password'} size={20} style={styles.iconLeft} color="rgba(0,0,0,0.3)" />
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
                            (text) => setPassword(text)
                        }
                        autoCorrect={false}
                        inputMode={'number'}
                        secureTextEntry={seePin}
                        placeholder={"Transaction Pin"}
                        autoCapitalize={'none'}
                    />
                    <Pressable
                        style={styles.iconRight}
                        onPress={() => {
                            if (seePwd)
                                setSeePwd(false)
                            else
                                setSeePwd(true)
                        }}
                    >
                        <Ionicons name="eye" size={20} style={styles.iconRight} color="rgba(0,0,0,0.3)" />
                    </Pressable>
                    {pwdError.length != 0 ? <MaterialIcons name="error" style={styles.iconRight} size={24} color="red" /> : null}
                </View>

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