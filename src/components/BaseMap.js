import React from "react"

import PathLayer from "./layers/PathLayer"
import LabelLayer from "./layers/LabelLayer"
import LegendLayer from "./layers/LegendLayer"
import PointLayer from "./layers/PointLayer"
import TooltipLayer from "./layers/TooltipLayer"
import D3Container from "./D3Container"

import { geoMercator, geoPath } from "d3-geo"
import withSize from "react-sizeme"

function BaseMap(props) {
  const { primaryGeoData, pointGeoData } = props
  const { primaryMapData } = props
  const { minWidth, minHeight, size, classes, labels, tooltip, legend } = props

  let width = Math.max(minWidth !== undefined ? minWidth : 0, size.width)
  let height = Math.max(minHeight !== undefined ? minHeight : 0, size.height)

  const projector = geoPath().projection(
    geoMercator().fitSize([width, height], primaryGeoData)
  )

  const style = { overflow: "visible" }

  return (
    <D3Container {...props}>
      <svg width={width} height={height * 1.25} style={style}>
        {primaryMapData !== undefined && (
          <PathLayer
            projector={projector}
            data={primaryGeoData.features}
            polygonClass={classes.primaryPolygon}
          />
        )}
        {props.showLabels && (
          <LabelLayer
            projector={projector}
            data={primaryGeoData.features}
            labels={labels}
            classes={classes}
          />
        )}
        {props.showPoints && (
          // data is already a list of features
          <PointLayer
            projector={projector}
            data={pointGeoData}
            classes={classes}
            showPointLabels={props.showPointLabels}
          />
        )}
        {legend && <LegendLayer y={height} />}
        {tooltip && <TooltipLayer />}
      </svg>
    </D3Container>
  )
}

export default withSize({ monitorWidth: true })(BaseMap)
