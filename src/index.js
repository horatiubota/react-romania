import React, { Component } from 'react'
import BaseMap from './components/BaseMap'
import DefaultTooltip from './components/DefaultTooltip'
import PropTypes from 'prop-types';

// geoData
import geoData from './data'
const { counties, atus, cities } = geoData;

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

function MapOfRomanianCounty(props) {
    
    const pointGeoData = filterPoints(cities.features, props);
    const countyGeoData = {
        features: atus.features.filter(atu => 
            atu.properties.countyId == props.countyId),
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
        primaryGeoData={counties} 
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
    // tooltip defaults
    tooltip: DefaultTooltip
};

export default MapOfRomania;
export { MapOfRomania, MapOfRomanianCounty };
