import React from "react"
import BaseMap from "../components/BaseMap"
import DefaultTooltip from "../components/DefaultTooltip"
import PropTypes from "prop-types"

import filterPoints from "../utils/filterPoints"
import { counties, cities } from "../data"

const MapOfRomania = props => {
  const { pointNames, pointTypes } = props
  const pointGeoData = filterPoints(cities.features, pointNames, pointTypes)

  return (
    <BaseMap primaryGeoData={counties} pointGeoData={pointGeoData} {...props} />
  )
}

MapOfRomania.propTypes = {
  onClick: PropTypes.func,
  onMouseOver: PropTypes.func,
  onMouseOut: PropTypes.func,
  tooltip: PropTypes.func,
}

MapOfRomania.defaultProps = {
  minHeight: 300,
  tooltip: DefaultTooltip,
}

export default MapOfRomania
