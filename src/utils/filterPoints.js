export default (points, pointNames, pointTypes, countyId) => {

  // filter points by countyId
  points =
    countyId !== undefined
      ? points.filter(point => countyId === point.properties.countyId)
      : points

  // filter points by type
  points =
    pointTypes && pointTypes.length
      ? points.filter(point => pointTypes.indexOf(point.properties.type) >= 0)
      : points

  // filter points by name
  points =
    pointNames && pointNames.length
      ? points.filter(point => pointNames.indexOf(point.properties.name) >= 0)
      : points

  
  return points
}
