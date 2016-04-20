var turf = require('turf');
var fs = require('fs');
var testPoints = fs.readFileSync('./data/data.geojson');
testPoints = JSON.parse(testPoints);

// IDW takes in input
// controlPoints = sampled points dataset
// b = IDW power parameter
// cellWidth = output grid cell size
// units = miles or kilometers
function IDW(controlPoints, b,cellWidth, units) {

   // create sampling point grid Z
  var extent = turf.extent(controlPoints);
  Z = turf.pointGrid(extent, cellWidth, units);
  // create a square grid to visualize the output (like a raster..)
  var squareGrid = turf.squareGrid(turf.extent(Z), cellWidth, units);

  N = Z.features.length;
  idw_arr = [];

  // for every sampling point..
  for (i=0; i<N; i++) {
    zw = 0;
    sw = 0;
    // calculate the distance and idw to each control point
    controlPoints.features.map(function (point) {
      d = turf.distance(Z.features[i], point, units)

      if (d == 0) {
        zw = point.properties.value;
        return
      }
      w = 1.0/Math.pow(d,b);
      sw += w;
      zw += w * point.properties.value
    })
    Z.features[i].properties.idw = zw/sw;
    squareGrid.features[i].properties.z = Z.features[i].properties.idw
    console.log(Z.features[i]);
  }


  // console.log(Z);
  fs.writeFileSync('./pointGrid.geojson', JSON.stringify(Z));
  fs.writeFileSync('./squareGrid.geojson', JSON.stringify(squareGrid));
}

IDW(testPoints,0.5,0.5,'kilometers')

// module.exports.IDW = IDW;
