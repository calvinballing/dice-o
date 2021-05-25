import { AppContext } from '../context';
import { Row, Table } from 'react-native-table-component';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView, Share, StyleSheet, Text, View } from 'react-native';
import { strings } from '../strings';
import { styles } from '../styles/styles';
import { TouchableOpacity } from 'react-native';
import 'intl';
import React, { Component } from 'react';

export class Results extends Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }

    onShare = async () => {
        let context = this.context;

        try {

            let shareMessage = context.courseType == "Standard" ? strings.share.standardPart1 + context.getCourseLengthInKilometers().toFixed(2) + strings.share.standardPart2 : strings.share.scoreOPart1
s
            const result = await Share.share({
                message: shareMessage,
            });
            if (result.action === Share.sharedAction) {
                if (result.activityType) {
                    // shared with activity type of result.activityType
                } else {
                    // shared
                }
            } else if (result.action === Share.dismissedAction) {
                // dismissed
            }
        } catch (error) {
            alert(error.message);
        }
    };

    sortForResultsTable = (controls) => {

        //TODO Figure out what on the results table is dependent on the user's location such that it keeps rerendering after every location update

        let controlsToSort = JSON.parse(JSON.stringify(controls))

        controlsToSort.forEach((control, index) => {
            control.originalIndex = index;
        })

        let sortedControls = controlsToSort.sort(function(a,b) {
            if (a.status == "Found" && b.status != "Found") {
                return -1;
            } else if (a.status != "Found" && b.status == "Found") {
                return 1;
            } else if (a.status == "Found" && b.status == "Found") {
                return new Date(a.loggedTime) - new Date(b.loggedTime) 
            } else if (a.status != "Found" && b.status != "Found") {
                return 0;
            }

        });

        return sortedControls;
    }

    render() {
        let context = this.context;

        let smallUnits = context.units == "km" ? "meters" : "feet";

        let tableHead = [
            strings.results.control,
            strings.results.absoluteTime,
            strings.results.elapsedTime,
            strings.results.legTime,
            strings.results.distancePart1 + smallUnits + strings.results.distancePart2,
            strings.results.pace,
            strings.results.status,
        ];
        let tableTitle = []
        let tableData = []
        let widthArr = [55, 90, 65, 50, 65, 75, 75]
        
        let controlsSortedForResultsTable = this.sortForResultsTable(context.controls);
        let startTime = new Date(controlsSortedForResultsTable[0].loggedTime)

        controlsSortedForResultsTable.map((control, index) => {
            tableTitle[index] = control.textLabel;
            let thisControlTime = new Date(control.loggedTime);
            let totalElapsedTime = new Date(thisControlTime - startTime);

            let totalElapsedCharsToShow = 4


            let millisecondsPerSecond = 1000;
            let displayTensOfMinutesThreshold = ( 10 * 60 - 0.5 ) * millisecondsPerSecond
            let displayHoursThreshold = ( 60 * 60 - 0.5 ) * millisecondsPerSecond


            let totalElapsedTimeAtLeastTenMinutes = totalElapsedTime >= displayTensOfMinutesThreshold
            if (totalElapsedTimeAtLeastTenMinutes) {
                totalElapsedCharsToShow = 5
                let totalElapsedTimeAtLeastAnHour = totalElapsedTime >= displayHoursThreshold
                if (totalElapsedTimeAtLeastAnHour) {
                    totalElapsedCharsToShow = 7
                }
            }

            let legElapsedTimeString = strings.results.na;
            let legLengthInSmallUnitsFormatted = strings.results.na;
            let absoluteTimeToDisplay =  strings.results.na;
            let totalElapsedTimeToDisplay =  strings.results.na;
            let paceFormatted =  strings.results.na;

            if (index > 0 && control.status == "Found") {
                let priorControlIndex = index - 1;
                let priorControlTime = new Date(controlsSortedForResultsTable[priorControlIndex].loggedTime)
                let legElapsedTime = new Date(thisControlTime - priorControlTime);

                let charsToShow = 4

                let legElapsedTimeAtLeastTenMinutes = legElapsedTime >= displayTensOfMinutesThreshold
                if (legElapsedTimeAtLeastTenMinutes) {
                    charsToShow = 5
                    let legElapsedTimeAtLeastAnHour = legElapsedTime >=  displayHoursThreshold
                    if (legElapsedTimeAtLeastAnHour) {
                        charsToShow = 7
                    }
                }

                legElapsedTimeString = legElapsedTime.toUTCString().substr(25 - charsToShow, charsToShow);

                let legLengthInSmallUnits;
                let pace;

                if (smallUnits == 'meters') {
                    legLengthInSmallUnits = context.getDistanceBetweenControlsInMeters(control.originalIndex, controlsSortedForResultsTable[priorControlIndex].originalIndex);
                    pace = new Date((legElapsedTime ) / (legLengthInSmallUnits/1000));
                    paceFormatted = pace.toUTCString().substr(25 - charsToShow, charsToShow) + '/km';
                } else if (smallUnits == 'feet') {
                    legLengthInSmallUnits = context.getDistanceBetweenControlsInFeet(control.originalIndex, controlsSortedForResultsTable[priorControlIndex].originalIndex);
                    pace = new Date((legElapsedTime ) / (legLengthInSmallUnits/5280));
                    paceFormatted = pace.toUTCString().substr(25 - charsToShow, charsToShow) + '/mi';
                } else {
                    throw 'smallUnits type not found.  Expected "meters" or "feet" but received ' + smallUnits
                }

                legLengthInSmallUnitsFormatted = new Intl.NumberFormat('en-US').format(Math.round(legLengthInSmallUnits));
                

            }

            //TODO may want to handle skipped and not found differently
            if (control.status == "Found") {
                absoluteTimeToDisplay = new Date(control.loggedTime).toLocaleTimeString();
                totalElapsedTimeToDisplay =  totalElapsedTime.toUTCString().substr(25 - totalElapsedCharsToShow, totalElapsedCharsToShow);
            }

            tableData[index] = [
                control.textLabel, 
                absoluteTimeToDisplay, 
                totalElapsedTimeToDisplay, 
                legElapsedTimeString, 
                legLengthInSmallUnitsFormatted, 
                paceFormatted, 
                control.status
            ];

        })

        return (
            <SafeAreaView style={styles.background}>
                <View style={styles.tableContainer}>
                    <ScrollView horizontal={true}>
                        <View>
                            <Table borderStyle={{ borderWidth: 1 }}>
                                <Row data={tableHead} widthArr={widthArr} style={styles.tableHead} textStyle={styles.tableHeaderText} />
                            </Table>
                            <ScrollView style={styles.tableDataWrapper}>
                                <Table borderStyle={{ borderWidth: 1 }}>
                                    {
                                        tableData.map((rowData, index) => (
                                            <Row
                                                key={index}
                                                data={rowData}
                                                widthArr={widthArr}
                                                style={[styles.tableRow, index % 2 && { backgroundColor: '#FDF0E6' }, rowData[6] != "Found" && { backgroundColor: '#999' }]}
                                                textStyle={styles.tableText}
                                            />
                                        ))
                                    }
                                </Table>
                            </ScrollView>
                        </View>
                    </ScrollView>
                </View>
                <View style={styles.centeredContainer}>
                    <Text style={styles.text}>{strings.results.youDidIt}</Text>
                    <View style={{ flexDirection: 'row' }}>
                        <View style={{ flex: 1 }}>
                            <TouchableOpacity style={styles.button} onPress={this.onShare} ><Text style={styles.buttonText}>Share Result</Text></TouchableOpacity>
                        </View>
                        <View style={{ flex: 1 }}>
                            <TouchableOpacity
                                onPress={() => this.props.navigation.popToTop()}
                                style={styles.button}>
                                <Text style={styles.buttonText}>{strings.results.done}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </SafeAreaView>
        )
    }
}

Results.contextType = AppContext;