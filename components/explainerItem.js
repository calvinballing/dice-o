
import { View, Text } from 'react-native';
import React, { Component } from 'react';

export class ExplainerItem extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <View>
                {this.props.title && <Text
                    style={{
                        fontWeight: 'bold',
                        marginTop: 20,
                        fontSize: 18,
                    }}
                >
                    {this.props.title}
                </Text >
                }
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
            </View>
        )
    }
}