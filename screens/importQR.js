import { AppContext } from '../context';
import { SafeAreaView, } from 'react-native-safe-area-context';
import { styles } from '../styles/styles';
import { ScrollView, Text, View } from 'react-native';
import React, { Component } from 'react';
import { decode } from '../utils/qrEncoding'
import { BarCodeScanner } from 'expo-barcode-scanner'
import { StyleSheet, Dimensions } from 'react-native';

import * as Permissions from 'expo-permissions';
import { Camera } from 'expo-camera';
import { strings } from '../strings';

export class ImportQR extends Component {
    state = {
        hasCameraPermission: null,
        scanned: false,
    };

    async componentDidMount() {
        this.getPermissionsAsync();
    }

    getPermissionsAsync = async () => {
        const { status } = await Camera.requestPermissionsAsync();
        this.setState({ hasCameraPermission: status === 'granted' });
    }

    render() {
        const { hasCameraPermission, scanned } = this.state;

        if (hasCameraPermission === null) {
            return <Text>{strings.permissions.requestingCamera}</Text>;
        }
        if (hasCameraPermission === false) {
            return <Text>{strings.permissions.noCamera}</Text>;
        }

        return (

            <SafeAreaView style={{
                alignItems: 'center',
                display: "flex",
                flex: 1,

                //flexDirection: 'column',
                justifyContent: 'center',
            }}
            >
                <Camera
                    onBarCodeScanned={scanned ? undefined : this.handleBarCodeScanned}
                    style={styles.barCodeScanner}
                    //https://github.com/expo/expo/issues/5212
                    //I made this square, because it was distorted when I initially tried to make it full screen
                    //https://docs.expo.io/versions/latest/sdk/camera/
                    //TODO Investigate iOS Landscape preview rotation: https://github.com/expo/expo/issues/1411
                    ratio="1:1"
                    type={Camera.Constants.Type.back}
                    barCodeScannerSettings={{
                        barCodeTypes: [BarCodeScanner.Constants.BarCodeType.qr],
                    }}
                />
                {scanned && 
                <View></View>
                //Can display an element optionally after scan by inserting it in the view above.
                //TODO Might be useful for error checking if an invalid course is scanned.
                //Need to add validation around invalid QR codes
                }

            </SafeAreaView>

        );
    }

    handleBarCodeScanned = ({ type, data }) => {

        let context = this.context;

        this.setState({ scanned: true });

        this.props.navigation.pop()
        this.props.navigation.push('SetBoundary')
        this.props.navigation.push('SetStart')
        this.props.navigation.push('SetFinish')
        this.props.navigation.push('SetCourse')
        
        let decodedData = decode(data);
        context.updateBoundaryCoordinates(decodedData.boundary);
        context.updateControls(context.generateControlsFromCoordinates(decodedData.controls));
        context.updateCourseType(decodedData.courseType);
    };
}

ImportQR.contextType = AppContext;