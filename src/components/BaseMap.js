import React, { useEffect } from 'react'
import ReactDOMServer from 'react-dom/server';
import classnames from 'classnames'

import { geoMercator, geoPath } from 'd3-geo'
import { select, selectAll, mouse } from 'd3'

import withSize from 'react-sizeme'

const updateTooltip = (d, node, tooltip) => {
  const position = mouse(node);
  select('foreignObject#tooltip')
  .attr('x', position[0] + 10)
  .attr('y', position[1] + 10)
  .select('div.tooltip')
  .html(typeof(tooltip) === 'function' ? 
    ReactDOMServer.renderToString(tooltip(d.properties)) : '')
}

const removeTooltip = () => {
  select('foreignObject#tooltip')
  .select('div.tooltip')
  .html('')
}

function BaseMap(props) {

  let width = Math.max(props.minWidth !== undefined ? props.minWidth : 0, props.size.width);
  let height = Math.max(props.minHeight !== undefined ? props.minHeight : 0, props.size.height);

  const projector = geoPath().projection(geoMercator()
    .fitSize([width, height], props.geoData));

  // assign mapData to geoItems
  props.geoData.features.map(
    geoItem => Object.assign(geoItem.properties, props.mapData
      .find(mapItem => geoItem.properties.id === mapItem.id)))
  
  useEffect(() => {
    selectAll('.polygonGroup')
    .data(props.geoData.features, function(d) { return d ? d.properties.id : this.id; })
    .on('click', function(d) { updateTooltip(d, this, props.tooltip) })
    .on('mousemove', function(d) { updateTooltip(d, this, props.tooltip) })

    select('svg').on('mouseout', removeTooltip)
  }, [])

  return (
    <div>
      <svg className="svg" width={width} height={height} style={{background: 'yellow'}}>
        <g className="polygons">
          {
            props.geoData.features.map((d,i) => (
              <g 
                key={i}
                id={d.properties.id} 
                className="polygonGroup" >    
                <path
                  id={d.properties.id}
                  className={classnames(props.classes.polygon, 'polygonPath')}
                  d={projector(d.geometry)}
                  fill={d.properties.color || props.defaultPolygonFill}>
                </path>
              </g>
            ))
          }
        </g>
        { /* draw labels on top of geography */ }
        <g>
          { 
            props.geoData.features.map((d,i) => (
              <text
                key={i}
                x={projector.centroid(d.geometry)[0] * 0.99} 
                y={projector.centroid(d.geometry)[1] * 1.01}>
                <tspan className={props.classes.label}>
                  {
                    props.showDefaultLabels ? 
                      d.properties.defaultLabel : d.properties.label 
                  }
                </tspan>
              </text>))
          }
        </g>
        { /* tooltip placeholder */ }
        <g>
          <foreignObject id="tooltip" width={1} height={1} 
            style={{pointerEvents: 'none', overflow: 'visible'}}>
            <div className="tooltip"></div>
          </foreignObject>
        </g> 
      </svg>
    </div>
  );
}

export default withSize()(BaseMap)