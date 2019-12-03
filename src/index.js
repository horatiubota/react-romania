import React, { Component } from 'react'
import BaseMap from './components/BaseMap'
import DefaultTooltip from './components/DefaultTooltip'
import PropTypes from 'prop-types';

// geoData
import geoData from './data'
const { counties, atus, cities } = geoData;

const filterPoints = (points, pointNames, pointTypes, countyId) => {
    // filter points by name
    points = (pointNames && pointNames.length) ?
        points.filter(point => pointNames.indexOf(point.properties.name) >= 0) : points
    
    // filter points by type
    points = (pointTypes && pointTypes.length) ? 
        points.filter(point => pointTypes.indexOf(point.properties.type) >= 0) : points
    
    // filter points by countyId
    points = (countyId !== undefined) ? 
        points.filter(point => countyId === point.properties.countyId) : points
    
    return points
}

function MapOfRomanianCounty(props) {
    const { pointNames, pointTypes, countyId } = props
    const pointGeoData = filterPoints(cities.features, 
        pointNames, pointTypes, countyId)
    
    const countyGeoData = {
        features: atus.features.filter(atu => 
            atu.properties.countyId === props.countyId),
        type: 'FeatureCollection'
    }

    return (
        <BaseMap
            primaryGeoData={countyGeoData}
            pointGeoData={pointGeoData}
            {...props}/>
    )
}

function MapOfRomania(props) {

    const { pointNames, pointTypes } = props
    const pointGeoData = filterPoints(cities.features, pointNames, pointTypes)
        
    return (
        <BaseMap 
            primaryGeoData={counties} 
            secondaryGeoData={atus} 
            pointGeoData={pointGeoData}
            {...props}/>
    )
}

MapOfRomania.propTypes = {
    onClick: PropTypes.func,
    onMouseOver: PropTypes.func,
    onMouseOut: PropTypes.func,
    tooltip: PropTypes.func
}

MapOfRomania.defaultProps = { 
    // size defaults
    minHeight: 300,
    // tooltip defaults
    tooltip: DefaultTooltip
}

export default MapOfRomania
export { MapOfRomania, MapOfRomanianCounty }
