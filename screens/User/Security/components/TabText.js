import { StyleSheet, Switch, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from '@react-navigation/native';

const TabText = () => {
    const isFocused = useIsFocused();
    const [isLoading, setIsLoading] = useState(true);
    const [isEnabled, setIsEnabled] = useState(true);
    const toggleSwitch = () => {
        if (isEnabled) {
            setIsEnabled(false);
            AsyncStorage.setItem('tabText', 'false');
        } else {
            setIsEnabled(true);
            AsyncStorage.setItem('tabText', 'true');
        }
    };

    const getUsername = async () => {
        try {
            await AsyncStorage.getItem('tabText')
                .then(value => {
                    if (value != null) {
                        setIsEnabled(value)
                        console.log(value)
                    } else {
                        setIsEnabled(true)
                    }
                    setIsLoading(false)
                })
        } catch (error) {
            console.error();
        }
    }

    useEffect(() => {
        getUsername();
        
    }, [isFocused])
    return (
        <View
            style={styles.inline}
        >
            <Text>
                Show tab text
            </Text>
            <Switch
                trackColor={{ false: '#767577', true: '#81b0ff' }}
                thumbColor={isEnabled ? '#004aad' : '#f4f3f4'}
                ios_backgroundColor="#3e3e3e"
                onValueChange={toggleSwitch}
                value={isEnabled}
            />
        </View>
    )
}

export default TabText


const styles = StyleSheet.create({
    inline: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    }
})