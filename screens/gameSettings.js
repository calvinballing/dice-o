import { AppContext } from '../context';
import { Switch, Text, ScrollView, StatusBar, View } from 'react-native';
import { colors, styles } from '../styles/styles';
import { strings } from '../strings'
import React, { Component } from 'react';
import { Picker } from '@react-native-picker/picker';

import { PoppingOkButton } from '../components/poppingOkButton';
import {
    MIN_WINNING_DISTANCE,
    MAX_WINNING_DISTANCE,
} from '../globals'

const controlRadii = Array.from({ length: 10 }, (item, index) => 5 * (index + 1));
export class GameSettings extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        let context = this.context

        return (
            <View style={styles.background}>
                <StatusBar hidden={false} barStyle={'dark-content'} />
                <ScrollView style={{marginVertical:10}}>
                    <View
                        style={{
                            flexDirection: 'row'
                        }}
                    >

                        <Text style={styles.text}>Vibrate when finding a control</Text>

                        <Switch
                            trackColor={{ false: '#767577', true: '#767577' }}
                            thumbColor={context.vibrate ? colors.orange : '#f4f3f4'}
                            style={{
                                transform: [{ scaleX: 1 }, { scaleY: 1 }],
                            }} //TODO may be able to make this element more accessible using this, or perhaps a custom switch component
                            ios_backgroundColor="#3e3e3e"
                            onValueChange={context.toggleVibrate}
                            value={context.vibrate}
                        />
                    </View>
                    <Text style={styles.text}>Control Radius (a larger value makes controls easier to find):</Text>
                    <Picker
                        style={styles.picker}
                        prompt="Control Radius:"
                        selectedValue={context.winningDistanceInMeters}
                        onValueChange={(itemValue) =>
                            context.updateWinningDistanceInMeters(itemValue)
                        }>
                        {controlRadii.map((controlRadius) => {
                            return (
                                <Picker.Item
                                    key={"controlRadius" + controlRadius}
                                    label={controlRadius + " meters"}
                                    value={controlRadius} />)
                        })}
                    </Picker>
                </ScrollView>
                <PoppingOkButton />
            </View>
        )
    }
}

GameSettings.contextType = AppContext;