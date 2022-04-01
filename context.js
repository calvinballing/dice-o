import React from "react";
export const AppContext = React.createContext();
import { CUSTOM_MAP_STYLE } from './styles/styles';
import { distance, } from './utils/location';
import { strings } from './strings';
import AsyncStorage from '@react-native-async-storage/async-storage';
class SettingsContext extends React.Component {
  state = {
    activeBoundaryIndex: 3,
    boundaryCoordinates: [
      {
        latitude: 0,
        longitude: 0,
      },
    ],
    canFinishCourse: false,
    controls: [
      {
        coordinate: { latitude: 0, longitude: 0 },
        mapLabel: '',
        textLabel: strings.context.start,
        mapLabelBearing: 0,
        status: strings.context.notFound,
        loggedTime: null,
        controlType: strings.context.start,
      },
      {
        coordinate: { latitude: 0, longitude: 1 },
        mapLabel: '1',
        textLabel: '1',
        mapLabelBearing: 0,
        loggedTime: null,
        controlType: 'Control',
        status: strings.context.notFound,
      },
      {
        coordinate: { latitude: 0, longitude: 1 },
        mapLabel: '2',
        textLabel: '2',
        mapLabelBearing: 0,
        loggedTime: null,
        controlType: 'Control',
        status: strings.context.notFound,
      },
      {
        coordinate: { latitude: 0, longitude: 1 },
        mapLabel: '3',
        textLabel: '3',
        mapLabelBearing: 0,
        loggedTime: null,
        controlType: 'Control',
        status: strings.context.notFound,
      },
      {
        coordinate: { latitude: 0, longitude: 1 },
        mapLabel: '4',
        textLabel: '4',
        mapLabelBearing: 0,
        loggedTime: null,
        controlType: 'Control',
        status: strings.context.notFound,
      },
      {
        coordinate: { latitude: 0, longitude: 1 },
        mapLabel: '5',
        textLabel: '5',
        mapLabelBearing: 0,
        loggedTime: null,
        controlType: 'Control',
        status: strings.context.notFound,
      },
      {
        coordinate: { latitude: 0, longitude: 1 },
        mapLabel: '6',
        textLabel: '6',
        mapLabelBearing: 0,
        loggedTime: null,
        controlType: 'Control',
        status: strings.context.notFound,
      },
      {
        coordinate: { latitude: 0, longitude: 1 },
        mapLabel: '7',
        textLabel: '7',
        mapLabelBearing: 0,
        loggedTime: null,
        controlType: 'Control',
        status: strings.context.notFound,
      },
      {
        coordinate: { latitude: 0, longitude: 1 },
        mapLabel: '8',
        textLabel: '8',
        mapLabelBearing: 0,
        loggedTime: null,
        controlType: 'Control',
        status: strings.context.notFound,
      },
      {
        coordinate: { latitude: 0, longitude: 1 },
        mapLabel: '9',
        textLabel: '9',
        mapLabelBearing: 0,
        loggedTime: null,
        controlType: 'Control',
        status: strings.context.notFound,
      },
      {
        coordinate: { latitude: 0, longitude: 1 },
        mapLabel: '10',
        textLabel: '10',
        mapLabelBearing: 0,
        loggedTime: null,
        controlType: 'Control',
        status: strings.context.notFound,
      },
      {
        coordinate: { latitude: 1, longitude: 1 },
        mapLabel: '',
        textLabel: strings.context.finish,
        mapLabelBearing: 0,
        loggedTime: null,
        controlType: strings.context.finish,
        status: 'Not Found',
      }],
    courseImportedFromQRCode: {boundary:{},controls:{},courseType:{}},
    courseLengthInMeters: 0,
    courseType: "Standard",
    distanceIntervalInMeters: 2,
    distanceToNextControlInMeters: 1000,
    customMapStyle: CUSTOM_MAP_STYLE,
    hasAcceptedDisclaimer: false,    
    lastTimeSkippedFinished: Number.NEGATIVE_INFINITY,
    lastUserPathUpdateTime: Number.NEGATIVE_INFINITY,
    locationWatcher: null,
    mapType: 'standard',
    poleOfInaccessibilityLatitude: 0,
    poleOfInaccessibilityLongitude: 0,
    pollingIntervalInMilliseconds: 1500,
    randomness: 2000,
    recordingIntervalInMilliseconds: 1000,
    timesAround: 1,
    targetControlID: 1,
    targetCourseLengthInK: 3,
    targetCourseLengthToleranceInK: .05,
    units: 'km',
    userLocation: null,
    userPath: [],
    vibrate: true,
    winningDistanceInMeters: 15,
    toggleVibrate: () => {
      this.setState({ vibrate: !this.state.vibrate });
    },
    getNumberOfControls: () => {
      return this.state.controls.length
    },
    generateControlsFromCoordinates: (coordinates) => {
      let newControls = [];
      let controlType;
      let mapLabel;
      let textLabel;
      let numberOfControls = coordinates.length;

      coordinates.forEach((coordinate, index) => {

        if (index == 0) {
          controlType = strings.context.start,
            mapLabel = '';
          textLabel = strings.context.start;
        } else if (index == numberOfControls - 1) {
          controlType = strings.context.finish,
            mapLabel = '';
          textLabel = strings.context.finish;
        } else {
          controlType = 'Control',
            mapLabel = index
          textLabel = index
        }

        newControls.push(
          {
            coordinate: coordinate,
            controlType: controlType,
            mapLabel: mapLabel,
            textLabel: textLabel,
            loggedTime: null,
            mapLabelBearing: 0,
            status: strings.context.notFound,
          }
        )
      });
      return newControls
    },
    getBoundaryMaxLongitude: () => {
      if (this.state.boundaryCoordinates[0]) {
        let maxLongitude = this.state.boundaryCoordinates[0].longitude;

        this.state.boundaryCoordinates.forEach(boundaryCoordinate => {
          if (boundaryCoordinate.longitude > maxLongitude) { maxLongitude = boundaryCoordinate.longitude }
        })
        return maxLongitude;
      }
    },
    getBoundaryMaxLatitude: () => {
      if (this.state.boundaryCoordinates[0]) {
        let maxLatitude = this.state.boundaryCoordinates[0].latitude;

        this.state.boundaryCoordinates.forEach(boundaryCoordinate => {
          if (boundaryCoordinate.latitude > maxLatitude) { maxLatitude = boundaryCoordinate.latitude }
        })
        return maxLatitude;
      }
    },
    getBoundaryMinLongitude: () => {
      if (this.state.boundaryCoordinates[0]) {
        let minLongitude = this.state.boundaryCoordinates[0].longitude;

        this.state.boundaryCoordinates.forEach(boundaryCoordinate => {
          if (boundaryCoordinate.longitude < minLongitude) { minLongitude = boundaryCoordinate.longitude }
        })
        return minLongitude;
      }
    },
    getBoundaryMinLatitude: () => {
      if (this.state.boundaryCoordinates[0]) {
        let minLatitude = this.state.boundaryCoordinates[0].latitude;

        this.state.boundaryCoordinates.forEach(boundaryCoordinate => {
          if (boundaryCoordinate.latitude < minLatitude) { minLatitude = boundaryCoordinate.latitude }
        })
        return minLatitude;
      }
    },
    getBoundaryWidth: () => {
      return this.state.getBoundaryMaxLatitude() - this.state.getBoundaryMinLatitude()
    },
    getBoundaryHeight: () => {
      return this.state.getBoundaryMaxLongitude() - this.state.getBoundaryMinLongitude()
    },
    getBoundaryCenter: () => {
      let centerLatitude = (this.state.getBoundaryMinLatitude() + this.state.getBoundaryMaxLatitude()) / 2;
      let centerLongitude = (this.state.getBoundaryMinLongitude() + this.state.getBoundaryMaxLongitude()) / 2;
      return { latitude: centerLatitude, longitude: centerLongitude }
    },
    getCourseLengthInMiles: () => this.convertMetersToMiles(this.state.courseLengthInMeters),
    getCourseLengthInKilometers: () => this.convertMetersToKilometers(this.state.courseLengthInMeters),
    getDistanceBetweenControlsInMeters: (index1, index2) => {
      //TODO error checking if index is out of bounds
      let lat1 = this.state.controls[index1].coordinate.latitude
      let lon1 = this.state.controls[index1].coordinate.longitude
      let lat2 = this.state.controls[index2].coordinate.latitude
      let lon2 = this.state.controls[index2].coordinate.longitude

      return distance(lat1, lon1, lat2, lon2, 'meters');
    },
    getDistanceBetweenLogLocationsOfControlsInMeters: (index1, index2) => {
      //TODO error checking if index is out of bounds
      let lat1 = this.state.controls[index1].loggedCoordinates.latitude
      let lon1 = this.state.controls[index1].loggedCoordinates.longitude
      let lat2 = this.state.controls[index2].loggedCoordinates.latitude
      let lon2 = this.state.controls[index2].loggedCoordinates.longitude

      return distance(lat1, lon1, lat2, lon2, 'meters');
    },
    getDistanceBetweenLogLocationsOfControlsInFeet: (index1, index2) => {
      //TODO error checking if index is out of bounds
      return this.convertMetersToFeet(this.state.getDistanceBetweenLogLocationsOfControlsInMeters(index1, index2))
    },
    getDistanceBetweenControlsInFeet: (index1, index2) => {
      //TODO error checking if index is out of bounds
      return this.convertMetersToFeet(this.state.getDistanceBetweenControlsInMeters(index1, index2))
    },
    getLegLengthInMeters: (index) => {
      if (index == 0) {
        throw "getLegLengthInMeters called with index of 0. Expected > 0, as 0 corresponds with the starting control, and the associated leg for each control is the prior leg."
      }

      return this.state.getDistanceBetweenControlsInMeters(index, index - 1);
    },
    getLegLengthInFeet: (index) => {
      if (index == 0) {
        throw "getLegLengthInFeet called with index of 0. Expected > 0, as 0 corresponds with the starting control, and the associated leg for each control is the prior leg."
      }

      return this.convertMetersToFeet(this.state.getLegLengthInMeters(index))
    },
    getMapRegion: () => {
      if (this.state.boundaryCoordinates[0]) {
        let maxDelta = Math.max(this.state.getBoundaryWidth(), this.state.getBoundaryHeight());
        let center = this.state.getBoundaryCenter()
        let margin = .001

        return {
          latitude: center.latitude,
          longitude: center.longitude,
          latitudeDelta: maxDelta + margin,
          longitudeDelta: maxDelta + margin,
        }
      }
    },
    getNextControlToFindIndex: () => {
      let nextControlToFindIndex = 0;

      for (let [index, control] of this.state.controls.entries()) {
        if (control.loggedTime == null) {
          nextControlToFindIndex = index;
          break;
        }
      }
      return nextControlToFindIndex; //TODO doesn't actually make sense to return 0 when none found
    },
    hasLoggedARegularControl: () => {
      let hasLoggedARegularControl = false;
      this.state.controls.forEach((control) => {
        if (control.controlType == "Control" && (control.loggedTime != null)) {
          hasLoggedARegularControl = true;
        }
      })
      return hasLoggedARegularControl;
    },
    hasLoggedAllRegularControls: () => {
      let hasLoggedAllRegularControls = true;
      this.state.controls.forEach((control) => {
        if (control.controlType == "Control" && (control.loggedTime == null)) {
          hasLoggedAllRegularControls = false;
        }
      })
      return hasLoggedAllRegularControls;
    },
    getNumberOfRegularControls: () => {
      return (this.state.controls.length - 2);
    },
    getNumberOfFoundRegularControls: () => {
      let numberOfFoundRegularControls = 0;
      this.state.controls.forEach((control) => {
        if (control.controlType == "Control" && (control.status == strings.context.found)) {
          numberOfFoundRegularControls += 1; 
        }
      })

      return numberOfFoundRegularControls;
    },
    markControlAsFound: (index, time, coordinates) => {
      let newControls = JSON.parse(JSON.stringify(this.state.controls));
      newControls[index].loggedTime = time;
      newControls[index].loggedCoordinates = coordinates;
      newControls[index].status = strings.context.found;
      this.setState({ controls: newControls },
        () => {

          if (this.state.controls[index].controlType == "Start") {
            this.state.clearUserPath();
          }

          if (this.state.controls[index].controlType == "Control") {
            this.setState({ canFinishCourse: true })
            this.state.removeLastTimeSkippedFinish({ lastTimeSkippedFinished: null })
          }
        }
      )
      
      let milliseconds = new Date(time) 
      milliseconds = milliseconds.getTime()

      // console.log("time")
      // console.log(milliseconds)
      this.state.addToUserPath(coordinates,milliseconds)
      // TODO, investigate whether the start gets logged, or gets cleared

    },
    markControlAsSkipped: (index, time, coordinates, callback) => {
      // TODO write this - need to record that the control was skipped, when, and where
      let newControls = JSON.parse(JSON.stringify(this.state.controls));
      newControls[index].loggedTime = time;
      newControls[index].status = strings.context.skipped;
      newControls[index].skipLocation = this.userLocation; //TODO, shouldn't this be looking at userLocation.coords?  why doesn't that work?
      if (this.state.controls[index].controlType == "Control") {
        this.setState({ canFinishCourse: true }, this.setState({ controls: newControls }, callback))
      } else {
        this.setState({ controls: newControls }, callback)
      }
    },


    /*
    
    prepareControlDataForDrawingOnMap: (controls, scaleFactor) => {
      let context = this.state;
      
      if (!controls) { return; }

      var leg;
      var newLegs = [];
      var percentInsideCircle
      var legLengthInMeters = 0;
      var courseLengthInMeters = 0;

      var newControls = JSON.parse(JSON.stringify(controls));


      for (leg = 0; leg < controls.length; leg++) {

          if (leg < controls.length - 1) {

              legLengthInMeters = distance(controls[leg].coordinate.latitude, controls[leg].coordinate.longitude, controls[leg + 1].coordinate.latitude, controls[leg + 1].coordinate.longitude, "feet");
              courseLengthInMeters += legLengthInMeters;

              // console.log(this.state.scaleFactor)
              percentInsideCircle = scaleFactor * 40 / legLengthInMeters;

              newLegs.push(
                  {
                      "id": leg,
                      "coordinates":
                          [{
                              "latitude": percentInsideCircle * (controls[leg + 1].coordinate.latitude - controls[leg].coordinate.latitude) + controls[leg].coordinate.latitude,
                              "longitude": percentInsideCircle * (controls[leg + 1].coordinate.longitude - controls[leg].coordinate.longitude) + controls[leg].coordinate.longitude
                          }, {
                              "latitude": (1 - percentInsideCircle) * (controls[leg + 1].coordinate.latitude - controls[leg].coordinate.latitude) + controls[leg].coordinate.latitude,
                              "longitude": (1 - percentInsideCircle) * (controls[leg + 1].coordinate.longitude - controls[leg].coordinate.longitude) + controls[leg].coordinate.longitude
                          }]
                  }
              )
          }


          let priorControlID = (controls.length + leg - 1) % controls.length
          let currentControlID = leg
          let nextControlID = (leg + 1) % controls.length

          let ydiff = distance(context.boundaryCoordinates[0].latitude, context.boundaryCoordinates[0].longitude, context.boundaryCoordinates[0].latitude + .001, context.boundaryCoordinates[0].longitude, "meters")
          let xdiff = distance(context.boundaryCoordinates[0].latitude, context.boundaryCoordinates[0].longitude, context.boundaryCoordinates[0].latitude, context.boundaryCoordinates[0].longitude + .001, "meters")
          let scaleFactor = ydiff / xdiff;             //  TODO, add the scale factor to state

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

      
      context.updateControls(newControls);
      context.updateCourseLengthInMeters(courseLengthInMeters);
      return newLegs 
  },


*/


    updateActiveBoundaryIndex: (activeBoundaryIndex) => {
      this.setState({ activeBoundaryIndex: activeBoundaryIndex })
    },
    updateBoundaryCoordinates: (boundaryCoordinates) => {
      this.setState({ boundaryCoordinates: boundaryCoordinates })
    },
    updateCanFinishCourse: (canFinishCourse) => {
      this.setState({ canFinishCourse: canFinishCourse })
    },
    updateControls: (controls) => {
      this.setState({ controls: controls })
    },
    updateCourseLengthInMeters: (courseLengthInMeters) => {
      this.setState({ courseLengthInMeters: courseLengthInMeters })
    },
    updateCourseType: (courseType) => {
      this.setState({ courseType: courseType })
    },
    updateMostRecentCourseImportedFromQRCode: (boundary, controls, courseType) => {
      this.state.updateBoundaryCoordinates(boundary);
      this.state.updateControls(controls);
      this.state.updateCourseType(courseType);
      this.setState({ courseImportedFromQRCode: {boundary:boundary,controls:controls,courseType:courseType }});
    },
    currentCourseMatchesMostRecentCourseImportedFromQRCode: () => {

      return (
        this.state.courseImportedFromQRCode.boundary == this.state.boundaryCoordinates &&
        this.state.courseImportedFromQRCode.controls == this.state.controls &&
        this.state.courseImportedFromQRCode.courseType == this.state.courseType
      )
    },
    updateCustomMapStyle: (customMapStyle) => {
      this.setState({ customMapStyle: customMapStyle })
    },
    updateDistanceIntervalInMeters: (distanceIntervalInMeters) => {
      this.setState({ distanceIntervalInMeters: distanceIntervalInMeters })
    },
    updateDistanceToNextControlInMeters: (distanceToNextControlInMeters) => {
      this.setState({ distanceToNextControlInMeters: distanceToNextControlInMeters })
    },
    updateFinish: (coordinate) => {
      let newControls = JSON.parse(JSON.stringify(this.state.controls));
      newControls[this.state.controls.length - 1].coordinate = coordinate;
      this.setState({ controls: newControls })
    },
    updateHasAcceptedDisclaimer: (hasAcceptedDisclaimer) => {
      this.setState({ hasAcceptedDisclaimer: hasAcceptedDisclaimer })
    },
    removeLastTimeSkippedFinish: () => {
      this.setState({ lastTimeSkippedFinished: Number.NEGATIVE_INFINITY })
    },
    updateLastTimeSkippedFinished: () => {
      this.setState({ lastTimeSkippedFinished: Date.now() })
    },
    updateLocationWatcher: (locationWatcher) => {
      this.setState({locationWatcher:locationWatcher})
    },
    updateMapType: (mapType) => {
      this.setState({ mapType: mapType })
    },
    updateNumberOfControls: (numberOfRegularControls) => {

      let numberOfControls = numberOfRegularControls + 2;

      // console.log("numberOfControls"+numberOfControls)

      let newControls = JSON.parse(JSON.stringify(this.state.controls));

      if (numberOfControls == this.state.controls.length) {
        return;
      } else if (numberOfControls < this.state.controls.length) {

        let quantityToRemove = this.state.controls.length - numberOfControls;

        newControls.splice(-1 - quantityToRemove, quantityToRemove)

      } else {
        for (let index = this.state.controls.length - 1; index < numberOfControls - 1; index++) {
          newControls.splice(
            index,
            0,
            {
              controlType: 'Control',
              coordinate: { latitude: 0, longitude: 1 },
              loggedTime: null,
              mapLabel: '',
              mapLabelBearing: 0,
              textLabel: '',
              status: strings.context.notFound,
            })//TODO does it matter that we don't set the mapLabels and textLabels correctly here?
        }
      }
      this.setState({ controls: newControls })

    },
    updatePoleOfInaccessibilityLatitude: (poleOfInaccessibilityLatitude) => {
      this.setState({ poleOfInaccessibilityLatitude: poleOfInaccessibilityLatitude })
    },
    updatePoleOfInaccessibilityLongitude: (poleOfInaccessibilityLongitude) => {
      this.setState({ poleOfInaccessibilityLongitude: poleOfInaccessibilityLongitude })
    },
    updatePollingIntervalInMilliseconds: (pollingIntervalInMilliseconds) => {
      this.setState({ pollingIntervalInMilliseconds: pollingIntervalInMilliseconds })
    },
    updateRandomness: (randomness) => {
      this.setState({ randomness: randomness })
    },
    updateStart: (coordinate) => {
      let newControls = JSON.parse(JSON.stringify(this.state.controls));
      newControls[0].coordinate = coordinate;
      this.setState({ controls: newControls })
    },
    updateTargetControlID: (targetControlID) => {
      this.setState({ targetControlID: targetControlID })
    },
    updateTargetCourseLengthInK: (targetCourseLengthInK) => {
      this.setState({ targetCourseLengthInK: targetCourseLengthInK })
    },
    updateTimesAround: (timesAround) => {
      this.setState({ timesAround: timesAround })
    },
    updateUnits: (units) => {
      this.setState({ units: units })
    },
    addToUserPath: (coordinates,timestamp) => {
      let userPath = this.state.userPath
      userPath.push({latitude:coordinates.latitude,longitude:coordinates.longitude})

      
      // console.log("userPath")
      // console.log(userPath)

      this.setState({ userPath: userPath })
      this.setState({ lastUserPathUpdateTime: timestamp })
    },
    updateUserLocation: (userLocation) => {
      this.setState({ userLocation: userLocation })


      // console.log(userLocation.timestamp)
      //TODO add logic to only record the user location if they have found the start control

      
      if(userLocation.timestamp > this.state.lastUserPathUpdateTime + this.state.recordingIntervalInMilliseconds && userLocation.coords.accuracy < 15) {
        this.state.addToUserPath(userLocation.coords,userLocation.timestamp)
      }

      if (userLocation && this.state.courseType == "Standard") {
        this.state.updateDistanceToNextControlInMeters(
          distance(
            userLocation.coords.latitude, 
            userLocation.coords.longitude, 
            this.state.controls[this.state.getNextControlToFindIndex()].coordinate.latitude, 
            this.state.controls[this.state.getNextControlToFindIndex()].coordinate.longitude, 
            "meters"
            )
          );
    }

    },
    updateWinningDistanceInMeters: (winningDistanceInMeters, callback) => {
      this.setState({ winningDistanceInMeters: winningDistanceInMeters })
      if (callback) callback();
    },
    clearLoggedControls: () => {
      let newControls = JSON.parse(JSON.stringify(this.state.controls));

      newControls.forEach((newControl) => {
        newControl.loggedTime = null;
        delete newControl.loggedCoordinates;
        newControl.status = strings.context.notFound;
      })

      this.setState({ controls: newControls },
        () => {
          this.setState({ canFinishCourse: false });
          this.state.removeLastTimeSkippedFinish({ lastTimeSkippedFinished: null })
        })

    },
    clearUserPath: () => {
      this.setState({ userPath: [] })
    },
    cycleMapType: () => {
      if (this.state.mapType == 'satellite') {
        this.setState({ mapType: 'hybrid' })
        return
      }

      if (this.state.mapType == 'hybrid') {
        this.setState({ mapType: 'standard' })
        this.setState({ customMapStyle: [] })
        return
      }

      if (this.state.mapType == 'standard' && this.state.customMapStyle.length == 0) {
        this.setState({ customMapStyle: CUSTOM_MAP_STYLE })
        return
      }

      if (this.state.mapType == 'standard' && this.state.customMapStyle != 0) {
        this.setState({ mapType: 'terrain' })
        return
      }

      if (this.state.mapType == 'terrain') {
        this.setState({ mapType: 'satellite' })
        return
      }

      throw ("unknown mapType (please use satellite, hybrid, standard, or terrain)");
    },
    storeData: async () => {
      try {
        const jsonState = JSON.stringify(this.state)
        await AsyncStorage.setItem('@context', jsonState)
      } catch (e) {
        console.error(e)
      }
    },
    loadDataIntoState: async () => {
      try {
        const jsonState = await AsyncStorage.getItem('@context')
        if (jsonState != null) {
          this.setState({ ...JSON.parse(jsonState) });
        }
      } catch (e) {
        console.error(e)
      }
    },
  }

  convertMetersToMiles(meters) {
    return meters / 1609.344;
  }

  convertMetersToFeet(meters) {
    return this.convertMilesToFeet(this.convertMetersToMiles(meters));
  }

  convertMetersToKilometers(meters) {
    return meters / 1000;
  }

  convertMilesToKilometers(miles) {
    return miles * 1.609344;
  }

  convertMilesToFeet(miles) {
    return miles * 5280;
  }



  render() {
    return (
      <AppContext.Provider value={this.state} >
        { this.props.children}
      </AppContext.Provider>
    )
  }
}

export default SettingsContext;