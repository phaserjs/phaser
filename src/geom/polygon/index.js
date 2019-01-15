/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2019 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var Polygon = require('./Polygon');

Polygon.Clone = require('./Clone');
Polygon.Contains = require('./Contains');
Polygon.ContainsPoint = require('./ContainsPoint');
Polygon.GetAABB = require('./GetAABB');
Polygon.GetNumberArray = require('./GetNumberArray');
Polygon.GetPoints = require('./GetPoints');
Polygon.Perimeter = require('./Perimeter');
Polygon.Reverse = require('./Reverse');
Polygon.Smooth = require('./Smooth');

module.exports = Polygon;
