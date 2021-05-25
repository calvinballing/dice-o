import { AppContext } from '../context';
import { coordinatesToPolygon } from '../utils/location';
import { CourseBoundary } from '../components/courseBoundary'
import { HelpIcon, LayerIcon, MapControl, NextIcon } from '../assets/svgs';
import { Marker } from 'react-native-maps';
import { styles } from '../styles/styles';
import { startingLocation, } from '../globals'
import { Text, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler'; //https://github.com/react-native-maps/react-native-maps/issues/2780#issuecomment-562629150
import MapView from 'react-native-maps';
import React, { Component } from 'react';

export class SetFinish extends Component {
    constructor(props) {
        super(props);
        this.state = {
            location: null,
            scrollEnabled: true,
            zoomEnabled: true,
            editMode: false,
            errorMsg: null,
            target: { latitude: startingLocation.latitude, longitude: startingLocation.longitude },
        }
    }

    componentDidMount() {
        let context = this.context;

        let finishIndex = context.controls.length - 1;
        let finishCoordinate = context.controls[finishIndex].coordinate;

        const geometric = require("geometric");

        let finishIsInPolygon = geometric.pointInPolygon([finishCoordinate.latitude, finishCoordinate.longitude], coordinatesToPolygon(context.boundaryCoordinates))

        if (context.controls[context.controls.length - 1].coordinate.latitude == 1 || !finishIsInPolygon) {//TODO improve this
            context.updateFinish({ latitude: context.controls[0].coordinate.latitude, longitude: context.controls[0].coordinate.longitude })
        }
    }

    componentWillUnmount() { }

    componentDidUpdate() { }

    render() {
        let context = this.context;
        //  console.log(JSON.stringify(context.boundaryCoordinates[0]));
        //  console.log(JSON.stringify(context.boundaryCoordinates[context.boundaryCoordinates.length - 1]));
        return (

            <AppContext.Consumer>
                {state => (
                    <View>
                        <MapView style={styles.mapStyle} initialRegion={state.getMapRegion()} customMapStyle={context.customMapStyle}
                            mapType={context.mapType}
                            showsUserLocation={true}
                            scrollEnabled={this.state.scrollEnabled}
                            zoomEnabled={this.state.zoomEnabled}
                            rotateEnabled={this.state.rotateEnabled}
                            pitchEnabled={false}
                            provider={MapView.PROVIDER_GOOGLE}
                            onPress={(e) => { context.updateFinish(e.nativeEvent.coordinate) }}
                        >
                            <CourseBoundary />

                            <Marker
                                draggable={true}
                                coordinate={this.context.controls[0].coordinate}
                                onDragEnd={(e) => { context.updateStart(e.nativeEvent.coordinate) }}
                                key={'Start' + JSON.stringify(this.context.controls[0].coordinate)}
                                anchor={{ x: .5, y: .5 }}
                                tracksViewChanges={false}
                            >
                                <MapControl controlType={this.context.controls[0].controlType}></MapControl>
                            </Marker>
                            <Marker
                                draggable={true}
                                coordinate={this.context.controls[this.context.controls.length - 1].coordinate}
                                onDragEnd={(e) => { context.updateFinish(e.nativeEvent.coordinate) }}
                                key={'Finish' + JSON.stringify(this.context.controls[this.context.controls.length - 1].coordinate)}
                                anchor={{ x: .5, y: .5 }}
                                tracksViewChanges={false}
                            >
                                <MapControl controlType={this.context.controls[this.context.controls.length - 1].controlType}></MapControl>
                            </Marker>
                        </MapView>
                        <View style={{ position: 'absolute' }}>
                            <TouchableOpacity onPress={() => { this.props.navigation.navigate('SetFinishExplainer') }}>
                                <HelpIcon />
                            </TouchableOpacity>
                        </View>

                        <View style={{ position: 'absolute', alignSelf: 'flex-end' }}>
                            <TouchableOpacity onPress={() => { context.cycleMapType() }}>
                                <LayerIcon />
                            </TouchableOpacity>
                        </View>
                        <View style={styles.mapBottomRightContainer} >
                            <TouchableOpacity
                                onPress={() => this.props.navigation.navigate('SetCourse')}
                            >
                                <NextIcon />
                            </TouchableOpacity>
                            <Text></Text>
                        </View>
                    </View>
                )
                }
            </AppContext.Consumer>
        )
    }
}

SetFinish.contextType = AppContext;