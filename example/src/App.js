import React, { useState, useEffect } from 'react'

import { MapOfRomania } from 'numeromania'
import { makeStyles } from '@material-ui/core/styles';

import { scaleLinear, extent, range, schemeBlues} from 'd3'

const useStyles = makeStyles({
    label: {
      fill: 'black',
      fontSize: 10,
      fontFamily: 'sans-serif',
      pointerEvents: 'none'
    },
    polygon: {
        strokeWidth: 0.5,
        stroke: 'gray',
        strokeLinejoin: 'round',
        strokeOpacity: 1,
        '&:hover': {
            fill: 'white',
        }
    }
  });

const colorize = (data) => {
    const dataExtent = extent(data)
    const dataRange = range(dataExtent[0], dataExtent[1], 
        (dataExtent[1] - dataExtent[0]) / 5);
        
    return scaleLinear().domain(dataRange).range(schemeBlues[5])
}

function Tooltip(props) {
    return <div style={{display: 'inline-block', background: 'pink'}}>
        <table> 
            <tr><td>{props.id}</td>
                <td>{props.value}</td>
            </tr>
        </table>
    </div>
}

export default function App(props) {

    const [mapData, setMapData] = useState([]);

    useEffect(() => {
        fetch('data/county_population_data.json')
            .then(res => res.json())
            .then(res => {
                setMapData(res.map(item => Object.assign(item, 
                    { 
                        color: colorize(res.map(item => item.value))(item.value),
                        showCapital: true,
                    }
                )))
            });
    }, []);

    return (
    <div>
        <MapOfRomania 
            // showDefaultLabels
            minHeight={500}
            mapData={mapData}
            classes={useStyles()}
            tooltip={Tooltip}/>            
    </div>);
}
