import { Anchor } from '../components/anchor';
import { ScrollView, StatusBar, Text, TouchableOpacity, View, } from 'react-native';
import { strings } from '../strings';
import { styles } from '../styles/styles';
import React from 'react';
import { AppContext } from '../context';

//TODO move links to GitHub

export const Disclaimer = ({ navigation, route }) => {
    return (<AppContext.Consumer>
        {context => (
            <View style={styles.background}>
                <StatusBar hidden={false} barStyle={'dark-content'} />
                <ScrollView>
                    <Text style={styles.disclaimerTextSmall}>
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
                        {strings.disclaimer.p5}
                    </Text >
                    <Text style={styles.disclaimerTextSmall}>
                        {strings.disclaimer.p6}
                    </Text >
                    <Text style={styles.disclaimerTextSmall}>
                        {strings.disclaimer.privacyPolicyPre}
                        <Anchor href={strings.disclaimer.privacyURL}>
                            {strings.disclaimer.privacyPolicy}
                        </Anchor>
                        {strings.disclaimer.privacyPolicyPost}
                        <Anchor href={strings.disclaimer.termsAndConditionsURL}>
                            {strings.disclaimer.termsAndConditions}
                        </Anchor>
                        {strings.disclaimer.termsAndConditionsPost}
                    </Text >
                </ScrollView>
                <TouchableOpacity
                    onPress={() => {
                        context.updateHasAcceptedDisclaimer(true);
                        navigation.push('CourseType')
                    }}
                    style={styles.button}
                >
                    <Text style={styles.buttonText}>{strings.disclaimer.CTA}</Text>
                </TouchableOpacity>
            </View>
        )}
    </AppContext.Consumer>
    )
}