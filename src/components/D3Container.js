import React, { useEffect, useMemo, useRef } from "react"
import { select, mouse } from "d3-selection"

import legend from "../utils/legend"

/*
 Polygons and Points
*/

const getColor = (scale, color, data, key) => {
  return scale(
    data.map(item => item.value[key] || item.value),
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
    .exit()
    .remove()
}

const updateFillOnSelection = (selection, color, key) => {
  selection.style("fill", d =>
    d !== undefined ? color(d.value[key] || d.value) : "transparent"
  )
}

/*
 Tooltip
*/

const updateTooltip = (node, html) => {
  const [cursorX, cursorY] = mouse(node)

  select(node)
    .select("#tooltipObject")
    .attr("x", cursorX + 10)
    .attr("y", cursorY + 10)
    .select("#tooltipDiv")
    .html(html)
}

const removeTooltip = node => {
  select(node)
    .select("#tooltipDiv")
    .html("")
}

const attachTooltipToSelection = (node, selection, tooltip, key) => {
  // `this` is the element on which the mouse event is triggered
  // passed back to the tooltip function for customization options
  selection.on("mousemove", function(d) {
    updateTooltip(node, tooltip(d, this, key))
  })
  select(node).on("mouseout", () => removeTooltip(node))
}

/*
 Legend
*/

const onLegendMousemove = (node, classes, bounds, key) => {
  const [lower, upper] = bounds

  getPolygonSelection(node).classed(
    classes.highlightedPolygon,
    d =>
      (d.value[key] || d.value) >= lower && (d.value[key] || d.value) <= upper
  )
}

const onLegendMouseout = (node, classes) => {
  getPolygonSelection(node).classed(classes.highlightedPolygon, false)
}

const updateLegend = (node, color, props) => {
  const { size, legend: legendProps, classes, dataKey } = props

  legend({
    ...legendProps,
    node: node,
    color: color,
    tickFormat: ",.2r",
    width: size.width,
    marginLeft: size.width * 0.05,
    marginRight: size.width * 0.05,
    onMousemove: bounds => onLegendMousemove(node, classes, bounds, dataKey),
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
  const { primaryMapData, pointMapData, dataKey } = props
  const { size, scale, color, tooltip, onClick } = props

  const ref = useRef()

  const [mapSvg] = useMemo(() => (ref.current ? ref.current.children : []), [
    ref.current,
  ])

  const mapColor = useMemo(
    () => getColor(scale, color, primaryMapData, dataKey),
    [primaryMapData, dataKey, scale, color]
  )

  const isMounted = () => mapSvg && primaryMapData && primaryMapData.length

  useEffect(() => {
    isMounted &&
      bindDataToSelection(getPolygonSelection(mapSvg), primaryMapData)
  }, [primaryMapData])

  useEffect(() => {
    isMounted &&
      updateFillOnSelection(getPolygonSelection(mapSvg), mapColor, dataKey)
  }, [dataKey, mapColor])

  useEffect(() => {
    isMounted &&
      attachTooltipToSelection(
        mapSvg,
        getPolygonSelection(mapSvg),
        tooltip,
        dataKey
      )
  }, [primaryMapData, dataKey])

  useEffect(() => {
    if (mapSvg && pointMapData && pointMapData.length) {
      const points = getPointSelection(mapSvg)
      bindDataToSelection(points, pointMapData)
      attachTooltipToSelection(mapSvg, points, tooltip, dataKey)
    }
  }, [pointMapData])

  useEffect(() => {
    isMounted && updateLegend(mapSvg, mapColor, props)
  }, [mapSvg, primaryMapData, mapColor, size])

  return <div ref={ref}>{props.children}</div>
}
