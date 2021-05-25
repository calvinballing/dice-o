import { AppContext } from '../context';
import {  Switch, Text, ScrollView, StatusBar, View } from 'react-native';
import { colors, styles } from '../styles/styles';
import { strings } from '../strings'
import React, { Component } from 'react';
import Slider from '@react-native-community/slider';
import { PoppingOkButton } from '../components/poppingOkButton';
import {
    MIN_WINNING_DISTANCE,
    MAX_WINNING_DISTANCE,
} from '../globals'

export class GameSettings extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        let context = this.context

        return (
            <View style={styles.background}>
                <StatusBar hidden={false} barStyle={'dark-content'} />
                <ScrollView>
                    <Text>Vibrate when finding a control</Text>
                    <Switch
                        trackColor={{ false: '#767577', true: '#767577' }}
                        thumbColor={context.vibrate ? colors.orange : '#f4f3f4'}
                        ios_backgroundColor="#3e3e3e"
                        onValueChange={context.toggleVibrate}
                        value={context.vibrate}
                    />
                    <Text style={styles.text}>You must be within {context.winningDistanceInMeters} meters to find the control</Text>
                    <Slider
                                maximumTrackTintColor="#333"
                                maximumValue={MAX_WINNING_DISTANCE}
                                minimumTrackTintColor="#ef6c0c"
                                minimumValue={MIN_WINNING_DISTANCE}
                                onSlidingComplete={(winningDistanceInMeters) => { context.updateWinningDistanceInMeters(winningDistanceInMeters, 
                                    //this.compareDistance()
                                    //TODO this callback made sense while the slider was on the game page.  Would need to refactor now that it is on settins
                                    ); }}
                                step={1}
                                style={{ width: 300, height: 40 }}
                                value={context.winningDistanceInMeters}
                            />
                </ScrollView>
                <PoppingOkButton />
            </View>
        )
    }
}

GameSettings.contextType = AppContext;