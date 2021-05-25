import { strings } from '../strings';
import { styles } from '../styles/styles';
import { TouchableOpacity, Text } from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/core';

export function PoppingOkButton() {
    const navigation = useNavigation()

    return (
        <TouchableOpacity
            onPress={() => { navigation.pop() }}
            style={styles.button}
        >
            <Text style={styles.buttonText}>{strings.ok}</Text>
        </TouchableOpacity>
    )
}