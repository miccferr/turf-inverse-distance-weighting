var distance = require('turf-distance');
var squareG = require('turf-square-grid');
var centroid = require('turf-centroid');
var extent = require('turf-extent');

/**
* Takes a set of known points, a power parameter, a cell depth, a unit of measurement
* and returns a set of square polygons in a grid with a property IDW for each cell
*
* [description]
* @param  {FeatureCollection<Point>} controlPoints Sampled points at known locations
* @param  {Number} b             Exponent to alter the distance weight
* @param  {Number} cellWidth     The distance across each cell
* @param  {String} units         Used in calculating cellWidth ('miles' or 'kilometers')
*/
module.exports =  function (controlPoints, b, cellWidth, units) {

  // create a sample square grid
  // compared to a point grid helps visualizing the output (like a raster..)
  var squareGrid = turf.squareGrid(turf.extent(controlPoints), cellWidth, units);

  N = squareGrid.features.length;
  idw_arr = [];

  // for every sampling point..
  for (i = 0; i < N; i++) {
    zw = 0;
    sw = 0;
    // calculate the distance from each control point to cell's centroid
    controlPoints.features.map(function (point) {
        d = turf.distance(turf.centroid(squareGrid.features[i]), point, units)

        if (d == 0) {
          zw = point.properties.value;
          return
        }
        w = 1.0 / Math.pow(d, b);
        sw += w;
        zw += w * point.properties.value
      })
      // write IDW value for each cell
    squareGrid.features[i].properties.z = zw / sw
  }

  return squareGrid;

}
