import { AppContext } from '../context';
import { styles } from '../styles/styles';
import { ScrollView, Text, TouchableOpacity, View, } from 'react-native';
import React, { useContext, useEffect } from 'react';
import { strings } from '../strings';

export const CourseType = ({ navigation, route }) => {
  const context = useContext(AppContext)

  useEffect(() => {
    context.storeData();
  })

  return (
  <AppContext.Consumer>
    {context => (
      <View style={styles.background}>
        <ScrollView >

          <Text style={styles.buttonLabel}>
            {strings.courseType.standardDescription}
          </Text >
          <TouchableOpacity
            onPress={() => { context.updateCourseType("Standard"); navigation.push('Settings') }}
            style={styles.button}
          >
            <Text style={styles.buttonText}>{strings.courseType.standardCTA}</Text>
          </TouchableOpacity>

          <Text style={styles.buttonLabel}>
            {strings.courseType.scoreODescription}
          </Text >
          <TouchableOpacity
            onPress={() => { context.updateCourseType("Score-O"); navigation.push('Settings') }}
            style={styles.button}
          >
            <Text style={styles.buttonText}>{strings.courseType.scoreOCTA}</Text>
          </TouchableOpacity>

          <Text style={styles.buttonLabel}>
            {strings.courseType.importQRDescription}
          </Text >
          <TouchableOpacity
            onPress={() => { navigation.push('ImportQR') }}
            style={styles.button}
          >
            <Text style={styles.buttonText}>{strings.courseType.importQRCTA}</Text>
          </TouchableOpacity>

        </ScrollView>
      </View>
    )}
  </AppContext.Consumer>
)}