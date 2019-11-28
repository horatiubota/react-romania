import React, { useState, useEffect } from 'react'

import { MapOfRomania, MapOfRomanianCounty } from 'numeromania'
import MapConfiguration from './MapConfiguration'

import { makeStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import Box from '@material-ui/core/Box';

import { scaleLinear, extent, range, schemeBlues, schemeReds } from 'd3'

const colorize = (data) => {
    const dataExtent = extent(data)
    const dataRange = range(dataExtent[0], dataExtent[1],
        (dataExtent[1] - dataExtent[0]) / 5)
        
        return scaleLinear().domain(dataRange).range(schemeReds[5])
}

const primaryStyles = {
    label: {
        fill: 'black',
        fontSize: 10,
        fontFamily: 'sans-serif',
        pointerEvents: 'none',
        background: 'white'
    },
    primaryPolygon: {
        strokeWidth: 0.1,
        stroke: 'black',
        strokeOpacity: 1,
        strokeLinejoin: 'round',
        fillOpacity: 0.9,
        transition: 'fill 1s ease',
        '&:hover': {
            stroke: 'black',
            strokeWidth: 0.75,
            strokeOpacity: 0.5,
            fillOpacity: 1
        }
    },
    point: {
        fill: 'blue',
        stroke: 'red',
        strokeWidth: 1,
        strokeLinecap: 'round',
        strokeOpacity: 0.75,
        pointerEvents: 'none'
    },
    pointLabel: {
        fontSize: 12,
        background: 'rgba(255, 255, 255, 0.75)',
        fontFamily: 'sans-serif',
        pointerEvents: 'none',
        display: 'inline-block',
        whiteSpace: 'nowrap',
        padding: 5
    },
    paper: {
        padding: 5,
        color: 'black'
    },
    root: {
        display: 'flex',
      },
    formControl: {
        margin: 3,
    },
}

const secondaryStyles = Object.assign({...primaryStyles}, {
    primaryPolygon: Object.assign({...primaryStyles.primaryPolygon}, {fillOpacity: 0}),
    secondaryPolygon: {
        strokeWidth: 0.5,
        stroke: 'gray',
        strokeOpacity: 0.5,
        fillOpacity: 1,
        transition: 'fill 1s ease',
        pointerEvents: 'none'
    }
});

function Tooltip (props) {
    const style = {
        display: 'inline-block',
        background: 'white',
        padding: '0 1em',
        whiteSpace: 'nowrap'
    }
    
    return <div style={style}>
    <p>{props ? `${props.label}` : 'N/A'}</p>
    <p><small>Populația în 2011: {props ? props.value : 'N/A'}</small></p>
    </div>
}

const getCountyData = (atuData, countyId) => {
    const selectedCountyData = JSON.parse(JSON.stringify(
        atuData.filter(atu => atu.countyId === countyId)));
    const selectedCountyColorFunction = colorize(
        selectedCountyData.map(item => Math.min(item.value, 50000)))
    selectedCountyData.map(item => Object.assign(item, 
        { color: selectedCountyColorFunction(item.value) }))
    
    return selectedCountyData;
}
    
export default function Example (props) {
    const [mapData, setMapData] = useState({ 
        primaryMapData: [], 
        secondaryMapData: [], 
        selectedCountyData: [],
        selectedCounty: 'CJ',
    });

    const primaryClasses = makeStyles(primaryStyles)();
    const secondaryClasses = makeStyles(secondaryStyles)();

    const [mapConfig, setMapConfig] = useState({
        showLabels: true,
        labels: 'CJ, TM, IS, B',
        showPoints: true,
        pointNames: 'Cluj-Napoca, Timișoara, Iași, București',
        pointTypes: 'Municipiu resedinta de judet',
        minHeight: 300,
        minWidth: 300,
        secondaryPaths: false,
    })

    const onCountyClick = d => {
        setMapData({...mapData, 
            selectedCountyData: getCountyData(mapData.secondaryMapData, d.id),
            selectedCounty: d.id
        });
    }

    const handleCheckboxChange = (property) => (event) => {
        setMapConfig({...mapConfig, [property]: !mapConfig[property] })
    };

    const handleInputChange = (property) => (event) => {
        setMapConfig({...mapConfig, [property]: event.target.value })
    };
    
    useEffect(() => {

        const promises = [
            'data/county_population_data.json',
            'data/atu_population_data.json'
        ].map(url => fetch(url).then(response => response.json()))
        
        Promise.all(promises).then(([countyData, atuData]) => {
            const countyColorFunction = colorize(countyData.map(item => Math.max(item.value, 100000)))
            const atuColorFunction = colorize(atuData.map(item => Math.max(item.value, 10000)))
            
            countyData.map(item => Object.assign(item, { color: countyColorFunction(item.value)}))
            atuData.map(item => Object.assign(item, { color: atuColorFunction(item.value) }))
            
            setMapData({ 
                primaryMapData: countyData, 
                secondaryMapData: atuData, 
                selectedCountyData: getCountyData(atuData, 'CJ'),
                selectedCounty: 'CJ'
            })
        })
    }, [])
    
    return (
        <Grid container spacing={1}>
            <Grid item xs={12}><h3>Map of Romania</h3></Grid>
            <Grid item md={6} xs={12}>
                <MapOfRomania
                    {...mapConfig}
                    primaryMapData={mapData.primaryMapData}
                    secondaryMapData={mapConfig.secondaryPaths ? mapData.secondaryMapData : undefined}
                    onClick={onCountyClick}
                    classes={mapConfig.secondaryPaths ? secondaryClasses : primaryClasses}
                    tooltip={Tooltip}/>
                <Box m={3}/>
                <MapConfiguration 
                    handleCheckboxChange={handleCheckboxChange}
                    handleInputChange={handleInputChange}
                    {...mapConfig}
                />
            </Grid>
            <Grid item md={6} xs={12}>
                <MapOfRomanianCounty
                    minHeight={300}
                    showPoints
                    countyId={mapData.selectedCounty}
                    primaryMapData={mapData.selectedCountyData}
                    classes={primaryClasses}
                    tooltip={Tooltip}
                />
            </Grid>
        </Grid>
        );
    }
    