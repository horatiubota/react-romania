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

  const node = useRef();
  const legend = useRef();
  
  let width = Math.max(props.minWidth !== undefined ? props.minWidth : 0, props.size.width);
  let height = Math.max(props.minHeight !== undefined ? props.minHeight : 0, props.size.height);

  const mercator = geoMercator().fitSize([width, height], props.primaryGeoData)
  const projector = geoPath().projection(mercator);

  useEffect(() => {
    if (node.current && props.primaryMapData.length) {
      props.primaryMapData ? updateFillOnPrimaryLayer(node.current, props) : null;
      props.secondaryMapData ? updateFillOnSecondaryLayer(node.current, props) : null;
      props.pointMapData ? attachTooltipToPoints(node.current, props): null;

      attachClickHandlerToLayer(node.current, 
        props.secondaryClick ? 'secondary' : 'primary', props.onClick)
      
      attachTooltipToLayer(node.current, 
        props.secondaryTooltip ? 'secondary' : 'primary', props.tooltip);
      
      props.legend ? drawLegend(legend.current, props) : null;
    }
  }, [props.primaryMapData, props.secondaryMapData]);

  return (
    <div>
      <svg id={props.mapId} width={width} height={height} ref={node} style={{overflow: 'visible'}}>
        {
          (props.secondaryMapData !== undefined) ?
            <PathLayer layerId={'secondary'} projector={projector} data={props.secondaryGeoData.features} 
              polygonClass={props.classes.secondaryPolygon}/> : null 
        }
        {
          (props.primaryMapData !== undefined) ?
          <PathLayer layerId={'primary'} projector={projector} data={props.primaryGeoData.features}
            polygonClass={props.classes.primaryPolygon}/> : null
        }
        {
          props.showLabels ? 
            <LabelLayer projector={projector} data={props.primaryGeoData.features} 
              labels={props.labels} classes={props.classes}/> : null
        }
        {
          props.showPoints ? 
          // data is already a list of features
          <PointLayer projector={projector} data={props.pointGeoData} 
            classes={props.classes}/> : null
        } 
        {
          (props.tooltip !== undefined) ? <TooltipLayer /> : null
        }
      </svg>
      <svg ref={legend} width={width} height={height * 0.2} style={{overflow: 'visible'}}></svg>
    </div>
  );
}

export default withSize()(BaseMap)