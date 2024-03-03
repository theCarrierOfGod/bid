import query from '../../../constants/query';
import React, { useState } from 'react'
import { ScrollView, StyleSheet, Text, TextInput, Pressable, View, KeyboardAvoidingView } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SubmitButton from '../../../constants/SubmitButton';

const Login = ({ navigation }) => {
    const [password, setPassword] = useState('');
    const [usernameError, setUsernameError] = useState(false)
    const [passwordError, setPasswordError] = useState(false)
    const [username, setUsername] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setErrors] = useState('');
    const [seePin, setSeePin] = useState(false);

    const handleLogin = async () => {
        setLoading(true);
        setUsernameError(false);
        setErrors('')
        setPasswordError(false);

        if (username.length === 0) {
            setUsernameError(true);
            setErrors('Username is required');
            setLoading(false);
            return
        }

        if (password.length === 0) {
            setPasswordError(true);
            setErrors('Password is required');
            setLoading(false);
            return
        }

        let data = {
            username: username,
            password: password
        }

        try {
            const response = await axios.post(`${query.baseUrl}auth/login`, data);
            if (response.data.success) {
                await AsyncStorage.setItem('UserName', username);
                AsyncStorage.setItem('isLoggedIn', response.data.access_token);
                AsyncStorage.setItem('existing', username);
                AsyncStorage.setItem('userDetails', JSON.stringify(response.data.data));
                navigation.replace('Home')
            } else {
                setErrors(response.data.error);
                if(response.data.error === "verify your email to continue") {
                    navigation.navigate('Verify')
                }
            }
        } catch (error) {
            setErrors(error.response.data.message);
            console.log(error.response.data.message)
        } finally {
            setLoading(false);
        }
    }

    return (
        <ScrollView
            style={{
                flex: 1,
            }}
        >
            <KeyboardAvoidingView
                style={{
                    marginTop: '50%',
                    backgroundColor: '#ffffff',
                    flex: 1,
                    justifyContent: 'center',
                    borderTopEndRadius: 30,
                    borderTopStartRadius: 30,
                }}
            >
                <View
                    style={{
                        marginBottom: 80,
                        marginTop: 20,
                        // backgroundColor: '#ffffff',
                        // flex: 1,
                        // justifyContent: 'center',
                        // borderTopEndRadius: 20,
                        // borderTopStartRadius: 20,
                    }}
                >

                    <Text
                        style={{
                            fontSize: 32,
                            fontWeight: 'bold',
                            padding: 20
                        }}
                    >
                        Sign In
                    </Text>
                    <Text
                        style={{
                            color: 'rgba(0,0,0,0.3)',
                            fontSize: 18,
                            paddingHorizontal: 20
                        }}
                    >
                        Log in to your account to continue
                    </Text>

                    {error.length !== 0 ? (
                        <Text
                            style={{
                                color: 'red',
                                fontSize: 12,
                                paddingHorizontal: 20,
                                marginTop: 10
                            }}
                        >
                            {error}
                        </Text>
                    ) : null}

                    <View style={{ width: '90%', alignSelf: 'center', marginVertical: 15, flex: 0, height: 50, display: '' }}>
                        <Ionicons name={'person-outline'} size={20} style={styles.iconLeft} color="rgba(0,0,0,0.3)" />
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
                                color: "rgba(0,0,0,0.3)",
                            }}
                            value={username}
                            onChangeText={
                                (text) => setUsername(text)
                            }
                            inputMode='text'
                            blurOnSubmit={true}
                            secureTextEntry={false}
                            placeholder='Username'
                            autoCapitalize="none"
                        />
                        {usernameError ? <MaterialIcons name="error" style={styles.iconRight} size={24} color="red" /> : null}
                    </View>

                    <View style={{ width: '90%', alignSelf: 'center', marginVertical: 15, flex: 0, height: 50 }}>
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
                            value={password}
                            onChangeText={
                                (text) => setPassword(text)
                            }
                            autoCorrect={false}
                            secureTextEntry={!seePin}
                            placeholder={'Password'}
                            autoCapitalize="none"
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
                            <Ionicons name={seePin ? 'eye-off' : 'eye'} size={20} color="rgba(0,0,0,0.3)" />
                        </Pressable>
                        {passwordError ? <MaterialIcons name="error" style={styles.iconRight} size={24} color="red" /> : null}
                    </View>

                    <Pressable
                        onPress={() => navigation.navigate('ForgetPassword')}
                    >
                        <Text
                            style={{
                                textAlign: 'right',
                                marginRight: 25,
                                color: '#004aad',
                                fontWeight: 800
                            }}
                        >
                            Forget Password
                        </Text>
                    </Pressable>

                    <SubmitButton title={'Continue'} handleSubmit={handleLogin} disabled={loading} loading={loading} />
                    <Text
                        style={{
                            color: 'rgba(0,0,0,0.3)',
                            fontSize: 18,
                            paddingHorizontal: 20,
                            textAlign: 'center',
                            marginTop: 20
                        }}
                    >
                        Don't have an account?
                        <Pressable
                            onPress={() => navigation.navigate('SignUp')}
                        >
                            <Text style={{ color: '#004aad', fontWeight: 'bold' }}> Sign up Here</Text>
                        </Pressable>
                    </Text>
                </View>
            </KeyboardAvoidingView>
        </ScrollView>
    )
}

export default Login

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