import { AppContext } from '../context';
import { colors } from '../styles/styles';
import { Polyline } from 'react-native-maps';
import { View } from 'react-native';
import React, { Component } from 'react';

export class CourseBoundary extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        let context = this.context;
        return (
            <View>
                <Polyline
                    coordinates={[...context.boundaryCoordinates, context.boundaryCoordinates[0]]}
                    key={"bg" + JSON.stringify(context.boundaryCoordinates)}
                    lineDashPattern={[8, 2]}
                    strokeColor={colors.white}
                    strokeWidth={4}
                //TODO consider modifying this to shade outside of the course boundary
                >
                </Polyline>
                <Polyline
                    coordinates={[...context.boundaryCoordinates, context.boundaryCoordinates[0]]}
                    key={JSON.stringify(context.boundaryCoordinates)}
                    lineDashPattern={[8, 2]}
                    strokeColor={colors.purple}
                    strokeWidth={2}
                //TODO consider modifying this to shade outside of the course boundary
                >
                </Polyline>
            </View>
        )
    }
}

CourseBoundary.contextType = AppContext;