import React, { useEffect, useRef } from 'react'
import ReactDOMServer from 'react-dom/server';

import PathLayer from './layers/PathLayer'
import LabelLayer from './layers/LabelLayer'
import PointLayer from './layers/PointLayer'
import TooltipLayer from './layers/TooltipLayer'

import { geoMercator, geoPath } from 'd3-geo'
import { select, mouse } from 'd3'

import withSize from 'react-sizeme'


const updateFillOnPrimaryLayer = (node, props) => {
  updateFillOnPathLayer(node, 'primary', 
    props.primaryMapData, props.defaultPolygonFill);
}

const updateFillOnSecondaryLayer = (node, props) => {
  updateFillOnPathLayer(node, 'secondary', 
    props.secondaryMapData, props.defaultPolygonFill);
}

const updateFillOnPathLayer = (node, pathLayer, data, defaultFill) => {
  select(node)
    .select('#' + pathLayer)
    .selectAll('.polygonPathGroup')
    .data(data, function(d) { return d ? d.id : this.id; }) 
    .select('.polygonPath')
    .style('fill', (d) => {return (d !== undefined) ? d.color : defaultFill })
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
  .select('#' + pathLayer)
  .selectAll('.polygonPathGroup')
  .on('click', function(d) { updateTooltip(node, tooltip(d)) })
  .on('mousemove', function(d) { updateTooltip(node, tooltip(d)) })

  select(node).on('mouseout', () => removeTooltip(node))
}

function BaseMap(props) {

  const node = useRef();

  let width = Math.max(props.minWidth !== undefined ? props.minWidth : 0, props.size.width);
  let height = Math.max(props.minHeight !== undefined ? props.minHeight : 0, props.size.height);

  const projector = geoPath().projection(geoMercator()
    .fitSize([width, height], props.primaryGeoData));

  useEffect(() => {
    if (node.current) {
      props.primaryMapData ? updateFillOnPrimaryLayer(node.current, props) : null;
      props.secondaryMapData ? updateFillOnSecondaryLayer(node.current, props) : null;
      
      attachTooltipToLayer(node.current, 
        props.secondaryTooltip ? 'secondary' : 'primary', props.tooltip);
    }
  }, [props]);

  return (
    <div>
      <svg id={props.mapId} width={width} height={height} ref={node} style={{overflow: 'visible', background: 'yellow'}}>
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
              classes={props.classes}/> : null
        }
        {
          props.showPoints ? 
          <PointLayer projector={projector} data={props.pointGeoData} 
            classes={props.classes}/> : null
        } 
        {
          (props.primaryTooltip || props.secondaryTooltip) ? <TooltipLayer /> : null
        }
      </svg>
    </div>
  );
}

export default withSize()(BaseMap)