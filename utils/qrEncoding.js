export function encode(boundary, controls, courseType) {
    let minLatitude = Infinity;
    let minLongitude = Infinity;
    
    boundary.forEach(boundaryPoint => {
        minLatitude = Math.min(boundaryPoint.latitude, minLatitude)
        minLongitude = Math.min(boundaryPoint.longitude, minLongitude)
    });

    controls.forEach(control => {
        minLatitude = Math.min(control.coordinate.latitude, minLatitude)
        minLongitude = Math.min(control.coordinate.longitude, minLongitude)
    });

    let base9CoordinateArray = [
        encodeCoordinate(minLatitude + 90),
        encodeCoordinate(minLongitude + 180)
    ];

    boundary.map((boundaryCoordinate) => {
        base9CoordinateArray.push(encodeCoordinate(boundaryCoordinate.latitude - minLatitude))
        base9CoordinateArray.push(encodeCoordinate(boundaryCoordinate.longitude - minLongitude))
    })

    base9CoordinateArray.push(9)

    controls.map((control) => {
        base9CoordinateArray.push(encodeCoordinate(control.coordinate.latitude - minLatitude))
        base9CoordinateArray.push(encodeCoordinate(control.coordinate.longitude - minLongitude))
        //TODO add points here for Score-Os
    })


    let base9ExportableControls = JSON.stringify(base9CoordinateArray).replace(/\[/g, "").replace(/\]/g, "").replace(/,/g, "9")

    return addHeader(base9ExportableControls, courseType)
}

function addHeader(encodedString, courseType) {
    let encodingType = courseType == "Standard" ? "0" : "1";

    return encodingType + encodedString
}

function encodeCoordinate(coordinate) {
    return parseInt(Math.round(coordinate * 10000000).toString(9), 10);
}

function decodeCoordinate(coordinate) {
    return parseInt(coordinate, 9) / 10000000;
}

export function decode(encodedData) {

    if(encodedData.substr(0,1) != "0" && encodedData.substr(0,1) != "1") {
        throw 'Unknown Encoding Type.  Expected "0" or "1"'
    } 

    let courseType = encodedData.substr(0,1) == "0" ? "Standard" : "Score-O";

    let encodedControls = encodedData.slice(1);

    let base9CoordinateArrayFlat = JSON.parse("[[" + encodedControls.replace(/999/g, "],[").replace(/9/g, ",") + "]]")

    let base9BoundaryArray = [];
    let base9ControlArray = [];

    if (base9CoordinateArrayFlat.length % 2 != 0) {
        throw "Expected base9ControlArrayFlat's length to be a multiple of 2"
    }

    let minLatitude = decodeCoordinate(base9CoordinateArrayFlat[0].shift()) - 90;
    let minLongitude = decodeCoordinate(base9CoordinateArrayFlat[0].shift()) - 180;

    while (base9CoordinateArrayFlat[0].length > 0) {
        base9BoundaryArray.push(
            [decodeCoordinate(base9CoordinateArrayFlat[0].shift()) + minLatitude,
            decodeCoordinate(base9CoordinateArrayFlat[0].shift()) + minLongitude]);
    }

    while (base9CoordinateArrayFlat[1].length > 0) {
        base9ControlArray.push(
            [decodeCoordinate(base9CoordinateArrayFlat[1].shift()) + minLatitude,
            decodeCoordinate(base9CoordinateArrayFlat[1].shift()) + minLongitude
            //TODO add points here for Score-Os
        ]);
    }

    let base10BoundaryArray = [];
    let base10ControlArray = [];

    base9BoundaryArray.map((control) => {
        base10BoundaryArray.push({
            latitude: control[0],
            longitude: control[1],
        })
    })

    base9ControlArray.map((control) => {
        base10ControlArray.push({
            latitude: control[0],
            longitude: control[1],
        })
    })

    return {boundary:base10BoundaryArray, controls:base10ControlArray, courseType:courseType}
}
