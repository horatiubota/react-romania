/*
 Adapted from https://observablehq.com/@d3/color-legend
*/

import { range, quantile } from "d3-array"
import { select, mouse } from "d3-selection"
import { format } from "d3-format"
import { interpolateRound } from "d3-interpolate"
import { scaleLinear } from "d3-scale"
import { axisBottom } from "d3-axis"

function legend({
  node,
  color,
  title,
  tickSize = 5,
  width = 320,
  height = 46 + tickSize,
  marginTop = 18,
  marginRight = 0,
  marginBottom = 16 + tickSize,
  marginLeft = 0,
  ticks = width / 64,
  tickFormat,
  tickValues,
  onMousemove,
  onMouseout,
  onMouseclick,
} = {}) {
  let x
  const svg = select(node).select("#legendGroup")

  // Continuous
  if (color.interpolator) {
    x = Object.assign(
      color
        .copy()
        .interpolator(interpolateRound(marginLeft, width - marginRight)),
      {
        range() {
          return [marginLeft, width - marginRight]
        },
      }
    )

    // scaleSequentialQuantile doesn’t implement ticks or tickFormat.
    if (!x.ticks) {
      if (tickValues === undefined) {
        const n = Math.round(ticks + 1)
        tickValues = range(n).map(i => quantile(color.domain(), i / (n - 1)))
      }
      if (typeof tickFormat !== "function") {
        tickFormat = format(tickFormat === undefined ? ",f" : tickFormat)
      }
    } else {
      tickValues = x.ticks()
    }

    // remove image before re-drawing
    svg.select("image").remove()

    const imageWidth = width - marginLeft - marginRight
    const segmentWidth = 1 / (tickValues.length - 1)
    const getLegendSegmentIndex = ([cursorX, ,]) => {
      const cursorPosition = (cursorX - marginLeft) / imageWidth
      return Math.floor(cursorPosition / segmentWidth)
    }

    svg
      .append("image")
      .attr("x", marginLeft)
      .attr("y", marginTop)
      .attr("width", width - marginLeft - marginRight)
      .attr("height", height - marginTop - marginBottom)
      .attr("preserveAspectRatio", "none")
      .attr("xlink:href", ramp(color.interpolator()).toDataURL())
      // sequential scales do not implement invertExtent,
      // approximate based on image and segment width
      .on("mousemove", () => {
        if (typeof onMousemove === "function") {
          const segmentIndex = getLegendSegmentIndex(mouse(node))
          onMousemove(tickValues.slice(segmentIndex, segmentIndex + 2))
        }
      })
      .on("mouseout", () => typeof onMouseout === "function" && onMouseout())
  }

  // Discrete
  else if (color.invertExtent) {
    const thresholds = color.thresholds
      ? color.thresholds() // scaleQuantize
      : color.quantiles
      ? color.quantiles() // scaleQuantile
      : color.domain() // scaleThreshold

    const thresholdFormat =
      tickFormat === undefined
        ? d => d
        : typeof tickFormat === "string"
        ? format(tickFormat)
        : tickFormat

    x = scaleLinear()
      .domain([-1, color.range().length - 1])
      .rangeRound([
        Math.round(marginLeft - 1),
        Math.round(width - marginRight + 1),
      ])

    svg.select("#legendRects").remove()

    svg
      .append("g")
      .attr("id", "legendRects")
      .selectAll("rect")
      .data(color.range())
      .join("rect")
      .attr("x", (d, i) => x(i - 1))
      .attr("y", marginTop)
      .attr("width", (d, i) => x(i) - x(i - 1))
      .attr("height", height - marginTop - marginBottom)
      .attr("fill", d => d)
      .on(
        "mousemove",
        d =>
          typeof onMousemove === "function" &&
          onMousemove(color.invertExtent(d))
      )
      .on("mouseout", () => typeof onMouseout === "function" && onMouseout())

    tickValues = range(thresholds.length)
    tickFormat = i => thresholdFormat(thresholds[i], i)
  }

  // remove all axis symbols before re-drawing
  svg.select("#legendSymbols").remove()

  svg
    .append("g")
    .attr("id", "legendSymbols")
    .attr("transform", `translate(0, ${height - marginBottom})`)
    .call(
      axisBottom(x)
        .ticks(ticks, typeof tickFormat === "string" ? tickFormat : undefined)
        .tickFormat(typeof tickFormat === "function" ? tickFormat : undefined)
        .tickSize(tickSize)
        .tickValues(tickValues)
    )
    .call(g =>
      g.selectAll(".tick line").attr("y1", marginTop + marginBottom - height)
    )
    .call(g => g.select(".domain").remove())
    .call(g =>
      g
        .append("text")
        .attr("x", marginLeft)
        .attr("y", marginTop + marginBottom - height - 6)
        .attr("fill", "currentColor")
        .attr("text-anchor", "start")
        .attr("font-weight", "bold")
        .text(title)
    )

  return svg.node()
}

function ramp(color, n = 256) {
  const canvas = document.createElement("canvas")
  canvas.width = n
  canvas.height = 1

  const context = canvas.getContext("2d")

  for (let i = 0; i < n; ++i) {
    context.fillStyle = color(i / (n - 1))
    context.fillRect(i, 0, 1, 1)
  }

  return canvas
}

export default legend
