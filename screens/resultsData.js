import { AppContext } from '../context';
import { Row, Table } from 'react-native-table-component';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView, Share, Text, View } from 'react-native';
import { strings } from '../strings';
import { styles } from '../styles/styles';
import { TouchableOpacity } from 'react-native';
import 'intl';
import React, { Component } from 'react';

const millisecondsPerSecond = 1000;
const displayTensOfMinutesThreshold = ( 10 * 60 - 0.5 ) * millisecondsPerSecond
const displayHoursThreshold = ( 60 * 60 - 0.5 ) * millisecondsPerSecond
export class ResultsData extends Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }

    componentDidMount() {
        if (this.context.locationWatcher) {
            this.context.locationWatcher.remove()
        }
    }

    //Expects 'meters' or 'feet' 
    onShare = async (distance, smallUnits) => {
        let context = this.context;

        try {
            let courseType = context.courseType == 'Standard' ? strings.share.standard : strings.share.scoreO
            let distanceString = smallUnits == 'meters' ? (distance/1000).toFixed(2) + ' kilometers' : (distance/5280).toFixed(2) + ' miles' ;

            let shareMessage;

            if (distance == 0) {
                shareMessage = strings.share.zeroDistance
            } else {
                shareMessage = strings.share.part1 + courseType + strings.share.part2 + distanceString + strings.share.part3
            }

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

    timeToMinutesAndSecondsString = (time) => {
        let charsToShow = 4
        if (time >= displayTensOfMinutesThreshold) {
            charsToShow = 5
            if (time >=  displayHoursThreshold) {
                charsToShow = 7
            }
        }

        return time.toUTCString().substr(25 - charsToShow, charsToShow);
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

        let totalStraightLineDistanceInSmallUnits = 0;
        let foundControlCount = controlsSortedForResultsTable[0].status == "Found" ? 1 : 0;
        let maxElapsedTime = new Date();

        controlsSortedForResultsTable.map((control, index) => {
            tableTitle[index] = control.textLabel;
            let thisControlTime = new Date(control.loggedTime);
            let totalElapsedTime = new Date(thisControlTime - startTime);

            let totalElapsedCharsToShow = 4

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
                maxElapsedTime = totalElapsedTime;
                foundControlCount += 1;
                let priorControlIndex = index - 1;
                let priorControlTime = new Date(controlsSortedForResultsTable[priorControlIndex].loggedTime)
                let legElapsedTime = new Date(thisControlTime - priorControlTime);

                legElapsedTimeString = this.timeToMinutesAndSecondsString(legElapsedTime)

                let legLengthInSmallUnits;
                let pace;

                if (smallUnits == 'meters') {
                    legLengthInSmallUnits = context.getDistanceBetweenLogLocationsOfControlsInMeters(control.originalIndex, controlsSortedForResultsTable[priorControlIndex].originalIndex);
                    pace = new Date((legElapsedTime ) / (legLengthInSmallUnits/1000));
                    paceFormatted = this.timeToMinutesAndSecondsString(pace) + '/km';
                } else if (smallUnits == 'feet') {
                    legLengthInSmallUnits = context.getDistanceBetweenLogLocationsOfControlsInFeet(control.originalIndex, controlsSortedForResultsTable[priorControlIndex].originalIndex);
                    pace = new Date((legElapsedTime ) / (legLengthInSmallUnits/5280));
                    paceFormatted = this.timeToMinutesAndSecondsString(pace) + '/mi';
                } else {
                    throw 'smallUnits type not found.  Expected "meters" or "feet" but received ' + smallUnits
                }

                totalStraightLineDistanceInSmallUnits += legLengthInSmallUnits;
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

        let totalStraightLineDistanceInSmallUnitsFormatted = new Intl.NumberFormat('en-US').format(Math.round(totalStraightLineDistanceInSmallUnits));
        let maxElapsedTimeFormatted = this.timeToMinutesAndSecondsString(maxElapsedTime);

        let totalPace, totalPaceFormatted;

        if (smallUnits == 'meters') {
            totalPace = new Date((maxElapsedTime ) / (totalStraightLineDistanceInSmallUnits/1000));
            totalPaceFormatted = this.timeToMinutesAndSecondsString(totalPace) + '/km';
        } else if (smallUnits == 'feet') {
            totalPace = new Date((maxElapsedTime ) / (totalStraightLineDistanceInSmallUnits/5280));
            totalPaceFormatted = this.timeToMinutesAndSecondsString(totalPace) + '/mi';
        } else {
            throw 'smallUnits type not found.  Expected "meters" or "feet" but received ' + smallUnits
        }

        let totalData = [
            strings.results.totals, 
            strings.results.na, 
            maxElapsedTimeFormatted, 
            strings.results.na, 
            totalStraightLineDistanceInSmallUnitsFormatted, 
            totalPaceFormatted, 
            foundControlCount + '/' + context.controls.length,
        ];


        return (
            <SafeAreaView style={styles.background}>
                <View style={styles.tableContainer}>
                    <ScrollView horizontal={true}>
                        <View>
                            <Table borderStyle={{ borderWidth: 1 }} style={{marginBottom:2}}>
                                <Row data={tableHead} widthArr={widthArr} style={styles.tableHead} textStyle={styles.tableHeaderText} />
                            </Table>
                            <ScrollView style={styles.tableDataWrapper}>
                                <Table borderStyle={{ borderWidth: 1 }}>
                                    <Row
                                                key={'totalRow'}
                                                data={totalData}
                                                widthArr={widthArr}
                                                style={[styles.tableRow, {backgroundColor: '#FDF0E6', borderBottomWidth:2, borderTopWidth:2}]}
                                                textStyle={styles.tableText}
                                            />
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
                    {totalStraightLineDistanceInSmallUnits > 0 && <Text style={styles.text}>{strings.results.youDidIt}</Text>}
                    <View style={{ flexDirection: 'row' }}>
                        <View style={{ flex: 1 }}>
                            <TouchableOpacity style={styles.button} onPress={() => this.onShare(totalStraightLineDistanceInSmallUnits, smallUnits)} ><Text style={styles.buttonText}>{strings.share.share}</Text></TouchableOpacity>
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

ResultsData.contextType = AppContext;
