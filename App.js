import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { loadAsync, useFonts } from 'expo-font';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';


const Stack = createNativeStackNavigator();

const App = () => {
  const [fontsLoaded, fontError] = useFonts({
    'Ubuntu-Regular': require('./assets/fonts/Ubuntu-Regular.ttf'),
    'Ubuntu-Medium': require('./assets/fonts/Ubuntu-Medium.ttf'),
    'Ubuntu-Bold': require('./assets/fonts/Ubuntu-Bold.ttf'),
    'Rubik-Regular': require('./assets/fonts/Rubik-Regular.ttf'),
    'Rubik-Medium': require('./assets/fonts/Rubik-Medium.ttf'),
    'Rubik-Bold': require('./assets/fonts/Rubik-Bold.ttf'),
  });

  if (!fontsLoaded) {
    return <Text>Welcome</Text>;
}

  return (
    <>
      <Text>
        This should work
      </Text>
    </>
  )
}


const isOnline = async () => {
  try {
    await AsyncStorage.getItem('existing')
      .then(value => {
        if (value != null) {
          alert(value)
        } else {
          alert('e no gree work')
        }
      })
  } catch (error) {
    console.log(error);
  }
}

// useEffect(() => {
//   isOnline();
// }, [])

export default App;