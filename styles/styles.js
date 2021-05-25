import { StyleSheet, Dimensions } from 'react-native';

export const colors = {
  linkBlue: '#1559b7',
  orange: "#ef6c0c",
  purple: '#de519b',
  red: 'red',
  grey: 'grey',
  gray: 'grey',
  transparentWhite: '#fff8',
  white: 'white',
}

export const styles = StyleSheet.create({
  activeTabStyle: {
    backgroundColor: colors.orange
  },
  background: {
    flex: 1,
    paddingLeft: 20,
    paddingRight: 20,
    paddingBottom: 20,
    backgroundColor: '#eee'
  },
  barCodeScanner: {
    width: "100%",
    height: Dimensions.get('window').width,
  },
  button: {
    padding: 10,
    borderRadius: 5,
    height: 75,
    backgroundColor: colors.orange,
    textAlign: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 10,
  },
  buttonWithoutFixedHeight: {
    padding: 5,
    borderRadius: 20,
    backgroundColor: colors.orange,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 30,
    flex: 1,
  },
  buttonText: {
    fontSize: 26,
    color: 'white'
  },
  buttonWithoutFixedHeightText: {
    fontSize: 40,
    color: 'white'
  },
  centeredContainer: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  controlText: {
    fontSize: 25,
    color: '#de519b',
  },
  controlTextContainer: {
    backgroundColor: colors.transparentWhite,
    width: 34,
    height: 34,
    alignItems: 'center',
    borderRadius: 4,
    justifyContent: 'center',

  },
  controlTextContainerActive: {
    backgroundColor: "#fffd",
    width: 36,
    height: 36,
    alignItems: 'center',
    borderRadius: 4,
    justifyContent: 'center',
    borderColor: "black",
    borderWidth: 2,
  },
  disclaimerText: {
    margin: 10,
    fontSize: 18,
  },
  disclaimerTextSmall: {
    margin: 10,
    fontSize: 14,
  },
  controlLoggedText: {
    fontSize: 25,
    color: '#888',
  },
  image: {
    resizeMode: 'contain',
    height: 400,
    width: 300
  },
  mapBottomContainer: {
      position: 'absolute',//use absolute position to show button on top of the map
      bottom: 25,
      alignSelf: 'center',
      flexDirection: 'row',
  },
  mapBottomRightContainer: {
    position: 'absolute',//use absolute position to show button on top of the map
    bottom: 25,
    alignSelf: 'flex-end',
    flexDirection: 'row',
},
  mapTextContainer: {
    position: 'absolute',//use absolute position to show button on top of the map
    alignSelf: 'center',
    backgroundColor: '#fffa',
    margin: 10,
    borderRadius: 5,
    padding: 10,
    height: 50,
    justifyContent: 'center',
  },
  mapText: {
    fontSize: 25,
  },
  mapLoadingTextContainer: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapStyle: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height - 80,
  },
  slider: {
    width: "100%",
    marginLeft: 10,
    marginRight: 10,
  },
  splashContainer: {
    flex: 1,
    margin: 20,
    justifyContent: 'flex-end'
  },
  tabsContainerStyle: {
    height: 50,
    marginBottom: 10
  },
  tabTextStyle: {
    fontSize: 30,
    color: colors.orange
  },
  tabStyle: {
    borderColor: colors.orange
  },
  text: {
    color: 'black',
    fontSize: 20,
    marginTop: 10,
    marginLeft: 10,
    marginRight: 10,
  },

  tableContainer: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'white'
  },
  tableHead: {
    height: 40,
    backgroundColor: '#ef6c0c'
  },
  tableHeaderText: {
    textAlign: 'center',
    color: "white"
  },
  tableWrapper: { flexDirection: 'row' },
  tableDataWrapper: { marginTop: -1 },
  tableTitle: { flex: 1, backgroundColor: '#f6f8fa' },
  tableRow: { height: 28 },
  tableText: { textAlign: 'center' }
},
);

export const CUSTOM_MAP_STYLE = [
  {
    "elementType": "labels",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "administrative",
    "elementType": "geometry.stroke",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "landscape.man_made",
    "elementType": "geometry.fill",
    "stylers": [
      {
        "color": "#f5bf64"
      }
    ]
  },
  {
    "featureType": "landscape.man_made",
    "elementType": "geometry.stroke",
    "stylers": [
      {
        "color": "#000000"
      }
    ]
  },
  {
    "featureType": "poi",
    "elementType": "geometry.fill",
    "stylers": [
      {
        "color": "#f5bf64"
      }
    ]
  },
  {
    "featureType": "poi.attraction",
    "elementType": "geometry.fill",
    "stylers": [
      {
        "color": "#f5bf64"
      }
    ]
  },
  {
    "featureType": "poi.business",
    "elementType": "geometry.fill",
    "stylers": [
      {
        "color": "#f5bf64"
      }
    ]
  },
  {
    "featureType": "poi.medical",
    "elementType": "geometry.fill",
    "stylers": [
      {
        "color": "#f5bf64"
      }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "geometry.fill",
    "stylers": [
      {
        "color": "#ddebda"
      }
    ]
  },
  {
    "featureType": "poi.school",
    "elementType": "geometry.fill",
    "stylers": [
      {
        "color": "#f5bf64"
      }
    ]
  },
  {
    "featureType": "poi.sports_complex",
    "elementType": "geometry.fill",
    "stylers": [
      {
        "color": "#f5bf64"
      }
    ]
  },
  {
    "featureType": "road",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#000000"
      }
    ]
  },
  {
    "featureType": "road",
    "elementType": "geometry.fill",
    "stylers": [
      {
        "color": "#dfb194"
      }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "geometry.fill",
    "stylers": [
      {
        "color": "#dfb194"
      }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "geometry.stroke",
    "stylers": [
      {
        "color": "#000000"
      }
    ]
  },
  {
    "featureType": "road.local",
    "elementType": "geometry.stroke",
    "stylers": [
      {
        "color": "#000000"
      }
    ]
  },
  {
    "featureType": "transit.line",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#000000"
      }
    ]
  },
  {
    "featureType": "transit.station",
    "elementType": "geometry.fill",
    "stylers": [
      {
        "color": "#f5bf64"
      }
    ]
  },
  {
    "featureType": "transit.station",
    "elementType": "geometry.stroke",
    "stylers": [
      {
        "color": "#000000"
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "geometry.fill",
    "stylers": [
      {
        "color": "#94c2e7"
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "geometry.stroke",
    "stylers": [
      {
        "color": "#000000"
      }
    ]
  }
]

/*
  const white = {
    maxLegLengthInMeters: 400,
    minDistanceinKilometers: 2,
    maxDistanceInKilometers: 4,
  };
  const yellow = {
    maxLegLengthInMeters: 600,
    minDistanceinKilometers: 3,
    maxDistanceInKilometers: 5,
    typicalLegLengthMinimumInMeters: 200,
    typicalLegLengthMaximumInMeters: 400,
  };
  const orange = {
    minDistanceinKilometers: 4.5,
    maxDistanceInKilometers: 7,
  };
  const brown = {
    minimumLongestLegInMeters: 800
  }
  const green = {
    minimumLongestLegInMeters: 800
  }
  const red = {
    minimumLongestLegInMeters: 800
  }
  const blue = {
    minimumLongestLegInMeters: 800
  }
*/