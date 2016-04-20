var turf = require('turf');
var fs = require('fs');
var testPoints = fs.readFileSync('./data/data.geojson');
testPoints = JSON.parse(testPoints);

// IDW takes in input
// Z = grid points dataset
// b = IDW power
// cellWidth = output grid cell size
// units = miles or kilometers

function IDW(controlPoints, b,cellWidth, units) {

   // create sampling point grid Z
  var extent = turf.extent(controlPoints);
  Z = turf.pointGrid(extent, cellWidth, units);

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
    console.log(Z.features[i]);
  }
  // console.log(Z);
  fs.writeFileSync('./output.geojson', JSON.stringify(Z));


}

IDW(testPoints,0.5,3,'kilometers')
