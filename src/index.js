import React, { Component } from 'react'
import BaseMap from './components/BaseMap'

import PropTypes from 'prop-types';

// geoData
import romania from './data/romania.geo.js'
import capitals from './data/romania.capitals.geo.js'

function DefaultTooltip(props) {
    return <div style={{display: 'inline-block', background: 'white'}}>
        <table> 
            <tr><td>{props.id}</td>
                <td>{props.value}</td>
            </tr>
        </table>
    </div>
}

function MapOfRomania(props) {   
    return <BaseMap geoData={romania} {...props}/>;
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
export { MapOfRomania };
