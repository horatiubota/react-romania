import React, { useState, useEffect } from 'react'

import { MapOfRomania } from 'numeromania'
import { makeStyles } from '@material-ui/core/styles';

import { scaleLinear, extent, range, schemeBlues} from 'd3'

const useStyles = makeStyles({
    label: {
      fill: 'black',
      fontSize: 10,
      fontFamily: 'sans-serif',
      pointerEvents: 'none',
      background: 'white'
    },
    primaryPolygon: {
        strokeWidth: 0.5,
        stroke: 'gray',
        strokeOpacity: 1,
        strokeLinejoin: 'round',
        fillOpacity: 1,
        transition: 'fill 1s ease',
        '&:hover': {
            stroke: 'black',
            strokeWidth: 1,
        },
    },
    secondaryPolygon: {
        strokeWidth: 0.1,
        stroke: 'gray',
        strokeLinejoin: 'round',
        fillOpacity: 1,
        pointerEvents: 'none',
        transition: 'fill 1s ease'
    },
    point: {
        stroke: 'red',
        strokeWidth: 5,
        strokeLinecap: 'round',
    },
    pointLabel: {
      fontSize: 12,
      //background: 'white',
      fontFamily: 'sans-serif',
      pointerEvents: 'none',
      display: 'inline-block', 
      whiteSpace: 'nowrap',
      padding: 2
    }
  });

const colorize = (data) => {
    const dataExtent = extent(data)
    const dataRange = range(dataExtent[0], dataExtent[1], 
        (dataExtent[1] - dataExtent[0]) / 5);
        
    return scaleLinear().domain(dataRange).range(schemeBlues[5])
}

function Tooltip(props) {
    const style = {
        display: 'inline-block', 
        background: 'white', 
        padding: '0 1em',
        whiteSpace: 'nowrap'
    }

    return <div style={style}>
        <h5>Județul {props.id}</h5>
        <p>Populația în 2011: {props.value}</p>
    </div>
}

export default function App(props) {

    const [mapData, setMapData] = useState({primaryMapData: [], secondaryMapData:[]})
    
    useEffect(() => {
        const promises = [
            'data/county_population_data.json',
            'data/atu_population_data.json'
        ].map(url => fetch(url).then(response => response.json()));
        
        Promise.all(promises).then(([countyData, atuData]) => {
            const countyColorFunction = colorize(countyData.map(item => item.value))
            const atuColorFunction = colorize(atuData.map(item => Math.min(item.value, 100000)))
            
            countyData.map(item => Object.assign(item, 
                { color: countyColorFunction(item.value), showCapital: true }));
            
            atuData.map(item => Object.assign(item, 
                { color: atuColorFunction(item.value) }))
            
            setMapData({primaryMapData: countyData, secondaryMapData: atuData})
        });
        
    }, []);

    return (
        <div>
            <div>
                <MapOfRomania 
                    mapId={'firstMap'}
                    // showLabels
                    showTooltip
                    showPoints
                    points={['Cluj-Napoca', 'București']}
                    minHeight={500}
                    primaryMapData={mapData.primaryMapData}
                    // secondaryMapData={mapData.secondaryMapData}
                    classes={useStyles()}
                    tooltip={Tooltip}
                    tooltipLevel={'secondary'}/>            
            </div>
        </div>);
}
