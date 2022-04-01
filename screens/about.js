import { Anchor } from '../components/anchor';
import { AppContext } from '../context';
import { ScrollView, StatusBar, Text, TouchableOpacity, View, } from 'react-native';
import { strings } from '../strings';
import { styles } from '../styles/styles';
import React from 'react';

export const About = ({ navigation, route }) => {
    return (<AppContext.Consumer>
        {context => (
            <View style={styles.background}>
                <StatusBar hidden={false} barStyle={'dark-content'} />
                <ScrollView>
                    <Text style={styles.disclaimerText}>
                        {strings.about.p1}
                    </Text>
                    <Text style={styles.disclaimerText}>
                        {strings.about.p2}
                    </Text>
                    <Text style={styles.disclaimerText}>
                        {strings.about.p3}
                    </Text >
                    <Text style={styles.disclaimerText}>
                        {strings.about.bullet1}
                    </Text >
                    <Text style={styles.disclaimerText}>
                        {strings.about.bullet2}
                    </Text >
                    <Text style={styles.disclaimerText}>
                        {strings.about.bullet3}
                    </Text >
                    <Text style={styles.disclaimerText}>
                        {strings.about.bullet4}
                    </Text >
                    <Text style={styles.disclaimerText}>
                        {strings.about.p4}
                    </Text >
                    <Text style={styles.disclaimerText}>
                        {strings.about.wikipediaLinkPre}
                        <Anchor href={strings.about.wikipediaLinkURL}>
                            {strings.about.wikipediaLinkText}
                        </Anchor>
                        {strings.about.wikipediaLinkPost}
                    </Text >
                </ScrollView>
                <TouchableOpacity
                    onPress={() => { context.hasAcceptedDisclaimer ? navigation.push('CourseType') : navigation.push('Disclaimer') }}
                    style={styles.button}
                >
                    <Text style={styles.buttonText}>{strings.about.CTA}</Text>
                </TouchableOpacity>
            </View>
        )}
    </AppContext.Consumer>
    )
}