
import { View, Text } from 'react-native';
import React, { Component } from 'react';

export class ExplainerItem extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <View style={{ flexDirection: 'row' }}>
                <View style={{ margin: 10 }}>
                    {this.props.icon}
                </View>
                <View style={{
                    flexDirection: 'column',
                    justifyContent: 'center',
                    flex: 1,
                }}>
                    <Text >
                        {this.props.text}
                    </Text >
                </View>
            </View>
        )
    }
}