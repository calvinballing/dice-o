import { AppContext } from '../context';
import React, { Component } from 'react';
import { Text, View, Alert } from 'react-native';
import * as Location from 'expo-location';
import { TouchableOpacity } from 'react-native-gesture-handler'; //https://github.com/react-native-maps/react-native-maps/issues/2780#issuecomment-562629150
import MapView from 'react-native-maps';
import { Marker, Polyline } from 'react-native-maps';
import { colors, styles } from '../styles/styles';
import { distance } from '../utils/location';
import { LayerIcon, HelpIcon, AddMarkerIcon, BoundaryIcon, DeleteIcon, NextIcon } from '../assets/svgs';
import { strings } from '../strings';

export class SetBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = {
            editMode: 'addMarker',
            errorMsg: null,
            location: null,
            mapRegion: null,
        }
    }

    componentDidMount() {
        let context = this.context;
        
        (async () => {

            //TODO investigate whether we also need background permissions deprecated method: https://docs.expo.io/versions/latest/sdk/location/
            //Also, may want to use Location.getLastKnownPositionAsync(options) on this scene, and wait until later to begin continuous checking

            let alreadyHasServicesEnabled = await Location.hasServicesEnabledAsync();

            //console.log(alreadyHasServicesEnabled)

            if (!alreadyHasServicesEnabled) {
                let { status } = await Location.requestForegroundPermissionsAsync();
                if (status !== 'granted') {
                    this.setState({ errorMsg: strings.permissions.noLocation });
                }
            }

            let location = await Location.getCurrentPositionAsync({});

            let newMapRegion = {
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                latitudeDelta: 0.017,
                longitudeDelta: 0.017,
            }

            this.setState({ mapRegion: newMapRegion });

            Location.watchPositionAsync({
                accuracy: Location.Accuracy.Highest,
                distanceInterval: .75, //meters
                timeInterval: 500, //milliseconds
            }, location => {
                if (location !== context.userLocation) {
                    context.updateUserLocation(location);
                    if (context.userLocation && context.courseType == "Standard") {
                        context.updateDistanceToNextControlInMeters(distance(location.coords.latitude, location.coords.longitude, context.controls[context.getNextControlToFindIndex()].coordinate.latitude, context.controls[context.getNextControlToFindIndex()].coordinate.longitude, "meters"));
                    }
                }
            });

            if (context.boundaryCoordinates[0] !== undefined) {
                if (context.boundaryCoordinates[0].latitude == 0) {//TODO improve this. Is there a fit to coordinates method for MapView?
                    context.updateBoundaryCoordinates(
                        [
                            {
                                latitude: location.coords.latitude - .005,
                                longitude: location.coords.longitude - .005,
                            },
                            {
                                latitude: location.coords.latitude - .005,
                                longitude: location.coords.longitude + .005,
                            },
                            {
                                latitude: location.coords.latitude + .005,
                                longitude: location.coords.longitude + .005,
                            },
                            {
                                latitude: location.coords.latitude + .005,
                                longitude: location.coords.longitude - .005,
                            },
                        ]
                    )
                }
            }
        })();
    }

    getRegion = () => {
        let context = this.context;

        if (context.boundaryCoordinates[context.boundaryCoordinates.length - 1]) {

            let maxDelta = Math.max(context.getBoundaryWidth(), context.getBoundaryHeight());
            let center = context.getBoundaryCenter()
            let margin = .001

            return {
                latitude: center.latitude,
                longitude: center.longitude,
                latitudeDelta: maxDelta + margin,
                longitudeDelta: maxDelta + margin,
            }
        }
    }

    setBoundaryLocation = (ID, coordinate) => {
        let context = this.context;
        var newBoundaryCoordinates = JSON.parse(JSON.stringify(context.boundaryCoordinates));
        newBoundaryCoordinates[ID].latitude = coordinate.latitude;
        newBoundaryCoordinates[ID].longitude = coordinate.longitude;

        context.updateBoundaryCoordinates(newBoundaryCoordinates);
    }

    clearBoundaryCoordinates = () => {
        let context = this.context;
        context.updateBoundaryCoordinates([]);
        context.updateActiveBoundaryIndex(0);
    }


    setEditMode = (mode) => {
        this.setState({ editMode: mode });
    }

    addBoundaryPoint = (coordinate) => {
        if (this.state.editMode == 'addMarker') {
            let context = this.context;

            let newBoundaryCoordinates = context.boundaryCoordinates;
            newBoundaryCoordinates.splice(context.activeBoundaryIndex + 1, 0, coordinate)

            context.updateBoundaryCoordinates(newBoundaryCoordinates)

        }
    }

    removeBoundaryPoint = (indexToRemove) => {
        if (this.state.editMode == 'removeMarker') {
            let context = this.context;

            let newBoundaryCoordinates = JSON.parse(JSON.stringify(context.boundaryCoordinates))

            newBoundaryCoordinates.splice(indexToRemove, 1);

            if (context.activeBoundaryIndex >= indexToRemove) {
                context.updateActiveBoundaryIndex((context.activeBoundaryIndex - 1 + newBoundaryCoordinates.length) % newBoundaryCoordinates.length || 0)
            }

            context.updateBoundaryCoordinates(newBoundaryCoordinates)
        }
    }

    render() {
        let context = this.context;

        if (!this.state.mapRegion) {
            return (
            <View style={styles.mapLoadingTextContainer}>
            <Text 
            style={{margin:20}}
            //TODO replace this with and/or add a loader icon
            >{strings.permissions.loading}</Text>
                <Text style={{margin:20}}>
                    {strings.permissions.loading2}
                </Text>
            </View>
            );
        } else {
            return (
                <AppContext.Consumer>
                    {state => (
                        <View >
                            <MapView 
                                style={styles.mapStyle}
                                initialRegion={this.state.mapRegion}
                                customMapStyle={context.customMapStyle}
                                mapType={context.mapType}
                                //region={this.state.mapRegion}
                                //onRegionChange={this.onRegionChange}
                                showsUserLocation={true}
                                pitchEnabled={false}
                                provider={MapView.PROVIDER_GOOGLE}
                                onPress={(e) => { this.addBoundaryPoint(e.nativeEvent.coordinate) }}
                            >
                                {context.boundaryCoordinates.map((boundaryCoordinate, index) => {
                                    if (boundaryCoordinate) {
                                        return (
                                            <Marker draggable coordinate={boundaryCoordinate}
                                                key={"Index: " + index + "; " + JSON.stringify(boundaryCoordinate)}
                                                onPress={() => this.removeBoundaryPoint(index)}
                                                onDragEnd={(e) => {
                                                    this.setBoundaryLocation(index, e.nativeEvent.coordinate)
                                                }} />)
                                    }
                                })
                                }
                                {context.boundaryCoordinates.map((boundaryCoordinate, index) => {
                                    let nextIndex = (index + 1) % context.boundaryCoordinates.length;
                                    let strokeColor;
                                    let strokeWidth;
                                    let lineDashPattern;

                                    if (index == context.activeBoundaryIndex) {
                                        strokeColor = 'red';
                                        lineDashPattern = [16, 16];
                                    } else {
                                        strokeColor = colors.purple;
                                        lineDashPattern = [99];
                                    }
                                    return (
                                        <Polyline
                                            strokeColor={strokeColor}
                                            strokeWidth={4}
                                            lineDashPattern={lineDashPattern}
                                            tappable={this.state.editMode == 'boundary'}
                                            key={index + ': ' + JSON.stringify(boundaryCoordinate)}
                                            onPress={() => {
                                                context.updateActiveBoundaryIndex(index)
                                            }
                                            }
                                            coordinates={[boundaryCoordinate, context.boundaryCoordinates[nextIndex]]}>
                                        </Polyline>
                                    )
                                }
                                )}
                            </MapView>
                            <View style={{ position: 'absolute' }}>
                                <TouchableOpacity onPress={() => {
                                    this.props.navigation.navigate('SetBoundaryExplainer')
                                }}>
                                    <HelpIcon />
                                </TouchableOpacity>
                            </View>
                            <View style={{
                                position: 'absolute',
                                alignSelf: 'flex-end',
                            }}>
                                <TouchableOpacity onPress={() => { context.cycleMapType() }}>
                                    <LayerIcon />
                                </TouchableOpacity>
                                <View style={{
                                    backgroundColor: '#fff6',
                                    borderRadius: 5,
                                    margin: 5,
                                }}>
                                    <TouchableOpacity onPress={() => { this.setEditMode('addMarker') }}>
                                        <View style={{ margin: 5 }}>
                                            <AddMarkerIcon isActive={this.state.editMode == 'addMarker'} />
                                        </View>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => { this.setEditMode('boundary') }}>
                                        <View style={{ margin: 5 }}>
                                            <BoundaryIcon isActive={this.state.editMode == 'boundary'} />
                                        </View>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => { this.setEditMode('removeMarker') }}>
                                        <View style={{ margin: 5 }}>
                                            <DeleteIcon isActive={this.state.editMode == 'removeMarker'} />
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            </View>
                            <View                                 style={styles.mapBottomContainer}                            >
                                <View style={{ width: "50%" }}>
                                    <TouchableOpacity
                                        onPress={() => this.clearBoundaryCoordinates()}
                                        style={styles.button}
                                    >
                                        <Text style={styles.buttonText} >{strings.boundary.clearAll}</Text>
                                    </TouchableOpacity>
                                </View>
                                <View style={{
                                    width: "50%",
                                    flexDirection: 'row',
                                    justifyContent: 'flex-end',
                                }}>
                                    <TouchableOpacity

                                        onPress={() => {
                                            if (context.boundaryCoordinates.length < 3) {
                                                Alert.alert(
                                                    strings.boundary.moreBoundaryPointsAlertTitle,
                                                    strings.boundary.moreBoundaryPointsAlertText,
                                                    [{ text: strings.ok, }],
                                                )
                                            } else {
                                                this.props.navigation.navigate('SetStart')
                                            }
                                        }}
                                    >
                                        <NextIcon />
                                    </TouchableOpacity>
                                </View>
                                <Text></Text>
                            </View>
                        </View>
                    )
                    }
                </AppContext.Consumer>
            )
        }
    }
}

SetBoundary.contextType = AppContext;