import React, { useEffect, useMemo, useRef } from "react"
import ReactDOMServer from "react-dom/server"
import { select, mouse } from "d3-selection"

import legend from "../utils/legend"

/*
 Polygons and Points
*/

const getColor = (scale, color, data) => {
  return scale(
    data.map(item => item.value),
    color
  )
}

const getPolygonSelection = node => {
  return select(node).selectAll(".polygonPath")
}

const getPointSelection = node => {
  return select(node).selectAll(".pointCircleGroup")
}

const bindDataToSelection = (selection, data) => {
  selection
    .datum(() => null)
    .data(data, function(d) {
      return d ? d.id : this.id
    })
}

const updateFillOnSelection = (selection, color) => {
  selection.style("fill", d =>
    d !== undefined ? color(d.value) : "transparent"
  )
}

/*
 Tooltip
*/

const updateTooltip = (node, tooltip) => {
  const [cursorX, cursorY] = mouse(node)

  select(node)
    .select("#tooltipObject")
    .attr("x", cursorX + 10)
    .attr("y", cursorY + 10)
    .select("#tooltipDiv")
    .html(ReactDOMServer.renderToString(tooltip))
}

const removeTooltip = node => {
  select(node)
    .select("#tooltipDiv")
    .html("")
}

const attachTooltipToSelection = (node, selection, tooltip) => {
  // `this` is the element on which the mouse event is triggered
  // passed back to the tooltip function for customization options
  selection.on("mousemove", function(d) {
    updateTooltip(node, tooltip(d, this))
  })
  select(node).on("mouseout", () => removeTooltip(node))
}

/*
 Legend
*/

const onLegendMousemove = (node, classes, bounds) => {
  const [lower, upper] = bounds

  getPolygonSelection(node).classed(
    classes.highlightedPolygon,
    d => d.value >= lower && d.value <= upper
  )
}

const onLegendMouseout = (node, classes) => {
  getPolygonSelection(node).classed(classes.highlightedPolygon, false)
}

const updateLegend = (node, color, props) => {
  const { size, legend: legendProps, classes } = props

  legend({
    ...legendProps,
    node: node,
    color: color,
    tickFormat: ",.2r",
    width: size.width,
    marginLeft: size.width * 0.05,
    marginRight: size.width * 0.05,
    onMousemove: bounds => onLegendMousemove(node, classes, bounds),
    onMouseout: () => onLegendMouseout(node, classes),
  })
}

/*
 Click handler
*/

const attachClickHandlerToSelection = (selection, f) => {
  selection.on("click", function(d) {
    if (typeof f === "function") {
      f(d)
    }
  })
}

export default function D3Container(props) {
  const { primaryMapData, pointMapData } = props
  const { size, scale, color, legend, tooltip, onClick } = props

  const ref = useRef()

  const [mapSvg] = useMemo(() => (ref.current ? ref.current.children : []), [
    ref,
    ref.current,
  ])

  const mapColor = useMemo(() => getColor(scale, color, primaryMapData), [
    primaryMapData,
    scale,
    color,
  ])

  const polygons = useMemo(() => getPolygonSelection(mapSvg), [mapSvg])
  const points = useMemo(() => getPointSelection(mapSvg), [mapSvg])

  useEffect(() => {
    if (mapSvg && primaryMapData && primaryMapData.length) {
      bindDataToSelection(polygons, primaryMapData)
      updateFillOnSelection(polygons, mapColor)
      attachTooltipToSelection(mapSvg, polygons, tooltip)
      attachClickHandlerToSelection(polygons, onClick)
    }
  }, [polygons, primaryMapData, scale, color])

  useEffect(() => {
    if (mapSvg && pointMapData && pointMapData.length) {
      bindDataToSelection(points, pointMapData)
      attachTooltipToSelection(mapSvg, points, tooltip)
    }
  }, [points, pointMapData])

  useEffect(() => {
    const legendColor = getColor(scale, color, primaryMapData)

    if (mapSvg && primaryMapData && primaryMapData.length) {
      updateLegend(mapSvg, legendColor, props)
    }
  }, [mapSvg, primaryMapData, legend, size, scale, color])

  return <div ref={ref}>{props.children}</div>
}
