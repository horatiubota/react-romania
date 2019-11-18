import React, { Component } from 'react'
import BaseMap from './components/BaseMap'

import PropTypes from 'prop-types';

// geoData
import romania from './data/romania.geo.js'
import cities from './data/romania.cities.geo.js'
import atus from './data/romania.atus.simple.geo.js'

function DefaultTooltip(props) {
    return <div style={{display: 'inline-block', background: 'white'}}>
        <table> 
            <tr><td>{props.id}</td>
                <td>{props.value}</td>
            </tr>
        </table>
    </div>
}

function MapOfRomanianCounty(props) {
    
    const pointGeoData = props.points ?
     cities.features.filter(city => props.points.indexOf(city.properties.id) >= 0) : 
     props.showPoints ? 
        cities.features.filter(city => city.properties.countyId === props.countyId) : 
        null;

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
    
    const pointGeoData = props.points ? cities.features.filter(city => 
        props.points.indexOf(city.properties.id) >= 0) : cities.features;

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
export { MapOfRomania, MapOfRomanianCounty };
