var turf = require('turf');
var fs = require('fs');
var randomPoints = fs.readFileSync('./data/data.geojson');
randomPoints = JSON.parse(randomPoints);

// console.log(JSON.stringify(randomPoints));

target = {
      "type": "Feature",
      "properties": {
        "marker-color": "#7e7e7e",
        "marker-size": "medium",
        "marker-symbol": "",
        "value = 1": ""
      },
      "geometry": {
        "type": "Point",
        "coordinates": [
          -50.44921875,
          58.63121664342478
        ]
      }
    }

function IDW(Z,b) {

  zw = 0
  sw = 0
  N = Z.length
  Z.map(function (e) {
    d = turf.distance(e, target, 'kilometers')
    if (d == 0) {
      return e.properties.value;
    }
    w = 1.0/Math.pow(d,b);
    sw += w;
    zw += w * e.properties.value
  })
  return zw/sw
}

console.log(IDW(randomPoints.features,0.5));
