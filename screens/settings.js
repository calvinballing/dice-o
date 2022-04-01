import { AppContext } from '../context';
import { styles } from '../styles/styles';
import { ScrollView, Text, TouchableOpacity, View, } from 'react-native';
import React from 'react';
import { MAX_CONTROLS, MIN_COURSE_LENGTH_IN_KM, MAX_COURSE_LENGTH_IN_KM } from '../globals';
import { Picker } from '@react-native-picker/picker';

const courseLengths = Array.from({ length: 20 }, (item, index) => index / 2 + MIN_COURSE_LENGTH_IN_KM);
const numbersOfRegularControls = Array.from({ length: MAX_CONTROLS }, (item, index) => index + 1);

export const Settings = ({ navigation, route }) => {
  return (<AppContext.Consumer>
    {context => (
      <View style={styles.background}>
        <ScrollView >

        {context.courseType == "Standard" && <View><Text style={styles.text}>Target Course Length:</Text>
            <Picker
              style={styles.picker}
              prompt="Target Course Length:"
              selectedValue={context.targetCourseLengthInK}
              onValueChange={(itemValue) =>
                context.updateTargetCourseLengthInK(itemValue)
              }>
              {courseLengths.map((courseLength) => {
                return (
                  <Picker.Item
                    key={"courseLength" + courseLength}
                    label={courseLength.toFixed(1) + " km"}
                    value={courseLength} />)
              })}
            </Picker>
          </View>
          }

          <Text style={styles.text}>Control Points:</Text>
          <Picker
            style={styles.picker}
            prompt="Control Points:"
            selectedValue={context.getNumberOfRegularControls()}
            onValueChange={(numberOfRegularControls) =>
              context.updateNumberOfControls(numberOfRegularControls)//TODO don't call this right away.  Don't call it until the user leaves the page
            }>
            {numbersOfRegularControls.map((numberOfRegularControls) => {
              return (
                <Picker.Item
                  key={"numberOfRegularControls" + numberOfRegularControls}
                  label={numberOfRegularControls == 1 ? "1 Control" : numberOfRegularControls + " Controls"}
                  value={numberOfRegularControls} />)
            })}
          </Picker>

          <TouchableOpacity
          onPress={() => { navigation.push('SettingsAdvanced') }}
          style={styles.secondaryButton}
        >
          <Text style={styles.secondaryButtonText}>Advanced Settings</Text>
        </TouchableOpacity>

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
)}