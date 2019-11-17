import React, { useEffect, useRef } from 'react'
import ReactDOMServer from 'react-dom/server';
import classnames from 'classnames'
import { idnames, d3classnames } from '../utils/idnames'

import PathLayer from './layers/PathLayer'
import LabelLayer from './layers/LabelLayer'
import PointLayer from './layers/PointLayer'
import TooltipLayer from './layers/TooltipLayer'

import { geoMercator, geoPath } from 'd3-geo'
import { select, selectAll, mouse } from 'd3'

import withSize from 'react-sizeme'

import {keyBy, merge, mergeWith, values, isEqual} from 'lodash-es'

// const attachTooltip = () => {

// }

const updateTooltip = (mapId, d, node, tooltip) => {
  const position = mouse(node);
  select('#' + idnames(mapId, 'tooltipObject'))
  .attr('x', position[0] + 10)
  .attr('y', position[1] + 10)
  select('#' + idnames(mapId, 'tooltipDiv'))
  .html(typeof(tooltip) === 'function' ? 
    ReactDOMServer.renderToString(tooltip(d.properties)) : '')
}

const removeTooltip = (mapId) => {
  select('#' + idnames(mapId, 'tooltipDiv')).html('')
}

const join = (leftArray, rightArray, leftOn, rightOn) => {
  let leftKeyBy = keyBy(leftArray, item => leftOn(item))
  let rightKeyBy = keyBy(rightArray, item => rightOn(item))
  Object.keys(rightKeyBy).forEach(e => rightKeyBy[e] = {properties: rightKeyBy[e]});
  
  return values(merge(leftKeyBy, rightKeyBy));
}

function BaseMap(props) {

  let width = Math.max(props.minWidth !== undefined ? props.minWidth : 0, props.size.width);
  let height = Math.max(props.minHeight !== undefined ? props.minHeight : 0, props.size.height);

  const projector = geoPath().projection(geoMercator()
    .fitSize([width, height], props.primaryGeoData));

  // assign primaryMapData to primaryGeoData
  const primaryData = (props.primaryMapData !== undefined) ? 
    join(props.primaryGeoData.features, props.primaryMapData,
      leftItem => leftItem.properties.id, rightItem => rightItem.id) : [];

  // assign secondaryMapData to secondaryGeoData
  const secondaryData = (props.secondaryMapData !== undefined) ?
    join(props.secondaryGeoData.features, props.secondaryMapData,
      leftItem => [leftItem.properties.id, leftItem.properties.countyId],
      rightItem => [rightItem.id, rightItem.countyId]) : [];
  
  // filter points
  const pointData = (props.points !== undefined) ? 
    props.pointGeoData.features.filter(point => 
      props.points.indexOf(point.properties.id) >= 0) : props.pointGeoData.features;
  
  useEffect(() => {
    selectAll(d3classnames(props.mapId, 'polygonPathGroup'))
    .data(primaryData, function(d) { return d ? 
      idnames(props.mapId, d.properties.id, 'polygonPathGroup') : this.id; })
    .on('click', function(d) { updateTooltip(props.mapId, d, this, props.tooltip) })
    .on('mousemove', function(d) { updateTooltip(props.mapId, d, this, props.tooltip) })

    select('svg#' + props.mapId).on('mouseout', () => removeTooltip(props.mapId))
  }, [])

  return (
    <div>
      <svg id={props.mapId} width={width} height={height}>
        {
          (props.secondaryMapData !== undefined) ?
            <PathLayer id={props.mapId} projector={projector} data={secondaryData} 
              polygonClass={props.classes.secondaryPolygon}/> : null 
        }
        {
          (props.primaryMapData !== undefined) ?
          <PathLayer id={props.mapId} projector={projector} data={primaryData} 
            polygonClass={props.classes.primaryPolygon}/> : null
        }
        {
          props.showPoints ? 
          <PointLayer id={props.mapId} projector={projector} data={pointData} 
            classes={props.classes}/> : null
        } 
        {
          props.showLabels ? 
            <LabelLayer id={props.mapId} projector={projector} data={props.primaryGeoData.features} 
              classes={props.classes} showDefaultLabels={props.showDefaultLabels}/> : null
        }
        {
          props.showTooltip ? <TooltipLayer id={props.mapId}/> : null
        }
      </svg>
    </div>
  );
}

export default withSize()(BaseMap)