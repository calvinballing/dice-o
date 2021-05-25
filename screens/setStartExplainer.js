import React from 'react';
import { View, ScrollView, StatusBar } from 'react-native';
import { styles } from '../styles/styles';
import { LayerIcon, MapControl } from '../assets/svgs';
import { ExplainerItem } from '../components/explainerItem';
import { PoppingOkButton } from '../components/poppingOkButton';
import { strings } from '../strings'

export const SetStartExplainer = ({ navigation, route }) => (
    <View style={styles.background}>
        <StatusBar hidden={false} barStyle={'dark-content'} />
        <ScrollView>
            <ExplainerItem
                icon={<MapControl controlType="Start" height="50" width="50" isIcon={true} />}
                text="Tap anywhere on the map to place the Start there, or press and hold the triangle to drag the Start to a different location."
            />
            <ExplainerItem
                icon={<LayerIcon margin={0} />}
                text={strings.explainer.layer}
            />
        </ScrollView>
        <PoppingOkButton />
    </View>
)

