import { AppContext } from '../context';
import { SafeAreaView, } from 'react-native-safe-area-context';
import { styles } from '../styles/styles';
import { ScrollView, Text, TouchableOpacity, Vibration, View, } from 'react-native';
import React, { Component } from 'react';
import SvgQRCode from 'react-native-qrcode-svg';
import { encode } from '../utils/qrEncoding'

export class ExportQR extends Component {
    constructor(props) {
        super(props);
    }

    render() {

        let context = this.context;

        return (
            <SafeAreaView style={{
                alignItems: 'center',
                display: "flex",
                flex: 1,
            }}
            >
                <ScrollView>
                    <SvgQRCode value={encode(context.boundaryCoordinates, context.controls, context.courseType)} size={300} ecl={'L'} />
                </ScrollView>

            </SafeAreaView>
        )
    }
}

ExportQR.contextType = AppContext;