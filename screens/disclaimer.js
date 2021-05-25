import { Anchor } from '../components/anchor';
import { ScrollView, StatusBar, Text, TouchableOpacity, View, } from 'react-native';
import { strings } from '../strings';
import { styles } from '../styles/styles';
import React from 'react';

//TODO move links to GitHub

export const Disclaimer = ({ navigation, route }) => (
    <View style={styles.background}>
        <StatusBar hidden={false} barStyle={'dark-content'} />
        <ScrollView>
            <Text style={styles.disclaimerText}>
                {strings.disclaimer.p1}
            </Text>
            <Text style={styles.disclaimerTextSmall}>
                {strings.disclaimer.p2}
            </Text>
            <Text style={styles.disclaimerTextSmall}>
                {strings.disclaimer.p3}
            </Text >
            <Text style={styles.disclaimerTextSmall}>
                {strings.disclaimer.p4}
            </Text >
            <Text style={styles.disclaimerTextSmall}>
                {strings.disclaimer.privacyPolicyPre}
                <Anchor href="https://dice-o.flycricket.io/privacy.html"> 
                    {strings.disclaimer.privacyPolicy} 
                </Anchor> 
                {strings.disclaimer.privacyPolicyPost}
                <Anchor href="https://dice-o.flycricket.io/terms.html"> 
                    {strings.disclaimer.termsAndConditions}
                </Anchor> 
                {strings.disclaimer.termsAndConditionsPost}
            </Text >
        </ScrollView>
        <TouchableOpacity
            onPress={() => { navigation.push('CourseType') }}
            style={styles.button}
        >
            <Text style={styles.buttonText}>{strings.disclaimer.CTA}</Text>
        </TouchableOpacity>
    </View>
)