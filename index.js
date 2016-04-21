var distance = require('turf-distance');
var squareGrid = require('turf-square-grid');
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
* @return {FeatureCollection<Polygon>} grid A grid of polygons where each cell has an IDW value
*/
module.exports = function IDW(controlPoints, b, cellWidth, units) {
  // create a sample square grid
  // compared to a point grid helps visualizing the output (like a raster..)
  var samplingGrid = squareGrid(extent(controlPoints), cellWidth, units);
  var N = samplingGrid.features.length;

  // for every sampling point..
  for (var i = 0; i < N; i++) {
    var w;
    var zw = 0;
    var sw = 0;
    // calculate the distance from each control point to cell's centroid
    var calcParams = function(point){
      var d = distance(centroid(samplingGrid.features[i]), point, units);
      if (d === 0) {
        zw = point.properties.value;
        return;
      }
      w = 1.0 / Math.pow(d, b);
      sw += w;
      zw += w * point.properties.value;
    };
    controlPoints.features.map(calcParams(point))
      // write IDW value for each cell
    samplingGrid.features[i].properties.z = zw / sw;
  }
  return squareGrid;
};
