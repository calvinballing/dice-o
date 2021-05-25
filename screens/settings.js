import { AppContext } from '../context';
import { colors, styles } from '../styles/styles';
import { ScrollView, Switch, Text, TouchableOpacity, View, } from 'react-native';
import React, { Component } from 'react';
import Slider from '@react-native-community/slider';
import { MAX_CONTROLS, MAX_WINNING_DISTANCE, MIN_WINNING_DISTANCE, MIN_COURSE_LENGTH_IN_KM, MAX_COURSE_LENGTH_IN_KM, WINNING_DISTANCE_STEP } from '../globals';
import SegmentedControlTab from 'react-native-segmented-control-tab';

class UnitsSegmentedControl extends Component {
  constructor() {
    super();
  }

  render() {
    const units = ["km", "miles"];

    return (
      <AppContext.Consumer>
        {context => (
          <View>
            <Text>Units</Text>
            <SegmentedControlTab
              values={units}
              selectedIndex={units.indexOf(context.units)}
              onTabPress={(index) => context.updateUnits(units[index])}
              tabsContainerStyle={styles.tabsContainerStyle}
              tabTextStyle={styles.tabTextStyle}
              activeTabStyle={styles.activeTabStyle}
              tabStyle={styles.tabStyle}
            />
          </View>
        )}
      </AppContext.Consumer>
    );
  }
}

export const Settings = ({ navigation, route }) => (
  <AppContext.Consumer>
    {context => (
      <View style={styles.background}>
        <ScrollView >
          <Text style={styles.text}>Winning Distance: {context.winningDistanceInMeters} meters</Text>
          <Slider
            style={styles.slider}
            minimumValue={MIN_WINNING_DISTANCE}
            maximumValue={MAX_WINNING_DISTANCE}
            minimumTrackTintColor={colors.orange}
            maximumTrackTintColor="#333"
            thumbTintColor={colors.orange}
            step={WINNING_DISTANCE_STEP}
            value={context.winningDistanceInMeters}
            onSlidingComplete={(winningDistanceInMeters) => context.updateWinningDistanceInMeters(winningDistanceInMeters)}
          />
          <Text style={styles.text}>Control Points: {context.getNumberOfRegularControls()}</Text>
          <Slider
            style={styles.slider}
            minimumValue={1}
            maximumValue={MAX_CONTROLS}
            minimumTrackTintColor={colors.orange}
            maximumTrackTintColor="#333"
            thumbTintColor={colors.orange}
            step={1}
            value={context.getNumberOfRegularControls()}
            onSlidingComplete={(numberOfRegularControls) => context.updateNumberOfControls(numberOfRegularControls)}//TODO don't call this right away.  Don't call it until the user leaves the page
          />

          {context.courseType == "Standard" && <View><Text style={styles.text}>Target Course Length: {context.targetCourseLengthInK} km</Text>
          <Slider
            style={styles.slider}
            minimumValue={MIN_COURSE_LENGTH_IN_KM}
            maximumValue={MAX_COURSE_LENGTH_IN_KM}
            minimumTrackTintColor={colors.orange}
            maximumTrackTintColor="#333"
            thumbTintColor={colors.orange}
            step={.5}
            value={context.targetCourseLengthInK}
            onSlidingComplete={(targetCourseLengthInK) => context.updateTargetCourseLengthInK(targetCourseLengthInK)}
          />
          </View>
          }
          <UnitsSegmentedControl />
          <Text>Vibrate when finding a control</Text>
          <Switch
            trackColor={{ false: '#767577', true: '#767577' }}
            thumbColor={context.vibrate ? colors.orange : '#f4f3f4'}
            ios_backgroundColor="#3e3e3e"
            onValueChange={context.toggleVibrate}
            value={context.vibrate}
          />
        </ScrollView>
        <TouchableOpacity
          onPress={() => { navigation.push('SetBoundary') }}
          style={styles.button}
        >
          <Text style={styles.buttonText}>Next</Text>
        </TouchableOpacity>
      </View>
    )}
  </AppContext.Consumer>
)


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