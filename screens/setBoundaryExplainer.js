import React from 'react';
import { View, ScrollView, StatusBar } from 'react-native';
import { styles } from '../styles/styles';
import { AddMarkerIcon, BoundaryIcon, DeleteIcon, LayerIcon, MapMarkerIcon } from '../assets/svgs';
import { ExplainerItem } from '../components/explainerItem';
import { PoppingOkButton } from '../components/poppingOkButton';
import { strings } from '../strings';


export const SetBoundaryExplainer = ({ navigation, route }) => (
    <View style={styles.background}>
        <StatusBar hidden={false} barStyle={'dark-content'} />
        <ScrollView>
            <ExplainerItem
                icon={<MapMarkerIcon />}
                title={strings.explainer.boundaryMarkerTitle}
                text={strings.explainer.boundaryMarker}
            />
            <ExplainerItem
                icon={<AddMarkerIcon height="50" width="50" />}
                title={strings.explainer.addMarkerToolTitle}
                text={strings.explainer.addMarkerTool}
            />
            <ExplainerItem
                icon={<BoundaryIcon height="50" width="50" />}
                title={strings.explainer.boundaryToolTitle}
                text={strings.explainer.boundaryTool}
            />
            <ExplainerItem
                icon={<DeleteIcon height="50" width="50" />}
                title={strings.explainer.deleteToolTitle}
                text={strings.explainer.deleteTool}
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

