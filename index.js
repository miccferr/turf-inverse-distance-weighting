var turf = require('turf');
var fs = require('fs');
var randomPoints = fs.readFileSync('./data/data.geojson');
randomPoints = JSON.parse(randomPoints);

function IDW(Z,b) {

  N = Z.length;
  idw_arr = [];

  for (i=0; i<N; i++) {
    zw = 0;
    sw = 0;

    Z.map(function (point) {
      d = turf.distance(Z[i], point, 'kilometers')
      console.log(d);
      if (d == 0) {
        return point.properties.value;
      }
      w = 1.0/Math.pow(d,b);
      sw += w;
      zw += w * point.properties.value
    })
    Z[i].properties.idw = zw/sw;
  }

  return idw_arr
}
