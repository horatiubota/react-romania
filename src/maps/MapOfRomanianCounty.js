import React from "react"
import BaseMap from "../components/BaseMap"
import DefaultTooltip from "../components/DefaultTooltip"
import PropTypes from "prop-types"

import filterPoints from "../utils/filterPoints"
import { atus, cities } from "../data"

const MapOfRomanianCounty = props => {
  const { pointNames, pointTypes, countyId } = props
  const pointGeoData = filterPoints(
    cities.features,
    pointNames,
    pointTypes,
    countyId
  )

  const countyGeoData = {
    features: atus.features.filter(
      atu => atu.properties.countyId === props.countyId
    ),
    type: "FeatureCollection",
  }

  return (
    <BaseMap
      primaryGeoData={countyGeoData}
      pointGeoData={pointGeoData}
      {...props}
    />
  )
}

MapOfRomanianCounty.propTypes = {
  onClick: PropTypes.func,
  onMouseOver: PropTypes.func,
  onMouseOut: PropTypes.func,
  tooltip: PropTypes.func,
}

MapOfRomanianCounty.defaultProps = {
  minHeight: 300,
  tooltip: DefaultTooltip,
}

export default MapOfRomanianCounty
