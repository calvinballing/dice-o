import React from 'react';
import { View, ScrollView, StatusBar, } from 'react-native';
import { styles } from '../styles/styles';
import { FlagIcon, LayerIcon, LocationIcon, MapControl, SettingsIcon, SkipIcon } from '../assets/svgs';
import { ExplainerItem } from '../components/explainerItem';
import { PoppingOkButton } from '../components/poppingOkButton';
import { strings } from '../strings'
import { AppContext } from '../context';

export const GameExplainer = ({ navigation, route }) => {
    return (<AppContext.Consumer>
        {context => (
    <View style={styles.background}>
        <StatusBar hidden={false} barStyle={'dark-content'} />
        <ScrollView>
            <ExplainerItem
                icon={<MapControl controlType="Start" height="50" width="50" isIcon={true} />}
                title={strings.explainer.controlStartTitle}
                text={strings.explainer.controlStart}
            />
            <ExplainerItem
                icon={<MapControl controlType="Control" height="50" width="50" isIcon={true} />}
                title={strings.explainer.controlRegularTitle}
                text={ context.courseType == "Standard" ? strings.explainer.controlRegularStandard : strings.explainer.controlRegularScoreO }
            />
            {context.courseType == "Standard" && <ExplainerItem
                icon={<MapControl controlType="Control" height="50" width="50" color="red" //TODO move to styles
                    isIcon={true} />}
                title={strings.explainer.controlActiveTitle}
                text={strings.explainer.controlActive}
            />
            }
            <ExplainerItem
                icon={<MapControl controlType="Control" height="50" width="50" color="gray" isIcon={true} />}
                title={strings.explainer.controlVisitedTitle}
                text={strings.explainer.controlVisited}
            />
            <ExplainerItem
                icon={<MapControl controlType="Finish" height="50" width="50" isIcon={true} />}
                title={strings.explainer.controlFinishTitle}
                text={strings.explainer.controlFinish}
            />
            <ExplainerItem
                icon={<SettingsIcon height="50" width="50" />}
                title={strings.explainer.settingsTitle}
                text={strings.explainer.settings}
            />
            <ExplainerItem
                icon={<FlagIcon height="50" width="50" />}
                title={strings.explainer.finishNowTitle}
                text={strings.explainer.finishNow}
            />
            {context.courseType == "Standard" && <ExplainerItem
                icon={<SkipIcon height="50" width="50" />}
                title={strings.explainer.skipTitle}
                text={strings.explainer.skip}
            />}
            <ExplainerItem
                icon={<LocationIcon height="50" width="50" />}
                title={strings.explainer.gpsHintTitle}
                text={strings.explainer.gpsHint}
            />
            <ExplainerItem
                icon={<LayerIcon margin={0} />}
                title={strings.explainer.layerTitle}
                text={strings.explainer.layer}
            />
        </ScrollView>
        <PoppingOkButton />
    </View>
)}
</AppContext.Consumer>
)}