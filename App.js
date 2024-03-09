import { useEffect, useState } from 'react';
import { AntDesign, Ionicons, MaterialCommunityIcons, MaterialIcons, SimpleLineIcons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { loadAsync, useFonts } from 'expo-font';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { ActivityIndicator } from 'react-native';
import { Image } from 'expo-image';
import * as Updates from 'expo-updates';
import { Link, NavigationContainer, getFocusedRouteNameFromRoute, useRoute } from '@react-navigation/native';
import FirstScreen from './screens/Onboarding/FirstScreen';
import Welcome from './screens/Onboarding/Welcome';
import Login from './screens/Auth/SignIn/Login';
import Register from './screens/Auth/SignOut/Register';
import Dashboard from './screens/User/Dashboard/Dashboard';
import SplashScreen from './screens/Onboarding/SplashScreen';
import axios from 'axios';
import CreatePin from './screens/User/Security/CreatePin';
import Returning from './screens/Auth/SignIn/Returning';
import Verify from './screens/Auth/Verify/Verify';
import Services from './screens/User/Services/Services';
import Wallet from './screens/User/Wallet/Wallet';
import Profile from './screens/User/Profile/Profile';
import Settings from './screens/User/Security/Settings';
import Airtime from './screens/User/Services/Airtime/Airtime';
import Data from './screens/User/Services/Data/Data';
import query from './constants/query';
import Help from './screens/Help';
import ChangePassword from './screens/User/Security/ChangePassword';
import EditInfo from './screens/User/Profile/EditInfo';
import Fund from './screens/User/Wallet/Fund';
import TransactionDetail from './screens/User/Wallet/TransactionDetail';



const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();


async function registerForPushNotificationsAsync() {
    let token;

    if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
            name: 'default',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#FF231F7C',
        });
    }

    if (Device.isDevice) {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }
        if (finalStatus !== 'granted') {
            console.log('Failed to get push token for push notification!');
            return;
        }
        token = (await Notifications.getExpoPushTokenAsync()).data;
    } else {
        console.log('Must use physical device for Push Notifications');
    }

    return token;
}


const App = ({ navigation }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [initialName, setInitialName] = useState('');

    const [fontsLoaded, fontError] = useFonts({
        'Ubuntu-Regular': require('./assets/fonts/Ubuntu-Regular.ttf'),
        'Ubuntu-Medium': require('./assets/fonts/Ubuntu-Medium.ttf'),
        'Ubuntu-Bold': require('./assets/fonts/Ubuntu-Bold.ttf'),
        'Rubik-Regular': require('./assets/fonts/Rubik-Regular.ttf'),
        'Rubik-Medium': require('./assets/fonts/Rubik-Medium.ttf'),
        'Rubik-Bold': require('./assets/fonts/Rubik-Bold.ttf'),
    });

    // check user's default page
    async function checkFirstUserPage() {
        try {
            await AsyncStorage.getItem('isLoggedIn')
                .then(value => {
                    if (value != null) {
                        setInitialName(value);
                        setIsLoading(false);
                        AsyncStorage.getItem('RememberPassword')
                            .then(value => {
                                if (value != null) {
                                    setInitialName('Returning')
                                } else {
                                    setInitialName('Home');
                                }
                            })
                    } else {
                        setInitialName('Welcome');
                        setIsLoading(false);
                    }
                })
        } catch (error) {
            console.log(error);
        }
    }

    const isOnline = async () => {
        try {
            await AsyncStorage.getItem('existing')
                .then(value => {
                    if (value != null) {
                        checkFirstUserPage();
                    } else {
                        setInitialName('Welcome');
                        setIsLoading(false);
                    }
                })
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        isOnline();
        registerForPushNotificationsAsync();
    }, []);

    if (isLoading || !fontsLoaded) {
        return <SplashScreen />;
    }

    if (initialName === '') {
        return <SplashScreen />;
    }

    if (fontError) {
        return (<View>
            <Text>
                Invalid font
            </Text>
        </View>)
    }

    const config = {
        animation: 'spring',
        config: {
            stiffness: 1000,
            damping: 500,
            mass: 3,
            overshootClamping: true,
            restDisplacementThreshold: 0.01,
            restSpeedThreshold: 0.01,
        },
    };

    return (
        <NavigationContainer>
            <Stack.Navigator
                initialRouteName={initialName}
                screenOptions={{
                    transitionSpec: {
                        open: config,
                        close: config,
                    },
                }}
            >
                <Stack.Screen name="Home" options={{ headerShown: false }} component={LoggedInUserNavigation} />

                <Stack.Group
                    screenOptions={{
                        headerShown: true,
                        headerStyle: {
                            backgroundColor: '#004AAD',
                        },
                        headerBackTitleStyle: {
                            color: 'white',

                        },
                        headerShadowVisible: false,
                        headerLeft: () => {
                            return (
                                <Link
                                    to="/Home/Services"
                                >
                                    <MaterialCommunityIcons name="chevron-left-box-outline" size={30} style={{ margin: 8, padding: 2, textAlign: 'center', flex: 0, height: 30, alignItems: 'center', justifyContent: 'center', }} color="white" />
                                </Link>
                            )
                        },
                        headerTitleStyle: {
                            color: '#fff',
                        }
                    }}
                >
                    <Stack.Screen
                        name="Airtime"
                        options={{
                            title: 'Airtime Purchase'
                        }}
                        component={Airtime}
                    />
                    <Stack.Screen
                        name="Data"
                        options={{
                            title: 'Data Purchase'
                        }}
                        component={Data}
                    />
                </Stack.Group>

                <Stack.Group
                    screenOptions={{
                        headerShown: false,
                        headerStyle: {
                            backgroundColor: '#004AAD',
                        },
                        headerBackTitleStyle: {
                            color: 'white',

                        },
                        headerShadowVisible: false,
                        headerLeft: () => {
                            return (
                                <Pressable
                                    onPress={() => {
                                        navigation.goBack();
                                    }}
                                >
                                    <MaterialCommunityIcons name="chevron-left-box-outline" size={30} style={{ margin: 8, padding: 2, textAlign: 'center', flex: 0, height: 30, alignItems: 'center', justifyContent: 'center', }} color="white" />
                                </Pressable>
                            )
                        },
                        headerTitleStyle: {
                            color: '#fff',
                        }
                    }}
                >
                    <Stack.Screen
                        name="TransactionDetail"
                        options={{
                            title: 'Transaction Detail'
                        }}
                        component={TransactionDetail}
                    />
                </Stack.Group>

                <Stack.Group
                    screenOptions={{
                        headerShown: true,
                        headerStyle: {
                            backgroundColor: '#004AAD',
                        },
                        headerBackTitleStyle: {
                            color: 'white'
                        },
                        headerShadowVisible: false,
                        headerTitleStyle: {
                            color: '#fff'
                        },
                        headerLeft: () => {
                            return (
                                <Link
                                    to="/Home/Wallet"
                                >
                                    <MaterialCommunityIcons name="chevron-left-box-outline" size={25} style={{ margin: 8, padding: 2, textAlign: 'center', flex: 0, height: 30, alignItems: 'center', justifyContent: 'center', }} color="white" />
                                </Link>
                            )
                        },
                        headerTitleStyle: {
                            color: '#fff'
                        }
                    }}
                >
                    <Stack.Screen name="FundWallet" title={'Fund Wallet'} component={Fund} />
                </Stack.Group>

                <Stack.Group screenOptions={{ headerShown: false }}>
                    {/* initial page on initial app launch */}
                    <Stack.Screen
                        name='Onboarding'
                        options={{
                            title: 'Welcome to Bidsub'
                        }}
                        component={FirstScreen}
                    />

                    {/* page after initial page on initial launch  */}
                    <Stack.Screen
                        name='Welcome'
                        options={{
                            title: 'Welcome to Bidsub'
                        }}
                        component={Welcome}
                    />

                    {/* page for returning logged in user  */}
                    <Stack.Screen
                        name="Returning"
                        component={Returning}
                    />

                    {/* login page for users  */}
                    <Stack.Screen
                        name="SignIn"
                        component={Login}
                        n />

                    {/* register page for potential users  */}
                    <Stack.Screen name="SignUp" component={Register} />

                    {/* Email verification page for newly registered users */}
                    <Stack.Screen name="Verify" component={Verify} />

                </Stack.Group>
                <Stack.Group
                    screenOptions={{
                        presentation: 'modal',
                        headerStyle: {
                            backgroundColor: '#004aad',
                        },
                        headerTintColor: '#ffffff',
                        headerTitleStyle: {
                            fontSize: 25,
                            fontFamily: 'Rubik-Bold'
                        }

                    }}
                >
                    <Stack.Screen
                        options={{
                            title: 'Transaction Pin',
                        }}
                        name="CreatePin"
                        component={CreatePin}
                    />
                    <Stack.Screen
                        options={{
                            title: 'Change Account Password',
                        }}
                        name="ChangePassword"
                        component={ChangePassword}
                    />
                    <Stack.Screen
                        options={{
                            title: 'Settings',
                        }}
                        name="Settings"
                        component={Settings}
                    />
                    <Stack.Screen
                        options={{
                            title: 'Edit Personal Information',
                        }}
                        name="EditInfo"
                        component={EditInfo}
                    />
                    <Stack.Screen
                        options={{
                            title: 'Bidsub Help Desk',
                        }}
                        name="Help"
                        component={Help}
                    />
                </Stack.Group>
            </Stack.Navigator>
        </NavigationContainer>
    )
}

export default App;
// Logged in user screens 

const LoggedInUserNavigation = ({ navigation }) => {
    const route = useRoute();
    const routeName = getFocusedRouteNameFromRoute(route);
    const [username, setUsername] = useState('');
    const [dp, setDp] = useState('');
    const [tabText, setTabTex] = useState(false);
    const [loading, setLoading] = useState(true)
    const blurhash = '|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[';

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
                setUsername(response.data.data.username);
                setDp(response.data.data.display_picture);
                if (response.data.data.pinset === false) {
                    navigation.replace('CreatePin')
                }
                setLoading(false)
            }
        } catch (error) {
            console.log(error);
            AsyncStorage.removeItem('isLoggedIn')
            navigation.replace('SignIn');
        }
    }

    const isOnline = async () => {
        setLoading(true)
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
    }, []);

    if (loading) {
        return <SplashScreen />
    }

    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: true,
                tabBarActiveTintColor: '#004aad',
                tabBarShowLabel: false,
                tabBarInactiveTintColor: '#fff',
                tabBarActiveBackgroundColor: '#fff',
                tabBarStyle: {
                    height: 85,
                    backgroundColor: "#004aad",
                    marginBottom: 18,
                    width: '94%',
                    marginLeft: '3%',
                    borderRadius: 40,
                    overflow: 'hidden',
                    borderColor: '#004aad',
                    borderWidth: 2,
                },
                tabBarLabelStyle: {
                    fontSize: 13,
                    marginBottom: 10,
                    marginTop: 5,
                    fontFamily: 'Rubik-Medium',
                    textTransform: 'uppercase',
                    color: 'black'
                }
            }}
        >
            <Tab.Screen
                name='dashboard'
                component={Dashboard}
                options={{
                    headerShown: true,
                    title: "Dashboard",
                    tabBarIcon: ({ focused, color, size }) => (
                        <MaterialCommunityIcons name="view-dashboard-outline" color={color} size={focused ? 35 : 30} />
                    ),
                    tabBarLabel: 'Dashboard',
                    headerTitle: () => {
                        return (
                            <>
                                <Text style={styles.username}>
                                    {username.toUpperCase()}
                                </Text>
                            </>
                        )
                    },
                    headerLeft: () => {
                        return (
                            <>
                                <Pressable
                                    onPress={() => {
                                        navigation.navigate('Profile')
                                    }}
                                >
                                    <Image
                                        style={styles.image}
                                        source={dp}
                                        placeholder={blurhash}
                                        contentFit="cover"
                                        transition={1000}
                                    />
                                </Pressable>
                            </>
                        )
                    },
                    headerRight: () => {
                        return (
                            <>
                                <Pressable
                                    onPress={() => {
                                        navigation.navigate('Notifications')
                                    }}
                                >
                                    <Ionicons name="notifications-outline" size={28} color="white" style={{ marginRight: 20 }} />
                                </Pressable>
                            </>
                        )
                    },
                    headerStyle: {
                        backgroundColor: '#004aad',

                    },
                    headerTitleStyle: {
                        color: 'white',
                        fontFamily: 'Rubik-Bold'
                    },
                    headerTintColor: '#004aad',
                    headerShadowVisible: false
                }}
            />
            <Tab.Screen
                name='Services'
                component={Services}
                options={{
                    title: 'Services',
                    tabBarIcon: ({ focused, color, size }) => (
                        <MaterialIcons name="miscellaneous-services" color={color} size={focused ? 35 : 30} />
                    ),
                    tabBarLabel: 'Services',
                    headerTitle: () => {
                        return (
                            <Text
                                style={styles.headerText}
                            >
                                SERVICES
                            </Text>
                        )
                    },
                    headerStyle: {
                        backgroundColor: '#004AAD'
                    },
                    headerShadowVisible: false,

                }}
            />
            <Tab.Screen
                name='Wallet'
                component={Wallet}
                options={{
                    title: 'Wallet',
                    tabBarIcon: ({ focused, color, size }) => (
                        <SimpleLineIcons name="wallet" color={color} size={focused ? 35 : 30} />
                    ),
                    tabBarLabel: 'Wallet',
                    headerTitle: () => {
                        return (
                            <Text style={styles.headerText}>
                                MY WALLET
                            </Text>
                        )
                    },
                    headerStyle: {
                        backgroundColor: '#004AAD'
                    },
                    headerShadowVisible: false,
                }}
            />
            <Tab.Screen
                name='Profile'
                component={Profile}
                options={{
                    title: 'Profile',
                    tabBarIcon: ({ focused, color, size }) => (
                        <AntDesign name="user" color={color} size={focused ? 35 : 30} />
                    ),
                    tabBarLabel: 'Profile',
                    headerTitle: () => {
                        return (
                            <Text
                                style={styles.headerText}
                            >
                                MY PROFILE
                            </Text>
                        )
                    },
                    headerStyle: {
                        backgroundColor: '#004AAD',
                    },
                    headerShadowVisible: false,
                    // headerShown: false
                }}
            />
        </Tab.Navigator>
    );
}



const styles = StyleSheet.create({
    headerText: {
        fontSize: 34,
        fontFamily: 'Ubuntu-Regular',
        fontWeight: 'bold',
        marginTop: 10,
        lineHeight: 35,
        color: '#ffffff',
        textAlign: 'center'
    },
    image: {
        width: 40,
        height: 40,
        borderWidth: 2,
        margin: 20,
        marginRight: 0,
        borderRadius: 7,
        backgroundColor: 'white'
    },
    username: {
        fontSize: 27,
        fontFamily: 'Ubuntu-Medium',
        textTransform: 'capitalize',
        color: 'white'
    }
})