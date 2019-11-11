import React, { useEffect, useState } from 'react'
import { geoMercator, geoPath } from 'd3-geo'
import withSize from 'react-sizeme'

function BaseMap(props) {
  
  let width = Math.max(props.minWidth !== undefined ? props.minWidth : 0, props.size.width);
  let height = Math.max(props.minHeight !== undefined ? props.minHeight : 0, props.size.height);

  const projector = geoPath().projection(geoMercator()
    .fitSize([width, height], props.geoData));

  // assign mapData to geoItems
  props.geoData.features.map(
    geoItem => Object.assign(geoItem.properties, props.mapData
      .find(mapItem => geoItem.properties.id === mapItem.id)))

  return (
    <div>
      <svg width={width} height={height} style={{background: 'yellow'}}>
        <g>
          {
            props.geoData.features.map((d,i) => (
              <g id={d.properties.id} key={i}>    
                <path
                  id={d.properties.id}
                  d={projector(d.geometry)}
                  strokeWidth={ 0.5 }
                  stroke={'gray'}
                  fill={props.colorFunction(d.properties.pop2011)}/>
              </g>
            ))
          }
        </g>
        { /* draw labels on top of geography */ }
        <g>
          { 
            props.showLabels ? props.geoData.features.map((d,i) => (
              <text 
                key={i}
                x={projector.centroid(d.geometry)[0]} 
                y={projector.centroid(d.geometry)[1]}>
                <tspan>{d.properties.label}</tspan>
              </text>)) : null
          }
        </g>
      </svg>
    </div>
  );
}

export default withSize()(BaseMap)