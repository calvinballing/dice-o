import { AppContext } from '../context';
import { styles } from '../styles/styles';
import { ScrollView, Text, TouchableOpacity, View, } from 'react-native';
import React from 'react';

export const CourseType = ({ navigation, route }) => (
  <AppContext.Consumer>
    {context => (
      <View style={styles.background}>
        <ScrollView >
        <TouchableOpacity
            onPress={() => { context.updateCourseType("Standard"); navigation.push('Settings') }}
            style={styles.button}
          >
            <Text style={styles.buttonText}>Standard</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => { context.updateCourseType("Score-O"); navigation.push('Settings') }}
            style={styles.button}
          >
            <Text style={styles.buttonText}>Score-O</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => { navigation.push('ImportQR') }}
            style={styles.button}
          >
            <Text style={styles.buttonText}>Import Course via QR</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    )}
  </AppContext.Consumer>
)