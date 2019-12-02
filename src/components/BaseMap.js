import React, { useEffect, useRef } from 'react'
import ReactDOMServer from 'react-dom/server';

import PathLayer from './layers/PathLayer'
import LabelLayer from './layers/LabelLayer'
import PointLayer from './layers/PointLayer'
import TooltipLayer from './layers/TooltipLayer'

import { geoMercator, geoPath } from 'd3-geo'
import { select, mouse, scaleSequentialQuantile, interpolateBlues } from 'd3'

import legend from '../utils/legend'

import withSize from 'react-sizeme'

const getColor = (data, interpolator) => {
  return scaleSequentialQuantile(data.map(item => item.value), interpolator);
}

const attachClickHandlerToLayer = (node, pathLayer, f) => {
  select(node)
  .select(`#${pathLayer}`)
  .selectAll('.polygonPath')
  .on('click', function(d) { if (typeof f === 'function') { f(d) }});
}

const updateFillOnPrimaryLayer = (node, props) => {
  updateFillOnPathLayer(node, 'primary', props.primaryMapData, props);
}

const updateFillOnSecondaryLayer = (node, props) => {
  updateFillOnPathLayer(node, 'secondary', props.secondaryMapData, props);
}

const updateFillOnPathLayer = (node, pathLayer, data, props) => {
  const color = getColor(data, props.legend ? props.legend.color : interpolateBlues);
  
  select(node)
    .select(`#${pathLayer}`)
    .selectAll('.polygonPath')
    .datum(() => null)
    .data(data, function(d) { return d ? d.id : this.id })
    .style('fill', (d) => {return (d !== undefined) ? color(d.value) : props.defaultFill })
}

const updateTooltip = (node, tooltip) => {
  const [cursorX, cursorY] = mouse(node);
  
  select(node)
  .select('#tooltipObject')
  .attr('x', cursorX + 10)
  .attr('y', cursorY + 10)
  .select('#tooltipDiv')
  .html(ReactDOMServer.renderToString(tooltip))
}

const removeTooltip = (node) => {
  select(node).select('#tooltipDiv').html('')
}

const attachTooltipToLayer = (node, pathLayer, tooltip) => {
  select(node)
  .select(`#${pathLayer}`)
  .selectAll('.polygonPath')
  .on('mousemove', function(d) { updateTooltip(node, tooltip(d, this)) })

  select(node).on('mouseout', () => removeTooltip(node))
}

const attachTooltipToPoints = (node, props) => {
  select(node)
  .selectAll('.pointCircleGroup')
  .datum(() => null)
  .data(props.pointMapData, function(d) { return d ? d.id : this.id })
  .on('mouseover', function(d) { updateTooltip(node, props.tooltip(d, this))})
}

const drawLegend = (node, props) => {
  const color = getColor(props.primaryMapData, 
    props.legend ? props.legend.color : interpolateBlues);

  legend(node, Object.assign({...props.legend}, {
    color: color,
    tickFormat: ",.2r",
    width: props.size.width,
    marginLeft: props.size.width * 0.1,
    marginRight: props.size.width * 0.1,
  }));
}

function BaseMap(props) {
  
  const { 
    primaryGeoData, secondaryGeoData, pointGeoData, 
    primaryMapData, secondaryMapData, pointMapData, 
    classes, labels, tooltip, legend, 
    minWidth, minHeight, size, onClick
  } = props; 

  const mapRef = useRef();
  const legendRef = useRef();
  
  let width = Math.max(minWidth !== undefined ? minWidth : 0, size.width);
  let height = Math.max(minHeight !== undefined ? minHeight : 0, size.height);

  const mercator = geoMercator().fitSize([width, height], primaryGeoData)
  const projector = geoPath().projection(mercator);

  const style = {overflow: 'visible'};

  useEffect(() => {
    if (mapRef.current && primaryMapData.length) {
      primaryMapData && updateFillOnPrimaryLayer(mapRef.current, props);
      secondaryMapData && updateFillOnSecondaryLayer(mapRef.current, props);
      pointMapData && attachTooltipToPoints(mapRef.current, props);

      attachClickHandlerToLayer(mapRef.current, 
        props.secondaryClick ? 'secondary' : 'primary', onClick)
      
      attachTooltipToLayer(mapRef.current, 
        props.secondaryTooltip ? 'secondary' : 'primary', tooltip);
    }
  }, [primaryMapData, secondaryMapData]);

  useEffect(() => {
    if (mapRef.current && primaryMapData.length) {
      primaryMapData && updateFillOnPrimaryLayer(mapRef.current, props);
    }
  }, [legend.color]);  

  useEffect(() => {
    if (legendRef.current && primaryMapData.length) {
      legend && drawLegend(legendRef.current, props);
    }
  }, [size]);

  return (
    <div>
      <svg width={width} height={height} ref={mapRef} style={style}>
        {
          (secondaryMapData !== undefined) &&
            <PathLayer layerId={'secondary'} projector={projector} data={secondaryGeoData.features} 
              polygonClass={props.classes.secondaryPolygon} />
        }
        {
          (props.primaryMapData !== undefined) &&
          <PathLayer layerId={'primary'} projector={projector} data={primaryGeoData.features}
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
          <PointLayer projector={projector} data={pointGeoData} 
            classes={classes} /> 
        } 
        {
          (tooltip !== undefined) && <TooltipLayer />
        }
      </svg>
      <svg width={width} height={height * 0.2} ref={legendRef} style={style} />
    </div>
  );
}

export default withSize()(BaseMap)