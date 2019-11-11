import React, { Component } from 'react'
import PropTypes from 'prop-types'

import BaseMap from './components/BaseMap'

// geoData
import romania from './data/romania.geo.js'

function MapOfRomania(props) {   
    return <BaseMap geoData={romania} {...props}/>;
}

MapOfRomania.propTypes = {
    colorFunction: PropTypes.func,
};

MapOfRomania.defaultProps = { 
    // size defaults
    minHeight: 300,
    // function defaults
    colorFunction: () => { return "hsl(" + Math.random() * 360 + ", 100%, 50%)"; } 
};

export default MapOfRomania;
export { MapOfRomania };
