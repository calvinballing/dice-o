import React from 'react';
import { View, ScrollView, StatusBar } from 'react-native';
import { styles } from '../styles/styles';
import { LayerIcon, MapControl, UnitsIcon, QRIcon, RandomIcon } from '../assets/svgs';
import { ExplainerItem } from '../components/explainerItem';
import { PoppingOkButton } from '../components/poppingOkButton';
import { strings } from '../strings'

export const SetCourseExplainer = ({ navigation, route }) => (
    <View style={styles.background}>
        <StatusBar hidden={false} barStyle={'dark-content'} />
        <ScrollView>
            <ExplainerItem
                icon={<RandomIcon height="50" width="50" />}
                title={strings.explainer.randomToolTitle}
                text={strings.explainer.randomTool}
            />
            <ExplainerItem
                icon={<MapControl controlType="Start" height="50" width="50" isIcon={true} />}
                title={strings.explainer.moveStartTitle}
                text={strings.explainer.moveStart}
            />
            <ExplainerItem
                icon={<MapControl height="50" width="40" isIcon={true} />}
                title={strings.explainer.moveControlTitle}
                text={strings.explainer.moveControl}
            />
            <ExplainerItem
                icon={<MapControl controlType="Finish" height="50" width="50" isIcon={true} />}
                title={strings.explainer.moveFinishTitle}
                text={strings.explainer.moveFinish}
            />
            <ExplainerItem
                icon={<UnitsIcon />}
                title={strings.explainer.changeUnitsTitle}
                text={strings.explainer.changeUnits}
            />
            <ExplainerItem
                icon={<QRIcon margin={0} />}
                title={strings.explainer.QRIconTitle}
                text={strings.explainer.QRIcon}
            />
            <ExplainerItem
                icon={<LayerIcon margin={0} />}
                title={strings.explainer.layerTitle}
                text={strings.explainer.layer}
            />
        </ScrollView>
        <PoppingOkButton />
    </View>
)