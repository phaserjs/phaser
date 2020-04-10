/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Triangle = require('./Triangle');

Triangle.Area = require('./Area');
Triangle.BuildEquilateral = require('./BuildEquilateral');
Triangle.BuildFromPolygon = require('./BuildFromPolygon');
Triangle.BuildRight = require('./BuildRight');
Triangle.CenterOn = require('./CenterOn');
Triangle.Centroid = require('./Centroid');
Triangle.CircumCenter = require('./CircumCenter');
Triangle.CircumCircle = require('./CircumCircle');
Triangle.Clone = require('./Clone');
Triangle.Contains = require('./Contains');
Triangle.ContainsArray = require('./ContainsArray');
Triangle.ContainsPoint = require('./ContainsPoint');
Triangle.CopyFrom = require('./CopyFrom');
Triangle.Decompose = require('./Decompose');
Triangle.Equals = require('./Equals');
Triangle.GetPoint = require('./GetPoint');
Triangle.GetPoints = require('./GetPoints');
Triangle.InCenter = require('./InCenter');
Triangle.Perimeter = require('./Perimeter');
Triangle.Offset = require('./Offset');
Triangle.Random = require('./Random');
Triangle.Rotate = require('./Rotate');
Triangle.RotateAroundPoint = require('./RotateAroundPoint');
Triangle.RotateAroundXY = require('./RotateAroundXY');

module.exports = Triangle;
