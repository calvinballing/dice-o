import { AppContext } from '../context';
import { colors, styles } from '../styles/styles';
import { ScrollView, Switch, Text, TouchableOpacity, View, } from 'react-native';
import React from 'react';
import Slider from '@react-native-community/slider';
import { Picker } from '@react-native-picker/picker';

const pollingIntervals = Array.from({ length: 10 }, (item, index) => 500 * (index + 1));
const distanceIntervalsInMeters = Array.from({ length: 10 }, (item, index) => .5 * (index + 1));
const controlRadii = Array.from({ length: 10 }, (item, index) => 5 * (index + 1));


export const SettingsAdvanced = ({ navigation, route }) => {
  return (<AppContext.Consumer>
    {context => (
      <View style={styles.background}>
        <ScrollView >

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

          <Text style={styles.text}>Check location every (a higher amount saves battery):</Text>
          <Picker
            style={styles.picker}
            prompt="Polling Inteval:"
            selectedValue={context.pollingIntervalInMilliseconds}
            onValueChange={(itemValue) =>
              context.updatePollingIntervalInMilliseconds(itemValue)
            }>
            {pollingIntervals.map((pollingInterval) => {

              let label = pollingInterval == 1000 ? " second" : " seconds";

              return (
                <Picker.Item
                  key={"pollingInterval" + pollingInterval}
                  label={(pollingInterval/1000).toFixed(1)+ label}
                  value={pollingInterval} />)
            })}
          </Picker>

          <Text style={styles.text}>Minimum Distance Change to trigger location update:</Text>
          <Picker
            style={styles.picker}
            prompt="Minimum Distance change to trigger location update:"
            selectedValue={context.distanceIntervalInMeters}
            onValueChange={(itemValue) =>
              context.updateDistanceIntervalInMeters(itemValue)
            }>
            {distanceIntervalsInMeters.map((distanceIntervalInMeters) => {

              let label = distanceIntervalInMeters == 1 ? " meter" : " meters";

              return (
                <Picker.Item
                  key={"distanceIntervalInMeters" + distanceIntervalInMeters}
                  label={distanceIntervalInMeters.toFixed(1)+ label}
                  value={distanceIntervalInMeters} />)
            })}
          </Picker>

          <Text style={styles.text}>Units:</Text>
          <Picker
            selectedValue={context.units}
            style={Platform.OS == 'android' ? styles.picker : styles.pickerTwo}
            itemStyle={styles.pickerTwoItems}
            onValueChange={(itemValue) =>
              context.updateUnits(itemValue)
            }>
            <Picker.Item label="kilometers" value="km" />
            <Picker.Item label="miles" value="miles" />
          </Picker>

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

        </ScrollView>
        <TouchableOpacity
          onPress={() => { navigation.pop() }}
          style={styles.button}
        >
          <Text style={styles.buttonText}>Done</Text>
        </TouchableOpacity>
      </View>
    )}
  </AppContext.Consumer>
)}


/*
          <Text style={styles.text}>Times Around: {context.timesAround}</Text>
          <Slider
            style={styles.slider}
            minimumValue={1}
            maximumValue={~~context.getNumberOfControls() / 2}
            minimumTrackTintColor="#ef6c0c"
            maximumTrackTintColor="#333"
            thumbTintColor="#ef6c0c"
            step={1}
            value={context.timesAround}
            onSlidingComplete={(timesAround) => context.updateTimesAround(timesAround)}
          />
          <Text style={styles.text}>Randomness: {context.randomness}</Text>
          <Slider
            style={styles.slider}
            minimumValue={0}
            maximumValue={5000}
            minimumTrackTintColor="#ef6c0c"
            maximumTrackTintColor="#333"
            thumbTintColor="#ef6c0c"
            step={1}
            value={context.randomness}
            onSlidingComplete={(randomness) => context.updateRandomness(randomness)}
          />
*/