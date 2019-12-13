import React, { useState, useEffect } from "react"

import { MapOfRomania, MapOfRomanianCounty } from "react-romania"
import MapConfiguration from "./MapConfiguration"

import Grid from "@material-ui/core/Grid"
import { makeStyles } from "@material-ui/core/styles"
import { scales, colors } from "../utils/mapConfigOptions"

const primaryStyles = {
  label: {
    fill: "black",
    fontSize: 10,
    fontFamily: "sans-serif",
    pointerEvents: "none",
    background: "white",
  },
  primaryPolygon: {
    strokeWidth: 0.1,
    stroke: "gray",
    strokeOpacity: 1,
    strokeLinejoin: "round",
    fillOpacity: 0.9,
    transition: "fill 0.5s ease",
    "&:hover": {
      stroke: "black",
      strokeWidth: 0.5,
      strokeOpacity: 1,
      fillOpacity: 1,
    },
  },
  highlightedPolygon: {
    fill: "lightgray!important",
    strokeWidth: 0.5,
    stroke: "black",
    strokeOpacity: 1,
    strokeLinejoin: "round",
    fillOpacity: 1,
  },
  point: {
    fill: "blue",
    stroke: "red",
    strokeWidth: 1,
    strokeLinecap: "round",
    strokeOpacity: 0.75,
    // pointerEvents: 'none'
  },
  pointLabel: {
    fontSize: 12,
    background: "rgba(255, 255, 255, 0.75)",
    fontFamily: "sans-serif",
    pointerEvents: "none",
    display: "inline-block",
    whiteSpace: "nowrap",
    padding: 5,
  },
  paper: {
    padding: 5,
    color: "black",
  },
  root: {
    display: "flex",
  },
  formControl: {
    margin: 3,
  },
}

const secondaryStyles = Object.assign(
  { ...primaryStyles },
  {
    primaryPolygon: Object.assign(
      { ...primaryStyles.primaryPolygon },
      { fillOpacity: 0 }
    ),
    secondaryPolygon: {
      strokeWidth: 0.5,
      stroke: "gray",
      strokeOpacity: 0.5,
      fillOpacity: 1,
      transition: "fill 1s ease",
      pointerEvents: "none",
    },
  }
)

function Tooltip(props, element) {
  const style = {
    display: "inline-block",
    background: "white",
    padding: "0 1em",
    whiteSpace: "nowrap",
  }

  return (
    <div style={style}>
      <p>{props ? `${props.label}` : "N/A"}</p>
      <p>
        <small>Populația în 2011: {props ? props.value : "N/A"}</small>
      </p>
    </div>
  )
}

const getCountyData = (atuData, countyId) => {
  // deep copy of the filtered array
  return JSON.parse(
    JSON.stringify(atuData.filter(atu => atu.countyId === countyId))
  )
}

export default function Example(props) {
  const primaryClasses = makeStyles(primaryStyles)()
  const secondaryClasses = makeStyles(secondaryStyles)()

  const [mapData, setMapData] = useState({
    primaryMapData: [],
    secondaryMapData: [],
    pointMapData: [],
    selectedCountyData: [],
    selectedCounty: "",
  })

  const [mapConfig, setMapConfig] = useState({
    minHeight: 300,
    minWidth: 300,
    showLabels: true,
    showPoints: true,
    showPointLabels: true,
    showSecondaryPaths: false,
    labels: ["AB", "BN"],
    pointNames: ["Cluj-Napoca", "Lugoj", "Zimnicea", "București"],
    pointTypes: ["Municipiu reședință de județ"],
    scale: scales[0],
    color: colors[0],
  })

  const onCountyClick = d => {
    const countyData = getCountyData(mapData.secondaryMapData, d.id)

    setMapData({
      ...mapData,
      selectedCountyData: countyData,
      selectedCounty: d.id,
    })
  }

  const handleCheckboxChange = property => event => {
    setMapConfig({ ...mapConfig, [property]: !mapConfig[property] })
  }

  const handleInputChange = property => event => {
    setMapConfig({ ...mapConfig, [property]: event.target.value })
  }

  useEffect(() => {
    const promises = [
      "data/county_population_data.json",
      "data/atu_population_data.json",
      "data/city_population_data.json",
    ].map(url => fetch(url).then(response => response.json()))

    Promise.all(promises).then(([countyData, atuData, cityData]) => {
      setMapData({
        primaryMapData: countyData,
        secondaryMapData: atuData,
        pointMapData: cityData,
        selectedCountyData: getCountyData(atuData, "CJ"),
        selectedCounty: "CJ",
      })
    })
  }, [])

  return (
    <Grid container spacing={4}>
      <Grid item xs={12}>
        <h3>react-romania</h3>
        <p>
          Responsive maps of Romania's administrative units. Made with React
          Hooks, Material UI 4 and D3v5.
        </p>
        <br />
      </Grid>
      <Grid item md={6} xs={12}>
        <MapOfRomania
          {...mapConfig}
          primaryMapData={mapData.primaryMapData}
          pointMapData={mapData.pointMapData}
          scale={mapConfig.scale.scale}
          color={mapConfig.color[mapConfig.scale.colorType]}
          tooltip={Tooltip}
          legend={{ title: "Population" }}
          classes={
            mapConfig.showSecondaryPaths ? secondaryClasses : primaryClasses
          }
          onClick={onCountyClick}
        />
      </Grid>
      <Grid item md={6} xs={12}>
        <MapOfRomanianCounty
          {...mapConfig}
          minHeight={300}
          minWidth={300}
          countyId={mapData.selectedCounty || "CJ"}
          primaryMapData={mapData.selectedCountyData}
          // overwrite mapConfig
          pointNames={[]}
          showSecondaryPaths={false}
          scale={mapConfig.scale.scale}
          color={mapConfig.color[mapConfig.scale.colorType]}
          tooltip={Tooltip}
          legend={{ title: `${mapData.selectedCounty} County Population` }}
          classes={primaryClasses}
        />
      </Grid>
      <Grid item md={12} xs={12}>
        <h3>Configuration</h3>
        <MapConfiguration
          handleCheckboxChange={handleCheckboxChange}
          handleInputChange={handleInputChange}
          {...mapConfig}
        />
      </Grid>
    </Grid>
  )
}
