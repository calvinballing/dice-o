import { Marker } from 'react-native-maps';
import React, { Component } from 'react';
//https://github.com/react-native-maps/react-native-maps/issues/2658

export class CustomMarker extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tracksViewChanges: false,
        }
    }

    componentDidUpdate(prevProps) {
        if (prevProps.coordinate !== this.props.coordinate // set true only when props changed
            ) {
            this.setState({ tracksViewChanges: true })
        } else if (this.state.tracksViewChanges) {
            // set to false immediately after rendering with tracksViewChanges is true
            this.setState({ tracksViewChanges: false })
        }
    }

    render() {
        return (
            <Marker
                draggable={this.props.draggable}
                coordinate={this.props.coordinate}
                onPress={this.props.onPressMarker}
                key={this.props.id}
                onDragEnd={this.props.onDragEnd}
                anchor={this.props.anchor}
                tracksViewChanges={Platform.OS === 'ios' ? true : this.state.tracksViewChanges}
            >
                {this.props.children}
            </Marker>
        )
    }
}