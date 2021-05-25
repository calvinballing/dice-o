import React from 'react';
import { View, ScrollView, StatusBar, } from 'react-native';
import { styles } from '../styles/styles';
import { LayerIcon, LocationIcon, MapControl, SkipIcon } from '../assets/svgs';
import { ExplainerItem } from '../components/explainerItem';
import { PoppingOkButton } from '../components/poppingOkButton';
import { strings } from '../strings'

export const GameExplainer = ({ navigation, route }) => (
    <View style={styles.background}>
        <StatusBar hidden={false} barStyle={'dark-content'} />
        <ScrollView>
            <ExplainerItem
                icon={<MapControl controlType="Start" height="50" width="50" isIcon={true} />}
                text={strings.explainer.controlStart}
            />
            <ExplainerItem
                icon={<MapControl controlType="Control" height="50" width="50" isIcon={true} />}
                text={strings.explainer.controlRegular}
            />
            <ExplainerItem
                icon={<MapControl controlType="Control" height="50" width="50" color="red" //TODO move to styles
                    isIcon={true} />}
                text={strings.explainer.controlActive}
            />
            <ExplainerItem
                icon={<MapControl controlType="Control" height="50" width="50" color="gray" isIcon={true} />}
                text={strings.explainer.controlVisited}
            />
            <ExplainerItem
                icon={<MapControl controlType="Finish" height="50" width="50" isIcon={true} />}
                text={strings.explainer.controlFinish}
            />
            <ExplainerItem
                icon={<SkipIcon height="50" width="50" />}
                text={strings.explainer.skip}
            />
            <ExplainerItem
                icon={<LocationIcon height="50" width="50" />}
                text={strings.explainer.gpsHint}
            />
            <ExplainerItem
                icon={<LayerIcon margin={0} />}
                text={strings.explainer.layer}
            />
        </ScrollView>
        <PoppingOkButton />
    </View>
)

