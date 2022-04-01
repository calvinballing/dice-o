import { AppContext } from '../context';
import React, { Component } from 'react';
import { Text, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler'; //https://github.com/react-native-maps/react-native-maps/issues/2780#issuecomment-562629150
import { distance, destVincenty, toDeg, bearing, coordinatesToPolygon } from '../utils/location';
import MapView from 'react-native-maps';
import { Polyline, } from 'react-native-maps';
import { colors, styles } from '../styles/styles';
import {
    startingLocation,
    minimumControlSpacingInMeters,
    minimumConsecutiveLegAngleInDegrees,
} from '../globals'
import polylabel from '@mapbox/polylabel'
import { distanceToPolygon } from 'distance-to-polygon'
import { LayerIcon, HelpIcon, RandomIcon, MapControl, QRIcon } from '../assets/svgs';
import { CourseBoundary } from '../components/courseBoundary'
import { CustomMarker } from '../components/customMarker'


class CourseLength extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        let context = this.context;

        let courseLengthInMiles = context.getCourseLengthInMiles();
        let courseLengthInKilometers = context.getCourseLengthInKilometers();

        let courseLengthToDisplay;
        if (context.units == 'miles') {
            courseLengthToDisplay = courseLengthInMiles.toFixed(2) + ' miles'
        } else if (context.units == 'km') {
            courseLengthToDisplay = courseLengthInKilometers.toFixed(2) + '  km'
        } else { throw "courseLengthToDisplay expected units to be either 'miles' or 'km', but received'" + context.units + "'" }

        if (context.courseType == "Score-O") { return null }

        return (
            <View style={styles.mapTextContainer}             >
                <TouchableOpacity onPress={() => context.updateUnits(context.units == "km" ? "miles" : "km")}>
                    <Text style={styles.mapText}>
                        {courseLengthToDisplay}
                    </Text>
                </TouchableOpacity>
            </View>
        )
    }
}

export class SetCourse extends Component {
    constructor(props) {
        super(props);
        this.state = {
            location: null,
            errorMsg: null,
            boundaryPolygonInGeoJSON: [[0, 0]],
            poleOfInaccessibility: { latitude: 0, longitude: 0 },

            target: { latitude: startingLocation.latitude, longitude: startingLocation.longitude },
            scaleFactor: 1,
            legSegmentsForDrawing: [{ id: 1, coordinates: [{ latitude: 0, longitude: 0 }, { latitude: 1, longitude: 1 }] }],
        }
    }

    generatePolygonOfControls = (controls, numberOfControls, centerLatitude, centerLongitude, radiusInMeters, timesAround, isClockwise, startingAngle = 0) => {
        let newCoordinates = [];

        let polygonOfCoordinates = this.generatePolygonOfCoordinates(numberOfControls, centerLatitude, centerLongitude, radiusInMeters, timesAround, isClockwise, startingAngle = 0)

        controls.forEach((control, index) => {
            let isFirstOrLast = index == 0 || index == numberOfControls - 1;
            let newCoordinate = isFirstOrLast ? control.coordinate : polygonOfCoordinates[index];
            newCoordinates.push(newCoordinate);
        })

        return this.context.generateControlsFromCoordinates(newCoordinates)
    }

    generatePolygonOfCoordinates = (numberOfCoordinates, centerLatitude, centerLongitude, radiusInMeters, timesAround, isClockwise, startingAngle = 0) => {
        let newCoordinates = [];

        for (let controlNumber = 0; controlNumber < numberOfCoordinates; controlNumber++) {
            let directionSign = isClockwise ? 1 : -1;

            newCoordinates.push(
                destVincenty(
                    centerLatitude,
                    centerLongitude,
                    directionSign * timesAround * controlNumber / numberOfCoordinates * 360 + startingAngle,
                    radiusInMeters)
            )
        };

        return newCoordinates;
    }

    generateControls = (numberOfControls, timesAround, randomness, courseType) => {
        // console.log(numberOfControls)
        // console.log(timesAround)
        // console.log(randomness)
        // console.log(courseType)

        let context = this.context;
        // console.log(JSON.stringify(context))

        let boundaryPolygonInGeoJSON = [[]];
        let boundaryPolygonInGeoJSONWithLatitudeNormalized = [[]];
        // console.log(context.boundaryCoordinates)
        // console.log(context.controls[0])

        let ydiff = distance(context.boundaryCoordinates[0].latitude, context.boundaryCoordinates[0].longitude, context.boundaryCoordinates[0].latitude + .001, context.boundaryCoordinates[0].longitude, "meters")
        let xdiff = distance(context.boundaryCoordinates[0].latitude, context.boundaryCoordinates[0].longitude, context.boundaryCoordinates[0].latitude, context.boundaryCoordinates[0].longitude + .001, "meters")
        // console.log(xdiff)

        let scaleFactor = ydiff / xdiff;
        // console.log(scaleFactor)

        context.boundaryCoordinates.forEach(boundaryCoordinate => {
            boundaryPolygonInGeoJSON[0].push([boundaryCoordinate.latitude, boundaryCoordinate.longitude])

            boundaryPolygonInGeoJSONWithLatitudeNormalized[0].push([boundaryCoordinate.latitude * scaleFactor, boundaryCoordinate.longitude])
            // console.log(JSON.stringify(boundaryPolygonInGeoJSON))
        })

        //close LineRing
        boundaryPolygonInGeoJSON[0].push([context.boundaryCoordinates[0].latitude, context.boundaryCoordinates[0].longitude])
        boundaryPolygonInGeoJSONWithLatitudeNormalized[0].push([context.boundaryCoordinates[0].latitude * scaleFactor, context.boundaryCoordinates[0].longitude])
        // console.log(boundaryPolygonInGeoJSON)
        // console.log(boundaryPolygonInGeoJSONWithLatitudeNormalized)

        let poleOfInaccessibilityInGeoJSONWithHeightNormalized = polylabel(boundaryPolygonInGeoJSONWithLatitudeNormalized, 0.00001)
        let poleOfInaccessibility = { latitude: poleOfInaccessibilityInGeoJSONWithHeightNormalized[0] / scaleFactor, longitude: poleOfInaccessibilityInGeoJSONWithHeightNormalized[1] }
        // let poleOfInaccessibilityInGeoJSON = polylabel(boundaryPolygonInGeoJSON, 0.00001)
        // let poleOfInaccessibility = {latitude:poleOfInaccessibilityInGeoJSON[0],longitude:poleOfInaccessibilityInGeoJSON[1]}


        // console.log("JSON.stringify(poleOfInaccessibility)")
        // console.log(JSON.stringify(poleOfInaccessibility))
        this.setState({ boundaryPolygonInGeoJSON: boundaryPolygonInGeoJSON });
        this.setState({ poleOfInaccessibility: poleOfInaccessibility });  //TODO this doesn't quite work right, because it's being calculated based on the lat and long, instead of rescaling the heights to a distance, but for most maps it won't make a big difference

        context.updatePoleOfInaccessibilityLatitude(poleOfInaccessibility.latitude)
        context.updatePoleOfInaccessibilityLongitude(poleOfInaccessibility.longitude)

        let polygon = boundaryPolygonInGeoJSONWithLatitudeNormalized[0];
        // console.log(JSON.stringify(polygon))

        let pointLatitude = poleOfInaccessibility.latitude * scaleFactor
        let point = [pointLatitude, poleOfInaccessibility.longitude];
        // console.log("scaleFactor")
        // console.log(scaleFactor)
        // console.log(JSON.stringify(point))

        let radiusInLongitudeChange = distanceToPolygon(point, polygon) / scaleFactor
        // console.log(distanceToPolygon(point,polygon))
        // console.log("radiusInLatitudeChange")
        // console.log(radiusInLatitudeChange)

        // console.log("RadiusInMetersNumbers")
        // console.log(poleOfInaccessibility.latitude)
        // console.log(poleOfInaccessibility.longitude)
        // console.log(poleOfInaccessibility.latitude )
        // console.log( poleOfInaccessibility.longitude+ radiusInLongitudeChange)
        let radiusInMeters = distance(poleOfInaccessibility.latitude, poleOfInaccessibility.longitude, poleOfInaccessibility.latitude, poleOfInaccessibility.longitude + radiusInLongitudeChange, "meters") * scaleFactor
        // console.log("radiusInMeters")
        // console.log(radiusInMeters)

        // console.log("------------------Generating Controls------------------")

        var newControls = [];

        // let widthInMeters = distance(context.boundaryCenterLatitude, context.boundaryCenterLongitude, context.boundaryCenterLatitude + context.boundaryWidth, context.boundaryCenterLongitude, "feet")
        // let heightInMeters = distance(context.boundaryCenterLatitude, context.boundaryCenterLongitude, context.boundaryCenterLatitude , context.boundaryCenterLongitude + context.boundaryHeight, "feet")

        // console.log("width/height in feet")
        // console.log(widthInMeters)
        // console.log(heightInMeters)

        // var radiusInMeters = Math.min(widthInMeters,heightInMeters);
        // var radiusInMeters = radiusInMeters/ 3.2808 /2 //todo fix this

        var seedrandom = require('seedrandom');
        let rng = seedrandom();
        let isClockwise = rng() < .5;

        let angleToStart = bearing(poleOfInaccessibility.latitude, poleOfInaccessibility.longitude, context.controls[0].coordinate.latitude, context.controls[0].coordinate.longitude);

        //TODO if the start is "near" the pole of inaccessibility, then allow the angleToStart to point in any direction

        newControls = this.generatePolygonOfControls(context.controls, numberOfControls, poleOfInaccessibility.latitude, poleOfInaccessibility.longitude, radiusInMeters, timesAround, isClockwise, angleToStart)

        let entropyStep;
        let randomlySelectedControlToMove;
        let newLatitude;
        let newLongitude;

        const geometric = require("geometric");

        let scatterPhase;
        let doUpdateCoordinate;

        let currentTotalDistanceDifferenceFromTargetInK = Infinity;

        for (entropyStep = 0; entropyStep < randomness || (entropyStep < randomness * 10 && currentTotalDistanceDifferenceFromTargetInK > context.targetCourseLengthToleranceInK); entropyStep++) {


            scatterPhase = entropyStep < randomness / 4 && entropyStep < 100

            doUpdateCoordinate = false;

            randomlySelectedControlToMove = ~~((numberOfControls - 2) * rng()) + 1;//don't move start or finish

            let randomMovementDistancePercent = .1

            if (entropyStep%10 == 0){
                randomMovementDistancePercent = .2
            }

            if (entropyStep%9 == 0){
                randomMovementDistancePercent = .05
            }

            newLatitude = newControls[randomlySelectedControlToMove].coordinate.latitude + (rng() - .5) * randomMovementDistancePercent * context.getBoundaryWidth();
            newLongitude = newControls[randomlySelectedControlToMove].coordinate.longitude + (rng() - .5) * randomMovementDistancePercent * context.getBoundaryHeight();
            // console.log(newLatitude)
            // console.log(newLongitude)

            // console.log(context.boundaryCoordinates)
            if (geometric.pointInPolygon([newLatitude, newLongitude], coordinatesToPolygon(context.boundaryCoordinates))) {

                if (scatterPhase) {
                    doUpdateCoordinate = true;
                } else {

                    let increasesShallowerAngleThanMinimumAllowableViolations = false;
                    let increasesMinimumControlSpacingViolations = false;
                    let decreasesMinimumControlSpacingViolations = false;
                    let decreasesMinimumControlSpacing = false;
                    let decreasesMinimumConsecutiveLegAngle = false;
                    //let decreasesMinimumConsecutiveLegAngleViolations = false;
                    let minimumDistanceOfProposedNewControlLocationFromAnotherControlInMeters = Infinity;
                    let minimumDistanceOfCurrentControlLocationFromAnotherControlInMeters = Infinity;
                    let minimumAngleOfCurrentLegsInDegrees = 180;
                    let minimumAngleOfProposedLegsInDegrees = 180;
                    let distanceFromProposedControlLocationInMeters = 0;
                    let distanceFromCurrentControlLocationInMeters = 0;
                    let proposedMinimumControlSpacingViolations = 0;
                    let currentMinimumControlSpacingViolations = 0;

                    let proposedAngleViolations = 0;
                    let currentAngleViolations = 0;

                    let priorControlIndex;
                    let currentControlIndex;
                    let nextControlIndex;

                    let priorControlCoordinate;
                    let currentControlCoordinate;
                    let nextControlCoordinate;

                    let currentAngleToPriorControl;
                    let currentAngleToNextControl;

                    let currentTotalDistanceInK = 0;
                    let proposedTotalDistanceInK = 0;

                    let currentAngleDifference = 180;

                    let proposedAngleToPriorControl;
                    let proposedAngleToNextControl;

                    let proposedAngleDifference = 180;

                    // console.log("randomlySelectedControlToMove")
                    // console.log(randomlySelectedControlToMove)
                    // console.log("newLatitude")
                    // console.log(newLatitude)
                    // console.log("newLongitude")
                    // console.log(newLongitude)

                    // console.log("==================newControls==================")
                    // console.log(newControls)

                    newControls.forEach((control, index) => {
                        if (randomlySelectedControlToMove != index) {

                            distanceFromCurrentControlLocationInMeters = distance(newControls[randomlySelectedControlToMove].coordinate.latitude, newControls[randomlySelectedControlToMove].coordinate.longitude, control.coordinate.latitude, control.coordinate.longitude, "meters");
                            distanceFromProposedControlLocationInMeters = distance(newLatitude, newLongitude, control.coordinate.latitude, control.coordinate.longitude, "meters");

                            if (distanceFromCurrentControlLocationInMeters < minimumDistanceOfCurrentControlLocationFromAnotherControlInMeters) {
                                minimumDistanceOfCurrentControlLocationFromAnotherControlInMeters = distanceFromCurrentControlLocationInMeters;
                            }

                            if (distanceFromProposedControlLocationInMeters < minimumDistanceOfProposedNewControlLocationFromAnotherControlInMeters) {
                                minimumDistanceOfProposedNewControlLocationFromAnotherControlInMeters = distanceFromProposedControlLocationInMeters;
                            }

                            if (distanceFromCurrentControlLocationInMeters < minimumControlSpacingInMeters) {
                                currentMinimumControlSpacingViolations += 1;
                            }

                            if (distanceFromProposedControlLocationInMeters < minimumControlSpacingInMeters) {
                                proposedMinimumControlSpacingViolations += 1;
                            }

                        }

                        priorControlIndex = (numberOfControls + index - 1) % numberOfControls
                        currentControlIndex = index
                        nextControlIndex = (index + 1) % numberOfControls


                        priorControlCoordinate = newControls[priorControlIndex].coordinate
                        currentControlCoordinate = newControls[currentControlIndex].coordinate
                        nextControlCoordinate = newControls[nextControlIndex].coordinate


                        // console.log(priorControlCoordinate.latitude)
                        // console.log(currentControlCoordinate.latitude)
                        // console.log(priorControlCoordinate.longitude)
                        // console.log(currentControlCoordinate.longitude)
                        // console.log(nextControlCoordinate.latitude)
                        // console.log(currentControlCoordinate.latitude)
                        // console.log(nextControlCoordinate.longitude)
                        // console.log(currentControlCoordinate.longitude)

                        // console.log(priorControlCoordinate.latitude-currentControlCoordinate.latitude)
                        // console.log(priorControlCoordinate.longitude-currentControlCoordinate.longitude)
                        // console.log(Math.atan2((priorControlCoordinate.latitude-currentControlCoordinate.latitude),(priorControlCoordinate.longitude-currentControlCoordinate.longitude)))
                        // console.log(toDeg(Math.atan2((priorControlCoordinate.latitude-currentControlCoordinate.latitude),(priorControlCoordinate.longitude-currentControlCoordinate.longitude))))

                        currentAngleToPriorControl = toDeg(Math.atan2((priorControlCoordinate.latitude - currentControlCoordinate.latitude), (priorControlCoordinate.longitude - currentControlCoordinate.longitude)))
                        currentAngleToNextControl = toDeg(Math.atan2((nextControlCoordinate.latitude - currentControlCoordinate.latitude), (nextControlCoordinate.longitude - currentControlCoordinate.longitude)))

                        currentAngleDifference = 180 - Math.abs(180 - Math.abs(currentAngleToPriorControl - currentAngleToNextControl));

                        // console.log(newLatitude)
                        // console.log(newLongitude)

                        // console.log(priorControlCoordinate.latitude-newLatitude)
                        // console.log(priorControlCoordinate.longitude-newLongitude)
                        // console.log(Math.atan2((priorControlCoordinate.latitude-newLatitude),(priorControlCoordinate.longitude-newLongitude)))
                        // console.log(toDeg(Math.atan2((priorControlCoordinate.latitude-newLatitude),(priorControlCoordinate.longitude-newLongitude))))

                        let lat1 = priorControlCoordinate.latitude
                        let lat2 = currentControlCoordinate.latitude
                        let lat3 = nextControlCoordinate.latitude

                        let lon1 = priorControlCoordinate.longitude
                        let lon2 = currentControlCoordinate.longitude
                        let lon3 = nextControlCoordinate.longitude

                        if (index != numberOfControls - 1) {
                            currentTotalDistanceInK += distance(lat2, lon2, lat3, lon3, 'K');
                        }

                        if (randomlySelectedControlToMove == priorControlIndex) {
                            lat1 = newLatitude
                            lon1 = newLongitude
                        }

                        if (randomlySelectedControlToMove == currentControlIndex) {
                            lat2 = newLatitude
                            lon2 = newLongitude
                        }

                        if (randomlySelectedControlToMove == nextControlIndex) {
                            lat3 = newLatitude
                            lon3 = newLongitude
                        }

                        if (index != numberOfControls - 1) {
                            proposedTotalDistanceInK += distance(lat2, lon2, lat3, lon3, 'K');
                        }

                        proposedAngleToPriorControl = toDeg(Math.atan2((lat1 - lat2), (lon1 - lon2)))
                        proposedAngleToNextControl = toDeg(Math.atan2((lat3 - lat2), (lon3 - lon2)))

                        proposedAngleDifference = 180 - Math.abs(180 - Math.abs(proposedAngleToPriorControl - proposedAngleToNextControl));

                        if (currentAngleDifference < minimumConsecutiveLegAngleInDegrees) {
                            currentAngleViolations += 1;
                        }

                        if (proposedAngleDifference < minimumConsecutiveLegAngleInDegrees) {
                            proposedAngleViolations += 1;
                        }

                        if (currentAngleDifference < minimumAngleOfCurrentLegsInDegrees) {
                            minimumAngleOfCurrentLegsInDegrees = currentAngleDifference;
                        }

                        if (proposedAngleDifference < minimumAngleOfProposedLegsInDegrees) {
                            minimumAngleOfProposedLegsInDegrees = proposedAngleDifference;
                        }

                        //if (entropyStep == 1999) {
                            
                            
                          // console.log("angles")
                            
                           // console.log(index)
                           // console.log(currentAngleToPriorControl)
                           // console.log(currentAngleToNextControl)
                           // console.log(currentAngleDifference)
                            
                           // console.log(proposedAngleToPriorControl)
                           // console.log(proposedAngleToNextControl)
                            
                           // console.log("currentAngleViolations")
                           // console.log(currentAngleViolations)
                           // console.log("proposedAngleViolations")
                           // console.log(proposedAngleViolations)
                            
                            // console.log("newControls")
                            // console.log(newControls)
                        //}
                        })
                    

                    currentTotalDistanceDifferenceFromTargetInK = Math.abs(currentTotalDistanceInK - context.targetCourseLengthInK)
                    let proposedTotalDistanceDifferenceFromTargetInK = Math.abs(proposedTotalDistanceInK - context.targetCourseLengthInK)

                    let decreasesTotalDistanceDifferenceFromTarget = (proposedTotalDistanceDifferenceFromTargetInK < currentTotalDistanceDifferenceFromTargetInK)
                    let proposedTotalDistanceDifferenceFromTargetExceedsTolerance = (proposedTotalDistanceDifferenceFromTargetInK > context.targetCourseLengthToleranceInK)

                    // console.log("currentTotalDistanceDifferenceFromTargetInK")
                    // console.log(currentTotalDistanceDifferenceFromTargetInK)

                    // console.log("proposedTotalDistanceDifferenceFromTargetInK")
                    // console.log(proposedTotalDistanceDifferenceFromTargetInK)

                    // console.log("decreasesTotalDistanceDifferenceFromTarget")
                    // console.log(decreasesTotalDistanceDifferenceFromTarget)

                    // console.log("proposedTotalDistanceDifferenceFromTargetExceedsTolerance")
                    // console.log(proposedTotalDistanceDifferenceFromTargetExceedsTolerance)


                    if (currentMinimumControlSpacingViolations > proposedMinimumControlSpacingViolations) {
                        decreasesMinimumControlSpacingViolations = true;
                    }

                    if (currentMinimumControlSpacingViolations < proposedMinimumControlSpacingViolations) {
                        increasesMinimumControlSpacingViolations = true;
                    }

                    if (currentAngleViolations < proposedAngleViolations) {
                        increasesShallowerAngleThanMinimumAllowableViolations = true;
                    }

                    //if (minimumAngleOfProposedLegsInDegrees < minimumConsecutiveLegAngleInDegrees) {
                    //  isShallowerAngleThanMinimumAllowable = true;
                    // }

                    if (minimumDistanceOfProposedNewControlLocationFromAnotherControlInMeters < minimumDistanceOfCurrentControlLocationFromAnotherControlInMeters) {
                        decreasesMinimumControlSpacing = true;
                    }

                    if (minimumAngleOfProposedLegsInDegrees < minimumAngleOfCurrentLegsInDegrees) {
                        decreasesMinimumConsecutiveLegAngle = true;
                    }

                    /*
                    // console.log((!increasesMinimumControlSpacingViolations 
                    // && decreasesMinimumControlSpacing 
                    // || decreasesMinimumControlSpacingViolations
                        ) && 
                            (proposedAngleViolations == 0
                        //!increasesShallowerAngleThanMinimumAllowableViolations 
                        //&& decreasesMinimumConsecutiveLegAngle || decreasesMinimumConsecutiveLegAngleViolations
                        ) 
                        &&
                        (proposedMinimumControlSpacingViolations == 0 ||
                            !decreasesMinimumControlSpacing
                            ))
                    
                    // console.log((!increasesMinimumControlSpacingViolations 
                      //&& decreasesMinimumControlSpacing 
                      //|| decreasesMinimumControlSpacingViolations
                        ) 
                    )
                    // console.log( 
                        (proposedAngleViolations == 0
                        //!increasesShallowerAngleThanMinimumAllowableViolations 
                        //&& decreasesMinimumConsecutiveLegAngle || decreasesMinimumConsecutiveLegAngleViolations
                        ) 
                    )
                    // console.log(
                        (proposedMinimumControlSpacingViolations == 0 ||
                            !decreasesMinimumControlSpacing
                            )
                    )
                    */

                    //TODO, consider adding Traveling salesman problem (TSP) logic to measure the length of Score-Os
                    //https://github.com/saby1101/node-tspsolver

                    if (
                        (
                            !increasesMinimumControlSpacingViolations
                            //&& decreasesMinimumControlSpacing 
                            //|| decreasesMinimumControlSpacingViolations
                        ) &&
                        (
                            //proposedAngleViolations == 0
                            !increasesShallowerAngleThanMinimumAllowableViolations
                            || courseType == "Score-O"
                            //&& decreasesMinimumConsecutiveLegAngle || decreasesMinimumConsecutiveLegAngleViolations
                        )
                        &&
                        (
                            proposedMinimumControlSpacingViolations == 0
                            || !decreasesMinimumControlSpacing
                        )
                        &&
                        (
                            proposedAngleViolations == 0
                            || !decreasesMinimumConsecutiveLegAngle
                            || courseType == "Score-O"
                        )
                        &&
                        (
                            !proposedTotalDistanceDifferenceFromTargetExceedsTolerance
                            || decreasesTotalDistanceDifferenceFromTarget
                            || courseType == "Score-O"
                        )
                    ) {
                        doUpdateCoordinate = true;
                    }

                }
                if (doUpdateCoordinate) {
                    newControls[randomlySelectedControlToMove].coordinate.latitude = newLatitude;
                    newControls[randomlySelectedControlToMove].coordinate.longitude = newLongitude;
                }
            }
        }

        context.updateControls(newControls);

        this.prepareControlDataForDrawingOnMap(newControls);

        // console.log(this.state.legSegmentsForDrawing)
        // console.log("mark1");
        // console.log(this.state.mark1);
        // console.log("route[0]")
        // console.log(this.state.route[0]);

    }

    renumberControlsByLatitude = (controls) => {
        let coordinates = [];
        controls.forEach((control) => {
            coordinates.push(control.coordinate)
        })

        let regularCoordinates = coordinates.slice(1, coordinates.length - 1)

        let sortedRegularCoordinates = regularCoordinates.sort(function (a, b) {
            return a.latitude < b.latitude
        })
        let sortedCoordinates = sortedRegularCoordinates

        sortedCoordinates.unshift(coordinates[0])
        sortedCoordinates.push(coordinates[coordinates.length - 1])

        let sortedControls = this.context.generateControlsFromCoordinates(sortedCoordinates)

        return sortedControls;
    }

    //TODO, combine this with the formula on game.js
    prepareControlDataForDrawingOnMap = (controls) => {
        if (!controls) { return; }

        var leg;
        var newLegs = [];
        var percentInsideCircle
        var legLengthInMeters = 0;
        var courseLengthInMeters = 0;

        var newControls = JSON.parse(JSON.stringify(controls));

        let context = this.context;

        newControls = context.courseType == "Score-O" ? this.renumberControlsByLatitude(newControls) : newControls

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
                                "longitude": (1 - percentInsideCircle) * (lon2 - lon1) + lon1
                            }]
                    }
                )
            }


            let priorControlID = (controls.length + leg - 1) % controls.length
            let currentControlID = leg
            let nextControlID = (leg + 1) % controls.length

            let ydiff = distance(context.boundaryCoordinates[0].latitude, context.boundaryCoordinates[0].longitude, context.boundaryCoordinates[0].latitude + .001, context.boundaryCoordinates[0].longitude, "meters")
            let xdiff = distance(context.boundaryCoordinates[0].latitude, context.boundaryCoordinates[0].longitude, context.boundaryCoordinates[0].latitude, context.boundaryCoordinates[0].longitude + .001, "meters")
            let scaleFactor = ydiff / xdiff;       // TODO, add the scale factor to state
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
                let visualAngleToNextControl = toDeg(Math.atan2((lat3 - lat2) * scaleFactor, (lon3 - lon2)))
                let visualBearingToNextControl = 90 - visualAngleToNextControl;
                let angleAverage = (angleToPriorControl + angleToNextControl) / 2
                let labelAngle;
                if (Math.abs(angleToPriorControl - angleToNextControl) > 180) {
                    labelAngle = angleAverage
                } else {
                    labelAngle = 180 + angleAverage
                }
                let mapLabelBearing = 90 - labelAngle;
                newControls[currentControlID].mapLabelBearing = mapLabelBearing
                newControls[currentControlID].rotate = visualBearingToNextControl;
                // console.log(currentControlID)
                // console.log(angleToNextControl)
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
        this.setState({ scaleFactor: mapRegion.latitudeDelta / .007 }, () => this.prepareControlDataForDrawingOnMap(this.context.controls));
    }

    setControlLocation = (ID, coordinate) => {
        var newControls = JSON.parse(JSON.stringify(this.context.controls));
        newControls[ID].coordinate.latitude = coordinate.latitude;
        newControls[ID].coordinate.longitude = coordinate.longitude;

        this.context.updateControls(newControls);
        this.prepareControlDataForDrawingOnMap(newControls);
    }

    componentWillUnmount() { }

    componentDidUpdate() { }

    componentDidMount() {
        let context = this.context;

        if (context.currentCourseMatchesMostRecentCourseImportedFromQRCode()) {
            return
        }

        const geometric = require("geometric");
        //TODO, make sure all controls are within boundary

        let atLeastOneControlOutOfBounds

        context.controls.forEach(control => {
            if (!atLeastOneControlOutOfBounds)
                atLeastOneControlOutOfBounds = !geometric.pointInPolygon([control.coordinate.latitude, control.coordinate.longitude], coordinatesToPolygon(context.boundaryCoordinates))
        })

        if (context.controls[1].coordinate.latitude == 0
            || atLeastOneControlOutOfBounds
        ) {
            this.generateControls(context.controls.length, context.timesAround, context.randomness, context.courseType)

        }
    }

    render() {
        let context = this.context;
        return (
            //}= ({ navigation, route }) => (
            <AppContext.Consumer>
                {state => (
                    <View
                    //style={styles.mapContainer}
                    >
                        <MapView style={styles.mapStyle} initialRegion={state.getMapRegion()} customMapStyle={context.customMapStyle}
                            mapType={context.mapType}
                            showsUserLocation={true}
                            pitchEnabled={false}
                            rotateEnabled={false}
                            provider={MapView.PROVIDER_GOOGLE}
                            onRegionChangeComplete={this._handleRegionChangeComplete}
                        >
                            <CourseBoundary />
                            {
                                this.context.controls.map((control, index) => {
                                    return <CustomMarker
                                        draggable
                                        coordinate={control.coordinate}
                                        onDragEnd={(e) => { this.setControlLocation(index, e.nativeEvent.coordinate) }}
                                        key={'Index: ' + index + '; CustomMarkerControl:' + JSON.stringify(control)}
                                        id={'Index: ' + index + '; Control:' + JSON.stringify(control)}
                                        anchor={{ x: .5, y: .5 }}
                                    >
                                        <MapControl controlType={control.controlType} rotate={control.rotate || 0} ></MapControl>
                                    </CustomMarker>
                                })
                            }
                            {
                                this.context.controls.map((control, index) => {
                                    if (control.mapLabel) {
                                        return <CustomMarker
                                            coordinate={destVincenty(control.coordinate.latitude, control.coordinate.longitude, control.mapLabelBearing, this.state.scaleFactor * 30)}
                                            key={'Index: ' + index + ' CustomMarkerControlLabel' + JSON.stringify(control)}
                                            id={'Index: ' + index + ' ControlLabel' + JSON.stringify(control)}
                                            anchor={{ x: .5, y: .5 }}
                                        >
                                            <View style={styles.controlTextContainer}>
                                                <Text
                                                    style={styles.controlText}>
                                                    {control.mapLabel}
                                                </ Text>
                                            </View>
                                        </ CustomMarker>
                                    } else { return; };
                                })
                            }
                            {
                                this.state.legSegmentsForDrawing.map((legSegmentForDrawing, index) => {
                                    if (state.courseType == 'Standard') {
                                        // console.log(JSON.stringify(legSegmentForDrawing))
                                        if (legSegmentForDrawing.coordinates[0]) {
                                            if (legSegmentForDrawing.coordinates[0].latitude && legSegmentForDrawing.coordinates[1].latitude) {
                                                return (
                                                    <View key={"LineHolder: " + index + JSON.stringify(legSegmentForDrawing.id) + JSON.stringify(legSegmentForDrawing.coordinates)}>
                                                        <Polyline
                                                            key={"IndexBG: " + index + JSON.stringify(legSegmentForDrawing.id) + JSON.stringify(legSegmentForDrawing.coordinates)}
                                                            strokeColor={colors.transparentWhite}
                                                            strokeWidth={4}
                                                            coordinates={
                                                                legSegmentForDrawing.coordinates
                                                            }
                                                        ></Polyline>

                                                        <Polyline
                                                            key={"Index: " + index + JSON.stringify(legSegmentForDrawing.id) + JSON.stringify(legSegmentForDrawing.coordinates)}
                                                            strokeColor={colors.purple}
                                                            strokeWidth={2}
                                                            coordinates={
                                                                legSegmentForDrawing.coordinates
                                                            }
                                                        ></Polyline>
                                                    </View>
                                                )
                                            }
                                        }
                                    }
                                })
                            }
                        </MapView>
                        <CourseLength />
                        <View style={{ position: 'absolute', alignSelf: 'flex-start' }}>
                            <TouchableOpacity onPress={() => { this.props.navigation.navigate('SetCourseExplainer') }}>
                                <HelpIcon />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => { this.props.navigation.navigate('ExportQR') }}>
                                <QRIcon />
                            </TouchableOpacity>
                        </View>
                        <View style={{ position: 'absolute', flexDirection: 'row', alignSelf: 'flex-end' }}>
                            <TouchableOpacity onPress={() => { context.cycleMapType() }}>
                                <LayerIcon />
                            </TouchableOpacity>
                        </View>
                        <View style={styles.mapBottomContainer}                            >
                            <View style={{
                                width: "50%",
                                flexDirection: 'row',
                                justifyContent: 'flex-start',
                            }}>
                                <TouchableOpacity
                                    onPress={() => { this.generateControls(state.controls.length, state.timesAround, state.randomness, state.courseType) }}
                                    style={{ alignSelf: 'center' }}
                                >
                                    <View style={{ margin: 10 }}>
                                        <RandomIcon />
                                    </View>
                                </TouchableOpacity>
                            </View>
                            <View style={{
                                width: "50%",
                                flexDirection: 'row',
                                justifyContent: 'flex-end',
                            }}>
                                <TouchableOpacity
                                    onPress={() => this.props.navigation.navigate('Game')}
                                    style={styles.button}
                                >
                                    <Text style={styles.buttonText}>I'm Ready</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                )}
            </AppContext.Consumer>
        )
    }
}
SetCourse.contextType = AppContext;
CourseLength.contextType = AppContext;