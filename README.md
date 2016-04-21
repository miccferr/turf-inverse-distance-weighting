# turf-idw
Today a plain IDW alg. implemented in JS. Tomorrow a Turf.js package? Maybe?


### `IDW(controlPoints, b, cellWidth, units)`

Takes a set of known points, a power parameter, a cell depth, a unit of measurement and returns a set of square polygons in a grid with a property IDW for each cell


### Parameters

| parameter   | type           | description                              |
| ----------- | -------------- | ---------------------------------------- |
| `controlPoints`    | FeatureCollection<Point> | Sampled points with known value |
| `valueField`    | String | GeoJSON field containing the data value to interpolate on |
| `b` | Number         | Exponent regulating the distance weighting                       |
| `cellWidth`     | Number         | The distance across each cell               |
| `units`        |String | Used in calculating cellWidth ('miles' or 'kilometers')|

### Example

```js
// load a sample of test points
var fs = require('fs');
// load IDW
var IDW = require('./index.js')
var controlPoints = fs.readFileSync('./data/data.geojson');
controlPoints = JSON.parse(controlPoints);
// produce an interpolated surface
var IDWSurface = IDW(controlPoints,'value', 0.5, 0.1,'kilometers');

```

## Installation & Use

Requires [nodejs](http://nodejs.org/).

`Git clone` this repo, then `require` it

## Tests

```sh
$ npm test
```
