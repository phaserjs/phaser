/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Polygon = require('./Polygon');

Polygon.Clone = require('./Clone');
Polygon.Contains = require('./Contains');
Polygon.ContainsPoint = require('./ContainsPoint');
Polygon.Earcut = require('./Earcut');
Polygon.GetAABB = require('./GetAABB');
Polygon.GetNumberArray = require('./GetNumberArray');
Polygon.GetPoints = require('./GetPoints');
Polygon.Perimeter = require('./Perimeter');
Polygon.Reverse = require('./Reverse');
Polygon.Simplify = require('./Simplify');
Polygon.Smooth = require('./Smooth');
Polygon.Translate = require('./Translate');

module.exports = Polygon;
