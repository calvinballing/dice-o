import { AppContext } from '../context';
import { Control } from '../assets/svgs';
import { SafeAreaView } from 'react-native-safe-area-context';
import { styles } from '../styles/styles';
import { Text, TouchableOpacity, Vibration, View, } from 'react-native';
import React, { Component } from 'react';
import { strings } from '../strings';


export class ControlLogged extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        if (this.context.vibrate) { Vibration.vibrate() };
    }

    handleOnPress() {
        let context = this.context
        if (context.controls[this.props.route.params.controlIndex].controlType == "Finish") { //TODO fix
            this.props.navigation.navigate("Results")
        }
        else { this.props.navigation.pop() }
    }

    render() {
        let context = this.context;

       // console.log(this.props.route.params.controlIndex)
       // console.log(JSON.stringify(context.controls))
       // console.log(JSON.stringify(context.controls[this.props.route.params.controlIndex]))
       // console.log(JSON.stringify(context.controls[this.props.route.params.controlIndex].controlType))

        let CTAtext = context.controls[this.props.route.params.controlIndex].controlType == "Finish" ? strings.controlLogged.seeResults : strings.continue

        return (
            <SafeAreaView style={{
                //styles.background
                alignItems: 'center',
                display: "flex",
                flex: 1,
            }}
            >
                <View style={{flex:1, flexDirection:"row", marginTop:20, marginLeft:20, marginRight:20}}>
                    <Control height="100%" width="100%" text={context.controls[this.props.route.params.controlIndex].textLabel} />
                </View>
                <View
                    style={{
                        flexDirection: 'row',
                        flex: 1,
                    }}
                >
                    <TouchableOpacity
                        style={styles.buttonWithoutFixedHeight}
                        onPress={() => this.handleOnPress()}
                    >
                        <Text style={styles.buttonWithoutFixedHeightText}>
                            {CTAtext}
                        </Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        )
    }
}

ControlLogged.contextType = AppContext;