import { AppContext } from '../context';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Share, Text, View } from 'react-native';
import { CourseBoundary } from '../components/courseBoundary'
import { CustomMarker } from '../components/customMarker'
import { MapControl } from '../assets/svgs';
import { strings } from '../strings';
import { destVincenty, distance, toDeg } from '../utils/location';
import { colors, styles } from '../styles/styles';
import { TouchableOpacity } from 'react-native';
import MapView, { Polyline } from 'react-native-maps';
import 'intl';
import React, { Component } from 'react';



export class ResultsRoute extends Component {
    constructor(props) {
        super(props);
        this.state = {
            legSegmentsForDrawing: [{ id: 1, coordinates: [{ latitude: 0, longitude: 0 }, { latitude: 1, longitude: 1 }] }],
            scaleFactor: 1,
        }
    }


    _handleRegionChangeComplete = mapRegion => {
        //TODO remove magic number
        this.setState({ scaleFactor: mapRegion.latitudeDelta / .007 }, () => this.prepareControlDataForDrawingOnMap(this.context.controls))
    }

    //TODO, combine this with the formula on setCourse.js
    prepareControlDataForDrawingOnMap = (controls) => {
        if (!controls) { return; }

        var courseLengthInMeters = 0;
        var leg;
        var legLengthInMeters = 0;
        var newLegs = [];
        var percentInsideCircle;

        var newControls = JSON.parse(JSON.stringify(controls));

        for (leg = 0; leg < controls.length; leg++) {

            if (leg < controls.length - 1) {

                legLengthInMeters = distance(controls[leg].coordinate.latitude, controls[leg].coordinate.longitude, controls[leg + 1].coordinate.latitude, controls[leg + 1].coordinate.longitude, "meters");
                courseLengthInMeters += legLengthInMeters;

                //TODO remove magic number
                percentInsideCircle = this.state.scaleFactor * 12.192 / legLengthInMeters;

                let lat1 = controls[leg].coordinate.latitude
                let lon1 = controls[leg].coordinate.longitude
                let lat2 = controls[leg + 1].coordinate.latitude
                let lon2 = controls[leg + 1].coordinate.longitude

                newLegs.push(
                    {
                        "id": leg,
                        "coordinates":
                            [{
                                "latitude": percentInsideCircle * (lat2 - lat1) + lat1,
                                "longitude": percentInsideCircle * (lon2 - lon1) + lon1,
                            }, {
                                "latitude": (1 - percentInsideCircle) * (lat2 - lat1) + lat1,
                                "longitude": (1 - percentInsideCircle) * (lon2 - lon1) + lon1,
                            }]
                    }
                )
            }

            let context = this.context;

            let priorControlID = (controls.length + leg - 1) % controls.length
            let currentControlID = leg
            let nextControlID = (leg + 1) % controls.length

            if (context.courseType == 'Standard') {
                let priorControlCoordinate = controls[priorControlID].coordinate
                let currentControlCoordinate = controls[currentControlID].coordinate
                let nextControlCoordinate = controls[nextControlID].coordinate

                let lat1 = priorControlCoordinate.latitude
                let lat2 = currentControlCoordinate.latitude
                let lat3 = nextControlCoordinate.latitude

                let lon1 = priorControlCoordinate.longitude
                let lon2 = currentControlCoordinate.longitude
                let lon3 = nextControlCoordinate.longitude

                let angleToPriorControl = toDeg(Math.atan2((lat1 - lat2), (lon1 - lon2)))
                let angleToNextControl = toDeg(Math.atan2((lat3 - lat2), (lon3 - lon2)))

                let angleAverage = (angleToPriorControl + angleToNextControl) / 2
                let labelAngle;

                if (Math.abs(angleToPriorControl - angleToNextControl) > 180) {
                    labelAngle = angleAverage
                } else {
                    labelAngle = 180 + angleAverage
                }

                let mapLabelBearing = 90 - labelAngle;

                newControls[currentControlID].mapLabelBearing = mapLabelBearing
            } else if (context.courseType == "Score-O") {
                newControls[currentControlID].mapLabelBearing = 0
            } else {
                throw "Unknown courseType, please use 'Standard' or 'Score-O'"
            }

        };

        this.setState({ legSegmentsForDrawing: newLegs });

    }

    

    render() {
        let context = this.context;

        return (
            <View>
                <MapView style={styles.mapStyle} initialRegion={context.getMapRegion()} customMapStyle={context.customMapStyle}
                    mapType={context.mapType}
                    showsUserLocation={false}
                    pitchEnabled={false}
                    rotateEnabled={false}
                    provider={MapView.PROVIDER_GOOGLE}
                    onRegionChangeComplete={this._handleRegionChangeComplete}
                >

                    <CourseBoundary />
                    {context.controls.map((control, index) => {

                        let color = control.loggedTime == null ? null : colors.gray
                        let size;

                        return <CustomMarker
                            coordinate={control.coordinate}
                            key={'Index: ' + index + '; CustomMarkerControl:' + JSON.stringify(control)}
                            id={'Index: ' + index + '; Control:' + JSON.stringify(control)}
                            anchor={{ x: .5, y: .5 }}
                            trackViewChanges={false}
                        >
                            <MapControl
                                controlType={control.controlType}
                                rotate={control.rotate || 0}
                                color={color}
                                height={size}
                                width={size}
                            ></MapControl>
                        </CustomMarker>
                    }
                    )}
                    {context.controls.map((control, index) => {
                        if (control.mapLabel) {
                            return <CustomMarker
                                coordinate={destVincenty(control.coordinate.latitude, control.coordinate.longitude, control.mapLabelBearing, this.state.scaleFactor * 30)}
                                key={'Index: ' + index + ' CustomMarkerControlLabel' + JSON.stringify(control)}
                                id={'Index: ' + index + ' CustomMarkerControlLabel' + JSON.stringify(control)}
                                anchor={{ x: .5, y: .5 }}
                            >
                                <View style={styles.controlTextContainer}>
                                    <Text style={control.loggedTime == null ? styles.controlText : styles.controlLoggedText}                                    >
                                        {control.mapLabel}
                                    </ Text>
                                </View>
                            </ CustomMarker>
                        } else { return; };
                    })}

                    {this.state.legSegmentsForDrawing.map((legSegmentForDrawing, index) => {
                        if (context.courseType == 'Standard') {
                            if (legSegmentForDrawing.coordinates[0]) {
                                if (legSegmentForDrawing.coordinates[0].latitude && legSegmentForDrawing.coordinates[1].latitude) {

                                    let strokeColor = context.controls[index + 1].loggedTime == null ? colors.purple : 'gray';

                                    return (
                                        <Polyline
                                            key={"Index: " + index + JSON.stringify(legSegmentForDrawing.id) + JSON.stringify(legSegmentForDrawing.coordinates)}
                                            strokeColor={strokeColor}
                                            strokeWidth={2}
                                            coordinates={
                                                legSegmentForDrawing.coordinates
                                            }
                                        ></Polyline>
                                    )
                                }
                            }
                        }
                    })
                    }

                    <Polyline
                        key={"UserPath"}
                        strokeColor={"blue"}
                        strokeWidth={2}
                        coordinates={
                            context.userPath
                        }
                    />
                </MapView>


            </View>
        )
    }
}

ResultsRoute.contextType = AppContext;