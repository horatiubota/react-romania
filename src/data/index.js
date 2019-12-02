import counties from './romania.counties.geo'
import atus from './romania.atus.geo'
import cities from './romania.cities.geo'

// loading and parsing json strings is
// faster than loading objects directly
export default {
    counties: JSON.parse(counties),
    atus: JSON.parse(atus),
    cities: JSON.parse(cities)
}
