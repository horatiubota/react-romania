import counties from "./romania.counties.topo"
import atus from "./romania.atus.topo"
import cities from "./romania.cities.topo"

import { feature } from "topojson-client"

export default {
  counties: feature(counties, counties.objects['romania.counties']),
  atus: feature(atus, atus.objects['romania.atus.simple']),
  cities: feature(cities, cities.objects['romania.cities'])
}
