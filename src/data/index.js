import countiesTopojson from "./romania.counties.topo"
import atusTopojson from "./romania.atus.topo"
import citiesTopojson from "./romania.cities.topo"

import { feature } from "topojson-client"

const counties = feature(
  countiesTopojson,
  countiesTopojson.objects["romania.counties"]
)
const atus = feature(atusTopojson, atusTopojson.objects["romania.atus.simple"])
const cities = feature(citiesTopojson, citiesTopojson.objects["romania.cities"])

export { counties, atus, cities }
