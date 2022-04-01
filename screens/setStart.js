import { AppContext } from '../context';
import React, { Component } from 'react';
import { Text, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler'; //https://github.com/react-native-maps/react-native-maps/issues/2780#issuecomment-562629150
import MapView from 'react-native-maps';
import { Marker, Polyline } from 'react-native-maps';
import { styles } from '../styles/styles';
import { startingLocation, } from '../globals'
import { LayerIcon, HelpIcon, MapControl, NextIcon } from '../assets/svgs';
import { coordinatesToPolygon } from '../utils/location';
import { CourseBoundary } from '../components/courseBoundary'

export class SetStart extends Component {
    constructor(props) {
        super(props);
        this.state = {
            scrollEnabled: true,
            zoomEnabled: true,
            editMode: false,
            errorMsg: null,
            mapRegion: null,
            target: { latitude: startingLocation.latitude, longitude: startingLocation.longitude },
        }
    }


    onRegionChange(region, lastLat, lastLong) {
        this.setState({
            mapRegion: region,
            // If there are no new values set, use the the current ones
            lastLat: lastLat || this.state.lastLat,
            lastLong: lastLong || this.state.lastLong
        });
    }

    componentDidMount() {
        let context = this.context;

        const geometric = require("geometric");
        let startIsInPolygon = geometric.pointInPolygon([context.controls[0].coordinate.latitude, context.controls[0].coordinate.longitude], coordinatesToPolygon(context.boundaryCoordinates))

        if (context.controls[0].coordinate.latitude == 0 || !startIsInPolygon) {

            let userLocationIsInPolygon = geometric.pointInPolygon([context.userLocation.coords.latitude, context.userLocation.coords.longitude], coordinatesToPolygon(context.boundaryCoordinates))

            if (userLocationIsInPolygon) {
                context.updateStart({ latitude: context.userLocation.coords.latitude, longitude: context.userLocation.coords.longitude })
            } else {
                //TODO, change this to use the poleofinaccessibility
                context.updateStart({ latitude: context.getBoundaryCenter().latitude, longitude: context.getBoundaryCenter().longitude })
            }
        }

        context.storeData();
    }

    componentWillUnmount() { 
        this.context.storeData();
    }

    componentDidUpdate() { }

    render() {
        return (
            <AppContext.Consumer>
                {context => (
                    <View>
                        <MapView style={styles.mapStyle} initialRegion={context.getMapRegion()} customMapStyle={context.customMapStyle}
                            mapType={context.mapType}
                            showsUserLocation={true}
                            scrollEnabled={this.state.scrollEnabled}
                            zoomEnabled={this.state.zoomEnabled}
                            rotateEnabled={this.state.rotateEnabled}
                            pitchEnabled={false}
                            provider={MapView.PROVIDER_GOOGLE}
                            onPress={(e) => { context.updateStart(e.nativeEvent.coordinate) }}
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
                        </MapView>
                        <View style={{ position: 'absolute' }}>
                            <TouchableOpacity onPress={() => { this.props.navigation.navigate('SetStartExplainer') }}>
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
                                onPress={() => this.props.navigation.navigate('SetFinish')}
                            >
                                <NextIcon />
                            </TouchableOpacity>
                            <Text></Text>
                        </View>
                    </View>
                )}
            </AppContext.Consumer>
        )
    }
}

SetStart.contextType = AppContext;