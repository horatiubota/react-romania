import React, { Component } from 'react'
import BaseMap from './components/BaseMap'

import PropTypes from 'prop-types';

// geoData
import romania from './data/romania.geo.js'
import cities from './data/romania.cities.geo.js'
import atus from './data/romania.atus.simple.geo.js'
import neighbourhoods from './data/romania.neighbourhoods.geo.js'

const filterPoints = (points, props) => {

    if (props.pointNames && props.pointNames.length) {
        points = points.filter(point => 
            props.pointNames.indexOf(point.properties.name) >= 0)
    }

    if (props.pointTypes && props.pointTypes.length) {
        points = points.filter(point => 
            props.pointTypes.indexOf(point.properties.type) >= 0)
    }

    if (props.countyId) {
        points = points.filter(point => props.countyId === point.properties.countyId);
    }

    return points
}

function DefaultTooltip(props) {
    return <div style={{display: 'inline-block', background: 'white'}}>
        <table> 
            <tr><td>{props.id}</td>
                <td>{props.value}</td>
            </tr>
        </table>
    </div>
}

function MapOfRomanianCity(props) {
    
    const cityGeoData = {
        features: neighbourhoods.features.filter(
            neighbourhood => neighbourhood.properties.atuId == props.atuId),
        type: 'FeatureCollection'
    }

    return <BaseMap
        primaryGeoData={cityGeoData}
        {...props}/>;
}

function MapOfRomanianCounty(props) {
    
    const pointGeoData = filterPoints(cities.features, props);
    const countyGeoData = {
        features: atus.features.filter(atu => atu.properties.countyId == props.countyId),
        type: 'FeatureCollection'
    }

    return <BaseMap
        primaryGeoData={countyGeoData}
        pointGeoData={pointGeoData}
        {...props}/>;
}

function MapOfRomania(props) {

    const pointGeoData = filterPoints(cities.features, props);
        
    return <BaseMap 
        primaryGeoData={romania} 
        secondaryGeoData={atus} 
        pointGeoData={pointGeoData}
        {...props}/>;
}

MapOfRomania.propTypes = {
    onClick: PropTypes.func,
    onMouseOver: PropTypes.func,
    onMouseOut: PropTypes.func,
    tooltip: PropTypes.func
};

MapOfRomania.defaultProps = { 
    // size defaults
    minHeight: 300,
    // color defaults
    defaultPolygonFill: 'lightgray',
    // interaction defaults
    onClick: (d) => {},
    onMouseOver: (d) => {},
    onMouseOut: (d) => {},
    // tooltip defaults
    tooltip: DefaultTooltip
};

export default MapOfRomania;
export { MapOfRomania, MapOfRomanianCounty, MapOfRomanianCity };
