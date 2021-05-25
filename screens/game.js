import { Alert, Text, View, } from 'react-native';
import { AppContext } from '../context';
import { colors, styles } from '../styles/styles';
import { CourseBoundary } from '../components/courseBoundary'
import { CustomMarker } from '../components/customMarker'
import { distance, destVincenty, toDeg } from '../utils/location';
import { FlagIcon, HelpIcon, LayerIcon, LocationIcon, MapControl, SettingsIcon, SkipIcon, } from '../assets/svgs';
import { Polyline } from 'react-native-maps';
import { startingLocation, } from '../globals'
import { TouchableOpacity } from 'react-native-gesture-handler'; //https://github.com/react-native-maps/react-native-maps/issues/2780#issuecomment-562629150
import MapView from 'react-native-maps';
import React, { Component } from 'react';


export class Game extends Component {
    constructor(props) {
        super(props);
        this.state = {
            boundaryPolygonInGeoJSON: [[0, 0]],
            courseLengthInMeters: 0,
            currentlyShowingAlert: false,
            distanceToNextControlInMeters: { distanceInMeters: Infinity, index: 0 },
            errorMsg: null,
            legSegmentsForDrawing: [{ id: 1, coordinates: [{ latitude: 0, longitude: 0 }, { latitude: 1, longitude: 1 }] }],
            scaleFactor: 1,
            showsUserLocation: false,
            target: { latitude: startingLocation.latitude, longitude: startingLocation.longitude },
            userLocation: { latitude: 0, longitude: 0 },
        }
    }

    //TODO, combine this with the formula on game.js
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
        this.context.updateControls(newControls);
        this.context.updateCourseLengthInMeters(courseLengthInMeters);

    }

    _handleRegionChangeComplete = mapRegion => {
        //TODO remove magic number
        this.setState({ scaleFactor: mapRegion.latitudeDelta / .007 }, () => this.prepareControlDataForDrawingOnMap(this.context.controls))
    }

    compareDistanceForStandardCourse() {
        let context = this.context;
        if (!this.state.currentlyShowingAlert && (this.state.distanceToNextControlInMeters.distanceInMeters < context.winningDistanceInMeters && this.state.distanceToNextControlInMeters.index == context.getNextControlToFindIndex())) {
            this.props.navigation.push('ControlLogged', { controlIndex: context.getNextControlToFindIndex() })
            context.markControlAsFound(context.getNextControlToFindIndex(), new Date());
        }
    }

    compareDistanceForScoreOCourse() {
        let context = this.context;

        //console.log("Start___________")

        let foundControls = [];//TODO this is not the right way to do this.  I'm checking every single control, then only using the information from the first one returned. Should be breaking out of the loop at that point instead

        context.controls.forEach(async (control, index) => {

            let distanceToControlInMeters = distance(control.coordinate.latitude, control.coordinate.longitude, context.userLocation.coords.latitude, context.userLocation.coords.longitude, "meters");

            let shouldCheck = !this.state.currentlyShowingAlert && control.loggedTime == null

            //console.log("index " + index)
            //console.log("shouldCheck " + shouldCheck)
            //console.log("canfinish " + context.canFinishCourse)

            if (shouldCheck && distanceToControlInMeters < context.winningDistanceInMeters) {
                foundControls.push(index)
            }
        })

        if (foundControls.length > 0) {
            this.handleFoundControl(foundControls[0]);
        }
    }

    async handleFoundControl(index) {
        let context = this.context;

        //(index)

        if (context.controls[index].controlType != "Finish") {
            this.handleWillMarkControlAsFound(index);
        } else if (context.canFinishCourse) {{

            //console.log(context.lastTimeSkippedFinished)
            //console.log(context.lastTimeSkippedFinished + 15000)
            //console.log(new Date())
            //console.log(context.lastTimeSkippedFinished + 15000 < new Date())

            if (context.hasLoggedAllRegularControls()) {
                this.handleWillMarkControlAsFound(index);
            } else if (context.lastTimeSkippedFinished + 15000 < new Date()) {
                this.setState({ currentlyShowingAlert: true });
                Alert.alert(
                    "Finish Early?",
                    "You reached the Finish, but you have not found all the controls.  Do you want to end now?",
                    [{
                        text: "Cancel",
                        style: "cancel",
                        onPress: () => {
                            context.updateLastTimeSkippedFinished();
                            this.setState({ currentlyShowingAlert: false });
                        }
                    }, {
                        text: "End Now",
                        style: "destructive",
                        onPress: () => {
                            this.handleWillMarkControlAsFound(index)
                            this.setState({ currentlyShowingAlert: false });
                        }
                    }],
                )
            }}
        }
    }

    async handleWillMarkControlAsFound(index) {
        //console.log("handleWillMarkControlAsFound"+index)
        this.props.navigation.push('ControlLogged', { controlIndex: index })
        await this.context.markControlAsFound(index, new Date());
    }


    componentDidUpdate() {
        this.handleUpdate();
    }

    handleUpdate() {
        let context = this.context;

        if (this.props.navigation.isFocused()) {
            if (context.userLocation) {

                if (context.userLocation != this.state.userLocation) {
                    this.setState({ userLocation: context.userLocation })

                    if (context.courseType == "Standard") {
                        let targetCoordinate = context.controls[context.getNextControlToFindIndex()].coordinate;
                        let currentDistanceInMeters = distance(context.userLocation.coords.latitude, context.userLocation.coords.longitude, targetCoordinate.latitude, targetCoordinate.longitude, "meters")

                        this.setState({ distanceToNextControlInMeters: { distanceInMeters: currentDistanceInMeters, index: context.getNextControlToFindIndex() } }, this.compareDistanceForStandardCourse());
                    } else if (context.courseType == "Score-O") {
                        this.compareDistanceForScoreOCourse();
                    } else {
                        throw "unknown Course Type, expected 'Standard' or 'Score-O'"
                    }
                }
            };
        }
    }

    componentWillUnmount() { }

    componentDidMount() {
        this.handleUpdate();
    }

    render() {
        let locationText = 'Waiting...';
        let context = this.context;
        let progressText = `Find next: ${context.controls[context.getNextControlToFindIndex()].textLabel}`;

        if (this.state.errorMsg) {
            locationText = this.state.errorMsg;
        } else if (context.userLocation) {
            locationText = 'Location Found\n'
        }

        return (
            <AppContext.Consumer>
                {state => (
                    <View>
                        <MapView style={styles.mapStyle} initialRegion={state.getMapRegion()} customMapStyle={context.customMapStyle}
                            mapType={context.mapType}
                            showsUserLocation={this.state.showsUserLocation}
                            pitchEnabled={false}
                            rotateEnabled={false}
                            provider={MapView.PROVIDER_GOOGLE}
                            onRegionChangeComplete={this._handleRegionChangeComplete}
                        >
                            <CourseBoundary />
                            {this.context.controls.map((control, index) => {

                                let color = control.loggedTime == null ? null : colors.gray
                                let size;
                                if (context.courseType == "Standard") {
                                    color = context.getNextControlToFindIndex() == index ? colors.red : color
                                    size = context.getNextControlToFindIndex() == index ? 34 : null
                                }

                                return <CustomMarker
                                    coordinate={control.coordinate}
                                    onDragEnd={(e) => { this.setControlLocation(index, e.nativeEvent.coordinate) }}
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
                            {this.context.controls.map((control, index) => {
                                if (control.mapLabel) {
                                    return <CustomMarker
                                        coordinate={destVincenty(control.coordinate.latitude, control.coordinate.longitude, control.mapLabelBearing, this.state.scaleFactor * 30)}
                                        key={'Index: ' + index + ' CustomMarkerControlLabel' + JSON.stringify(control)}
                                        id={'Index: ' + index + ' CustomMarkerControlLabel' + JSON.stringify(control)}
                                        anchor={{ x: .5, y: .5 }}
                                    >
                                        <View style={index == (context.courseType == "Standard" && context.getNextControlToFindIndex()) ? styles.controlTextContainerActive : styles.controlTextContainer}>
                                            <Text style={control.loggedTime == null ? styles.controlText : styles.controlLoggedText}                                    >
                                                {control.mapLabel}
                                            </ Text>
                                        </View>
                                    </ CustomMarker>
                                } else { return; };
                            })}

                            {this.state.legSegmentsForDrawing.map((legSegmentForDrawing, index) => {
                                if (state.courseType == 'Standard') {
                                    if (legSegmentForDrawing.coordinates[0]) {
                                        if (legSegmentForDrawing.coordinates[0].latitude && legSegmentForDrawing.coordinates[1].latitude) {

                                            let strokeColor = context.controls[index + 1].loggedTime == null ? colors.purple : 'gray';
                                            let strokeWidth = context.getNextControlToFindIndex() == index + 1 ? 4 : 2
                                            strokeColor = context.getNextControlToFindIndex() == index + 1 ? "red" : strokeColor

                                            return (
                                                <Polyline
                                                    key={"Index: " + index + JSON.stringify(legSegmentForDrawing.id) + JSON.stringify(legSegmentForDrawing.coordinates)}
                                                    strokeColor={strokeColor}
                                                    strokeWidth={strokeWidth}
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
                        </MapView>
                        {context.courseType == "Standard" && <View style={styles.mapTextContainer}>
                            <Text style={styles.mapText}>
                                {progressText}
                            </Text>
                        </View>}
                        <View style={{ position: 'absolute', alignSelf: 'flex-start' }}>
                            <TouchableOpacity onPress={() => { this.props.navigation.navigate('GameExplainer') }}>
                                <HelpIcon />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => {
                                this.props.navigation.navigate('GameSettings')
                            }}>
                                <View style={{ margin: 10 }}>
                                    <SettingsIcon />
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => {
                                let index = context.getNextControlToFindIndex();
                                this.setState({ currentlyShowingAlert: true });
                                Alert.alert(
                                    "End Course Now?",
                                    "Are you sure you want to end the course now without finding any more controls?",
                                    [{
                                        text: "Cancel",
                                        style: "cancel",
                                        onPress: () => { this.setState({ currentlyShowingAlert: false }) }
                                    }, {
                                        text: "End now",
                                        style: "destructive",
                                        onPress: () => {
                                            context.markControlAsSkipped(index, new Date(), () => {
                                                this.props.navigation.navigate('ControlLogged', { controlIndex: index })
                                            });
                                            this.setState({ currentlyShowingAlert: false });

                                        },
                                    }],
                                )
                            }}>
                                <View style={{ margin: 10 }}>
                                    <FlagIcon />
                                </View>
                            </TouchableOpacity>
                            {context.courseType == "Standard" && <TouchableOpacity onPress={() => {
                                let index = context.getNextControlToFindIndex();
                                this.setState({ currentlyShowingAlert: true });
                                Alert.alert(
                                    "Skip " + context.controls[index].textLabel + "?",
                                    "Are you sure you want to skip the next control?",
                                    [{
                                        text: "Cancel",
                                        style: "cancel",
                                        onPress: () => { this.setState({ currentlyShowingAlert: false }) }
                                    }, {
                                        text: "Skip",
                                        style: "destructive",
                                        onPress: () => {
                                            context.markControlAsSkipped(index, new Date(), () => { this.props.navigation.navigate('ControlLogged', { controlIndex: index }) })
                                            this.setState({ currentlyShowingAlert: false });
                                        },
                                    }],
                                )
                            }}>
                                <View style={{ margin: 10 }}>
                                    <SkipIcon />
                                </View>
                            </TouchableOpacity>}
                            <TouchableOpacity onPress={() => {
                                this.setState({ showsUserLocation: !this.state.showsUserLocation })
                            }}>
                                <View style={{ margin: 10 }}>
                                    <LocationIcon isActive={this.state.showsUserLocation} />
                                </View>
                            </TouchableOpacity>
                        </View>
                        <View style={{ position: 'absolute', flexDirection: 'row', alignSelf: 'flex-end' }}>
                            <TouchableOpacity onPress={() => { context.cycleMapType() }}>
                                <LayerIcon />
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
            </AppContext.Consumer>
        )
    }
}

Game.contextType = AppContext;