import React, { useEffect, useRef } from 'react'
import ReactDOMServer from 'react-dom/server'
import { select, mouse } from 'd3'

import legend from '../utils/legend'

/*
 Polygons and Points
*/

const getColor = (scale, color, data) => {
    return scale(data.map(item => item.value), color);
}

const getPolygonSelection = (node, layer) => {
    return select(node).select(`#${layer}`).selectAll('.polygonPath')
}

const getPrimaryPolygonSelection = (node) => {
    return getPolygonSelection(node, 'primary')
}

const getSecondaryPolygonSelection = (node) => {
    return getPolygonSelection(node, 'secondary')
}

const getPointSelection = (node) => {
    return select(node).selectAll('.pointCircleGroup')
}

const bindDataToSelection = (selection, data) => {
    selection.datum(() => null).data(data, function(d) { return d ? d.id : this.id })
}

const updateFillOnSelection = (selection, color) => {
    selection.style('fill', d => (d !== undefined) ? color(d.value) : 'transparent')
}

/*
 Tooltip
*/

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
    
const attachTooltipToSelection = (node, selection, tooltip) => {
    // `this` is the element on which the mouse event is triggered
    // passed back to the tooltip function for customization options
    selection.on('mousemove', function(d) { updateTooltip(node, tooltip(d, this)) })
    select(node).on('mouseout', () => removeTooltip(node))
}

/*
 Legend
*/

const onLegendMousemove = (node, classes, bounds, showSecondaryPaths) => {
    const [lower, upper] = bounds;
    
    (showSecondaryPaths ? 
        getSecondaryPolygonSelection(node) :
        getPrimaryPolygonSelection(node)
    ).classed(classes.highlightedPolygon, d => (d.value >= lower && d.value <= upper))
}

const onLegendMouseout = (node, classes, showSecondaryPaths) => {
    (showSecondaryPaths ? 
        getSecondaryPolygonSelection(node) :
        getPrimaryPolygonSelection(node)
    ).classed(classes.highlightedPolygon, false)
}

const updateLegend = (node, color, props) => {
    const { size, legendProps, classes, showSecondaryPaths } = props

    legend({
        ...legendProps,
        node: node,
        color: color,
        tickFormat: ",.2r",
        width: size.width,
        marginLeft: size.width * 0.05,
        marginRight: size.width * 0.05,
        onMousemove: bounds => onLegendMousemove(node, classes, bounds, showSecondaryPaths),
        onMouseout: () => onLegendMouseout(node, classes, showSecondaryPaths)
    });
}

/*
 Click handler
*/

const attachClickHandlerToSelection = (selection, f) => {
    selection.on('click', function(d) { if (typeof f === 'function') { f(d) }});
}
  
export default function D3Container(props) {

    const ref = useRef();
    const [mapSvg] = ref.current ? ref.current.children : []

    const { primaryMapData, secondaryMapData, pointMapData } = props;
    const { size, scale, color, legend, tooltip } = props;

    useEffect(() => {
        if (mapSvg && primaryMapData && primaryMapData.length) {            
            const primaryPolygons = getPrimaryPolygonSelection(mapSvg)
            const primaryColor = getColor(scale, color, primaryMapData)

            bindDataToSelection(primaryPolygons, primaryMapData)
            updateFillOnSelection(primaryPolygons, primaryColor)
            attachTooltipToSelection(mapSvg, primaryPolygons, props.tooltip)        
            attachClickHandlerToSelection(primaryPolygons, props.onClick)

            // secondary paths
            if (secondaryMapData && secondaryMapData.length) {
                const secondaryPolygons = getSecondaryPolygonSelection(mapSvg)
                const secondaryColor = getColor(scale, color, secondaryMapData)
                
                bindDataToSelection(secondaryPolygons, secondaryMapData)
                updateFillOnSelection(secondaryPolygons, secondaryColor)
            }

            // points
            if (pointMapData && pointMapData.length) {
                const points = getPointSelection(mapSvg)

                bindDataToSelection(points, pointMapData)
                attachTooltipToSelection(mapSvg, points, tooltip)
            }
        }
    }, [primaryMapData, secondaryMapData, scale, color])

    // force legend re-draw on size, scale or color change
    useEffect(() => {
        const legendColor = secondaryMapData ? 
            getColor(scale, color, secondaryMapData) :
            getColor(scale, color, primaryMapData)

        mapSvg && updateLegend(mapSvg, legendColor, props)
    }, [size, legend, scale, color])

    return (
        <div ref={ref}>
            {props.children}
        </div>
    )
}
