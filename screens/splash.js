import { AppContext } from '../context';

import React, {useEffect, useContext} from 'react';
import { Text, View, TouchableOpacity, StatusBar} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ImageBackground } from 'react-native';
import { styles } from '../styles/styles';
import { strings } from '../strings';

export const Splash = ({ navigation, route }) => {

    const context = useContext(AppContext)

    useEffect(() => {
        context.loadDataIntoState();
        return () => {
            context.storeData();
        }
    }, []);

    return (<View >
        <StatusBar hidden={true}/>  
        <ImageBackground source={require('../assets/splash.png')}
            style={{
                width: '100%',
                height: '100%',
            }}
        >
            <SafeAreaView style={styles.splashContainer}>
                <TouchableOpacity
                    onPress={() => {
                        navigation.push('About')
                        //navigation.push('ControlLogged', { controlIndex: 3})
                        //navigation.push('Results')
                    }}
                    style={styles.button}
                >
                    <Text style={styles.buttonText}>{strings.continue}</Text>
                </TouchableOpacity>
            </SafeAreaView>
        </ImageBackground>
    </View>)
}

