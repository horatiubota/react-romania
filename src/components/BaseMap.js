import React from 'react'

import PathLayer from './layers/PathLayer'
import LabelLayer from './layers/LabelLayer'
import PointLayer from './layers/PointLayer'
import TooltipLayer from './layers/TooltipLayer'
import D3Container from './D3Container'

import { geoMercator, geoPath } from 'd3-geo'
import withSize from 'react-sizeme'

function BaseMap(props) {
  
  const { primaryGeoData, secondaryGeoData, pointGeoData, primaryMapData, 
    secondaryMapData, minWidth, minHeight, size, classes, labels, tooltip } = props 
  
  let width = Math.max(minWidth !== undefined ? minWidth : 0, size.width)
  let height = Math.max(minHeight !== undefined ? minHeight : 0, size.height)

  const projector = geoPath().projection(
    geoMercator().fitSize([width, height], primaryGeoData))

  const style = {overflow: 'visible'}

  return (
    <D3Container {...props}>
      <svg width={width} height={height} style={style}>
        {
          (secondaryMapData !== undefined) &&
            <PathLayer layerId='secondary' projector={projector} 
              data={secondaryGeoData.features} polygonClass={classes.secondaryPolygon} />
        }
        {
          (primaryMapData !== undefined) &&
          <PathLayer layerId='primary' projector={projector} data={primaryGeoData.features}
            polygonClass={classes.primaryPolygon} />
        }
        {
          props.showLabels && 
            <LabelLayer projector={projector} data={primaryGeoData.features} 
              labels={labels} classes={classes} />
        }
        {
          props.showPoints && 
          // data is already a list of features
          <PointLayer projector={projector} data={pointGeoData} classes={classes} /> 
        } 
        {
          (tooltip !== undefined) && <TooltipLayer />
        }
      </svg>
      <svg width={width} height={height * 0.2} />
    </D3Container>
  );
}

export default withSize({
  monitorWidth: true, 
  monitorHeight: false   
})(BaseMap)